import { AIRSPACE_ACCENT, FACULTY_ACCENT, MEDICAL_ACCENT, PRISM_ACCENT } from "@/lib/illustration-tokens";
import { ACCENT_SECONDARY, FOREGROUND } from "@/lib/diagram-tokens";

type BlockKind = "box" | "text" | "media";

type Block = {
  el: HTMLElement | SVGElement;
  kind: BlockKind;
  parent: Block | null;
  state: "waiting" | "claimed" | "done";
};

type Tool = "arrow" | "crosshair" | "ibeam";

type Phase = "orbit" | "idle" | "travel" | "draw" | "type" | "fade" | "flock";

type Agent = {
  root: HTMLDivElement;
  tools: Record<Tool, SVGSVGElement>;
  selection: HTMLDivElement;
  badge: HTMLSpanElement;
  phase: Phase;
  phaseStart: number;
  phaseMs: number;
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  vx: number;
  vy: number;
  angle: number;
  wanderX: number;
  wanderY: number;
  block: Block | null;
  rect: DOMRect | null;
  lines: number;
};

const AGENT_ROLES = [
  "planner", "retriever", "reranker", "embedder", "router", "vision",
  "evaluator", "guardrail", "summarizer", "tool-caller", "memory", "critic",
  "tracer", "indexer", "tokenizer", "scheduler", "segmenter", "detector",
];
const AGENT_COLORS = [PRISM_ACCENT, ACCENT_SECONDARY, MEDICAL_ACCENT, FACULTY_ACCENT, AIRSPACE_ACCENT, FOREGROUND];

const START_AGENTS = 8;
const MAX_AGENTS = AGENT_ROLES.length;
const VIEW_MARGIN = 200;
const MAX_SPEED = 5;
const BLANK_MS = 220;
const ORBIT_MS = 1300;
const FLOCK_MS = 3200;
const AUTO_SETTLE_MS = 1200;
const AUTO_MIN_SPEED = 1.5;
const MEDIA_TAGS = new Set(["img", "svg", "canvas", "video"]);
const CONTROL_TAGS = new Set(["input", "textarea", "select"]);

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function isPainted(style: CSSStyleDeclaration): boolean {
  const opaque = (color: string) => color !== "transparent" && !/rgba?\(.*[,/]\s*0\)$/.test(color);
  const sides = ["Top", "Right", "Bottom", "Left"] as const;
  return (
    opaque(style.backgroundColor) ||
    style.backgroundImage !== "none" ||
    style.boxShadow !== "none" ||
    sides.some(
      (s) =>
        parseFloat(style[`border${s}Width`]) > 0 &&
        style[`border${s}Style`] !== "none" &&
        opaque(style[`border${s}Color`]),
    )
  );
}

function collectBlocks(roots: Element[]): Block[] {
  const blocks: Block[] = [];

  const visit = (el: Element, parent: Block | null) => {
    const node = el as HTMLElement | SVGElement;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || style.position === "fixed") return;
    const rect = node.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();

    if (rect.width * rect.height >= 4) {
      const add = (kind: BlockKind) => {
        const block: Block = { el: node, kind, parent, state: "waiting" };
        blocks.push(block);
        return block;
      };
      if (node.hasAttribute("data-swarm-atomic")) return void add("box");
      if (MEDIA_TAGS.has(tag)) return void add("media");
      if (CONTROL_TAGS.has(tag)) return void add("box");
      const smallControl = (tag === "a" || tag === "button") && rect.height < 64;
      const hasText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
      if (smallControl || hasText) return void add("text");
      if (isPainted(style)) {
        const box = add("box");
        for (const child of el.children) visit(child, box);
        return;
      }
    }
    for (const child of el.children) visit(child, parent);
  };

  for (const root of roots) visit(root, null);
  return blocks;
}

function toolIcon(path: string, color: string, viewBox: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.style.cssText = "position:absolute;left:0;top:0;display:none;overflow:visible";
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", path);
  shape.setAttribute("fill", color);
  shape.setAttribute("stroke", "#F6F5F0");
  shape.setAttribute("stroke-width", "1");
  svg.appendChild(shape);
  return svg;
}

