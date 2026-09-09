type ProjectMetricProps = {
  value: string;
  label: string;
};

export default function ProjectMetric({ value, label }: ProjectMetricProps) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-border pt-3">
      <span className="font-mono text-lg sm:text-xl text-foreground tracking-tight">{value}</span>
      <span className="text-xs text-muted leading-snug">{label}</span>
    </div>
  );
}
