import Image from "next/image";
import type { Figure as FigureData } from "@/lib/data";

type FigureProps = {
  figure: FigureData;
  children?: React.ReactNode;
};

export default function Figure({ figure, children }: FigureProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="border border-border bg-surface rounded-sm overflow-hidden">
        {figure.kind === "screenshot" && figure.src ? (
          <Image
            src={figure.src}
            alt={figure.caption}
            width={2906}
            height={1652}
            className="w-full h-auto"
          />
        ) : figure.kind === "placeholder" ? (
          <div className="aspect-video flex items-center justify-center border border-dashed border-border-strong text-muted text-sm font-mono p-6 text-center">
            {figure.caption} — asset pending
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="flex items-baseline gap-2 text-xs font-mono">
        <span className="text-accent-secondary uppercase tracking-widest">{figure.id}</span>
        <span className="text-muted">{figure.caption}</span>
      </figcaption>
    </figure>
  );
}