export function startSwarm(onEnd: () => void, { auto = false }: { auto?: boolean } = {}): () => void {
  const roots = [...document.querySelectorAll("main, footer")];
  const blocks = collectBlocks(roots);
  const startedAt = performance.now();

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = "position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:55";

  const sheet = document.createElement("div");
  sheet.style.cssText = `position:absolute;inset:0;background:var(--background);opacity:0;transition:opacity ${BLANK_MS}ms`;
  overlay.appendChild(sheet);

  const bar = document.createElement("div");
  bar.setAttribute("role", "status");
  bar.style.cssText =
    "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:55;display:flex;align-items:center;gap:14px;padding:9px 12px 9px 16px;border-radius:999px;background:#171715;color:#F6F5F0;font:11px var(--font-geist-mono),monospace;white-space:nowrap;box-shadow:0 10px 30px -12px rgba(0,0,0,.6)";
  const status = document.createElement("span");
  const note = document.createElement("span");
  note.textContent = "Scripted animation";
  note.style.color = "#A9A69C";
  const skip = document.createElement("button");
  skip.type = "button";
  skip.textContent = "Skip (Esc)";
  skip.style.cssText =
    "padding:5px 11px;border-radius:999px;background:#F6F5F0;color:#171715;font:inherit;font-weight:600;cursor:pointer";
  bar.append(status, note, skip);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let finished = false;
  let frame = 0;
  let lastFrame = startedAt;
  let doneCount = 0;
  let flockStart = 0;
  let idleSince = 0;
  const agents: Agent[] = [];

  const spawnAgent = (x: number, y: number, phase: Phase) => {
    const index = agents.length;
    const color = AGENT_COLORS[index % AGENT_COLORS.length];

    const root = document.createElement("div");
    root.style.cssText = "position:absolute;left:0;top:0;will-change:transform;z-index:2";
    const tools = {
      arrow: toolIcon("M1 1 L1 13 L4.5 9.8 L7 15 L9.4 13.9 L6.9 8.8 L11.6 8.6 Z", color, "0 0 16 16"),
      crosshair: toolIcon("M7 -2 H9 V7 H16 V9 H9 V16 H7 V9 H0 V7 H7 Z", color, "0 -2 16 18"),
      ibeam: toolIcon("M4 0 H12 V2 H9 V14 H12 V16 H4 V14 H7 V2 H4 Z", color, "0 0 16 16"),
    };
    Object.values(tools).forEach((tool) => root.appendChild(tool));
    tools.arrow.style.display = "block";

    const tag = document.createElement("span");
    tag.textContent = AGENT_ROLES[index];
    tag.style.cssText = `position:absolute;left:13px;top:15px;padding:1px 5px;border-radius:3px;background:${color};color:#F6F5F0;font:9.5px var(--font-geist-mono),monospace;white-space:nowrap`;
    root.appendChild(tag);

    const selection = document.createElement("div");
    selection.style.cssText = `position:absolute;left:0;top:0;display:none;border:1px solid ${color};will-change:transform,width,height;z-index:1`;
    for (const [v, h] of [["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]]) {
      const handle = document.createElement("i");
      handle.style.cssText = `position:absolute;${v}:-3px;${h}:-3px;width:5px;height:5px;background:#F6F5F0;border:1px solid ${color}`;
      selection.appendChild(handle);
    }
    const badge = document.createElement("span");
    badge.style.cssText = `position:absolute;left:50%;bottom:-19px;transform:translateX(-50%);padding:1px 5px;border-radius:3px;background:${color};color:#F6F5F0;font:9.5px var(--font-geist-mono),monospace;white-space:nowrap`;
    selection.appendChild(badge);

    overlay.append(selection, root);
    agents.push({
      root, tools, selection, badge, phase,
      phaseStart: performance.now(), phaseMs: 0,
      x, y, fromX: x, fromY: y, vx: 0, vy: 0,
      angle: (index / START_AGENTS) * Math.PI * 2,
      wanderX: Math.random(), wanderY: Math.random(),
      block: null, rect: null, lines: 1,
    });
  };

  const useTool = (agent: Agent, tool: Tool) => {
    (Object.keys(agent.tools) as Tool[]).forEach((key) => {
      agent.tools[key].style.display = key === tool ? "block" : "none";
    });
  };

  const setPhase = (agent: Agent, phase: Phase, ms: number, now: number) => {
    agent.phase = phase;
    agent.phaseStart = now;
    agent.phaseMs = ms;
    agent.fromX = agent.x;
    agent.fromY = agent.y;
  };

  const measure = (block: Block): DOMRect => {
    const r = block.el.getBoundingClientRect();
    return new DOMRect(r.left + window.scrollX, r.top + window.scrollY, r.width, r.height);
  };

  const reveal = (block: Block) => {
    block.el.removeAttribute("data-swarm");
    block.el.style.removeProperty("clip-path");
    if (block.state !== "done") {
      block.state = "done";
      doneCount++;
    }
  };

  const textMask = (progress: number, lines: number) => {
    const exact = progress * lines;
    const line = Math.min(lines - 1, Math.floor(exact));
    const across = (exact - line) * 100;
    const top = (line / lines) * 100;
    const bottom = ((line + 1) / lines) * 100;
    return `polygon(0 0, 100% 0, 100% ${top}%, ${across}% ${top}%, ${across}% ${bottom}%, 0 ${bottom}%)`;
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    blocks.forEach(reveal);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("pointermove", onPointer);
    overlay.remove();
    bar.remove();
    onEnd();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") finish();
  };
  const onPointer = (e: PointerEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  const tick = (now: number) => {
    if (finished) return;
    const dt = Math.min(50, now - lastFrame);
    lastFrame = now;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    const available = blocks.filter((b) => {
      if (b.state !== "waiting" || (b.parent && b.parent.state !== "done")) return false;
      const r = b.el.getBoundingClientRect();
      return r.bottom > -VIEW_MARGIN && r.top < viewH + VIEW_MARGIN;
    });

    const minSpeed = auto ? AUTO_MIN_SPEED : 1;
    const speed = Math.min(MAX_SPEED, Math.max(minSpeed, available.length / (agents.length * 1.5)));
    if (available.length > agents.length * 3 && agents.length < MAX_AGENTS && !flockStart) {
      spawnAgent(scrollX + Math.random() * viewW, scrollY + (Math.random() < 0.5 ? -20 : viewH + 20), "idle");
    }

    // Autoplay can't wait on a visitor who never scrolls: once the screen they
    // are on is built, the rest of the page is revealed and the swarm wraps up.
    const nothingToDo = available.length === 0 && agents.every((a) => !a.block);
    if (auto && !flockStart && nothingToDo && now - startedAt > BLANK_MS + ORBIT_MS) {
      idleSince ||= now;
      if (now - idleSince > AUTO_SETTLE_MS) blocks.forEach(reveal);
    } else {
      idleSince = 0;
    }

    if (doneCount === blocks.length && !flockStart && now - startedAt > BLANK_MS + ORBIT_MS) {
      flockStart = now;
      status.textContent = "Rebuilt. This was your real page the whole time.";
      note.style.display = "none";
      skip.textContent = "Done (Esc)";
      for (const agent of agents) {
        agent.selection.style.display = "none";
        useTool(agent, "arrow");
        setPhase(agent, "flock", FLOCK_MS, now);
      }
    } else if (!flockStart) {
      status.textContent = `${agents.length} agents · ${doneCount} / ${blocks.length} built${nothingToDo && !auto ? " · scroll to keep building" : ""}`;
    }

    if (flockStart && now - flockStart > FLOCK_MS) {
      finish();
      return;
    }

    for (const agent of agents) {
      const t = agent.phaseMs > 0 ? clamp01((now - agent.phaseStart) / agent.phaseMs) : 1;

      if (agent.phase === "orbit") {
        const cx = scrollX + viewW / 2;
        const cy = scrollY + viewH / 2;
        agent.angle += dt * 0.0022;
        const grow = ease(clamp01((now - startedAt - BLANK_MS) / 500));
        agent.x = cx + Math.cos(agent.angle) * 150 * grow;
        agent.y = cy + Math.sin(agent.angle) * 110 * grow;
        if (now - startedAt > BLANK_MS + ORBIT_MS) setPhase(agent, "idle", 0, now);
      } else if (agent.phase === "flock") {
        const tx = scrollX + mouseX;
        const ty = scrollY + mouseY;
        agent.angle += dt * 0.003;
        const ax = tx + Math.cos(agent.angle) * 70 - agent.x;
        const ay = ty + Math.sin(agent.angle) * 55 - agent.y;
        agent.vx = (agent.vx + ax * 0.0009 * dt) * 0.93;
        agent.vy = (agent.vy + ay * 0.0009 * dt) * 0.93;
        agent.x += agent.vx * dt;
        agent.y += agent.vy * dt;
      } else if (agent.phase === "idle") {
        const pick = available.filter((b) => b.state === "waiting").slice(0, 6);
        let best: Block | null = null;
        let bestDistance = Infinity;
        for (const b of pick) {
          const r = measure(b);
          const d = Math.hypot(r.left - agent.x, r.top - agent.y);
          if (d < bestDistance) {
            bestDistance = d;
            best = b;
          }
        }
        if (best) {
          best.state = "claimed";
          agent.block = best;
          agent.rect = measure(best);
          setPhase(agent, "travel", (200 + Math.min(420, bestDistance * 0.5)) / speed, now);
        } else {
          const tx = scrollX + 80 + agent.wanderX * (viewW - 160);
          const ty = scrollY + 90 + agent.wanderY * (viewH - 200);
          agent.x += (tx - agent.x) * 0.003 * dt;
          agent.y += (ty - agent.y) * 0.003 * dt;
        }
      } else if (agent.block && agent.rect) {
        const block = agent.block;
        const rect = agent.rect;

        if (agent.phase === "travel") {
          const e = ease(t);
          agent.x = lerp(agent.fromX, rect.left, e);
          agent.y = lerp(agent.fromY, rect.top, e) - Math.sin(Math.PI * t) * 24;
          if (t >= 1) {
            agent.rect = measure(block);
            useTool(agent, "crosshair");
            agent.selection.style.display = "block";
            const area = Math.sqrt(rect.width * rect.height);
            setPhase(agent, "draw", (block.kind === "text" ? 170 : 240 + Math.min(380, area)) / speed, now);
          }
        } else if (agent.phase === "draw") {
          const e = ease(t);
          const w = Math.max(1, rect.width * e);
          const h = Math.max(1, rect.height * e);
          agent.x = rect.left + w;
          agent.y = rect.top + h;
          agent.selection.style.width = `${w}px`;
          agent.selection.style.height = `${h}px`;
          agent.badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
          if (t >= 1) {
            if (block.kind === "text") {
              const style = getComputedStyle(block.el);
              const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.3;
              agent.lines = Math.max(1, Math.round(rect.height / lineHeight));
              const chars = block.el.textContent?.length ?? 10;
              block.el.removeAttribute("data-swarm");
              block.el.style.setProperty("clip-path", textMask(0, agent.lines));
              useTool(agent, "ibeam");
              setPhase(agent, "type", Math.min(1500, 160 + chars * 12) / speed, now);
            } else {
              block.el.removeAttribute("data-swarm");
              block.el.animate({ opacity: [0, 1] }, { duration: 260 / speed, easing: "ease-out" });
              useTool(agent, "arrow");
              setPhase(agent, "fade", 260 / speed, now);
            }
          }
        } else if (agent.phase === "type") {
          block.el.style.setProperty("clip-path", textMask(t, agent.lines));
          const exact = t * agent.lines;
          const line = Math.min(agent.lines - 1, Math.floor(exact));
          agent.x = rect.left + (exact - line) * rect.width;
          agent.y = rect.top + ((line + 0.2) / agent.lines) * rect.height;
          if (t >= 1) {
            reveal(block);
            agent.selection.style.display = "none";
            agent.block = null;
            useTool(agent, "arrow");
            setPhase(agent, "idle", 0, now);
          }
        } else if (agent.phase === "fade" && t >= 1) {
          reveal(block);
          agent.selection.style.display = "none";
          agent.block = null;
          setPhase(agent, "idle", 0, now);
        }

        if (agent.selection.style.display === "block") {
          agent.selection.style.transform = `translate(${rect.left - scrollX}px, ${rect.top - scrollY}px)`;
        }
      }

      agent.root.style.transform = `translate(${agent.x - scrollX}px, ${agent.y - scrollY}px)`;
    }

    frame = requestAnimationFrame(tick);
  };

  document.body.append(overlay, bar);
  window.addEventListener("keydown", onKey);
  window.addEventListener("pointermove", onPointer, { passive: true });
  skip.addEventListener("click", finish);
  if (!auto) skip.focus({ preventScroll: true });
  status.textContent = "Blanking the page…";

  requestAnimationFrame(() => {
    sheet.style.opacity = "1";
  });
  setTimeout(() => {
    if (finished) return;
    blocks.forEach((b) => b.el.setAttribute("data-swarm", "hidden"));
    sheet.remove();
  }, BLANK_MS);

  for (let i = 0; i < START_AGENTS; i++) {
    spawnAgent(window.scrollX + window.innerWidth / 2, window.scrollY + window.innerHeight / 2, "orbit");
  }
  frame = requestAnimationFrame(tick);

  return finish;
}
