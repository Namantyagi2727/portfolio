import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted font-mono">
          <span className="text-accent-secondary">&lt;</span>
          {personalInfo.name}
          <span className="text-accent-secondary">/&gt;</span>
        </p>
        <p className="text-xs text-muted">
          Built with Next.js &amp; Tailwind CSS · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
