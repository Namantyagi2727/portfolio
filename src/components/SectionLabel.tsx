type SectionLabelProps = {
  label: string;
  meta?: string;
};

export default function SectionLabel({ label, meta }: SectionLabelProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest mb-4">
      <span className="text-accent">{label}</span>
      {meta && <span className="text-muted">{meta}</span>}
    </div>
  );
}
