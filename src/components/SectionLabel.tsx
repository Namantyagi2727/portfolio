type SectionLabelProps = {
  label: string;
  meta?: string;
  as?: "div" | "h2";
};

export default function SectionLabel({ label, meta, as = "div" }: SectionLabelProps) {
  const Tag = as;
  return (
    <Tag className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest mb-4">
      <span className="text-accent">{label}</span>
      {meta && <span className="text-muted">{meta}</span>}
    </Tag>
  );
}
