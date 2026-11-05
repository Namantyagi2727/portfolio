"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type ExpandableDiagramProps = {
  /** Simplified vertical overview — shown below lg:, no horizontal scroll needed. */
  summary: React.ReactNode;
  /** The full existing diagram — shown directly at lg: and up (where the
   *  widest of these three diagrams, ~880px, fits inside the ~976px case
   *  study column); on narrower screens it's one explicit click away. */
  full: React.ReactNode;
};

// Both branches render via CSS (lg:hidden / hidden lg:block), not a JS
// viewport check — avoids any SSR/hydration mismatch or a content swap
// flashing in after hydration on desktop.
export default function ExpandableDiagram({ summary, full }: ExpandableDiagramProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="lg:hidden">
        {summary}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors"
        >
          <ChevronDown size={14} className={expanded ? "rotate-180 transition-transform" : "transition-transform"} />
          {expanded ? "Hide full diagram" : "Show full diagram"}
        </button>
        {expanded && <div className="mt-6">{full}</div>}
      </div>
      <div className="hidden lg:block">{full}</div>
    </div>
  );
}
