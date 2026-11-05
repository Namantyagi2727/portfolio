type SectionLabelProps = {
  label: string;
  meta?: string;
  as?: "div" | "h2";
  /** Section index (e.g. "01") — rendered only alongside the "h2" heading treatment. */
  index?: string;
};

export default function SectionLabel({ label, meta, as = "div", index }: SectionLabelProps) {
  if (as === "h2") {
    // Top-level section heading (Work / Experience / Research / About) —
    // needs to be distinguishable while scrolling past it, unlike the
    // compact case-study sub-header treatment below.
    return (
      <h2 className="mb-6">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-accent-secondary mb-2">
          {index && <span>{index}</span>}
          {meta && <span className="text-muted">{meta}</span>}
        </span>
        <span
          className="block font-semibold tracking-tight text-foreground"
          style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
        >
          {label}
        </span>
      </h2>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest mb-4">
      <span className="text-accent">{label}</span>
      {meta && <span className="text-muted">{meta}</span>}
    </div>
  );
}
