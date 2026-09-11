"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type ExpandableDiagramProps = {
  /** Simplified vertical overview — always visible, no horizontal scroll needed. */
  summary: React.ReactNode;
  /** The full existing diagram — revealed on demand, may still need horizontal scroll. */
  full: React.ReactNode;
};

// A simplified, always-legible vertical overview by default; the full
// (denser, possibly horizontally-scrollable) diagram is one explicit click
// away, not the only way to understand the system. Both render the same
// underlying facts — the summary just presents fewer of them at once.
export default function ExpandableDiagram({ summary, full }: ExpandableDiagramProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
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
  );
}
