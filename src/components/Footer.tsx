import { personalInfo, hero } from "@/lib/data";
import { formatCoord } from "@/lib/geo";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-4">
          Let&apos;s talk
        </p>
        <p className="text-2xl sm:text-3xl font-medium tracking-tight uppercase text-foreground max-w-xl mb-8">
          Let&apos;s build something useful.
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-16">
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Email ↗
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            GitHub ↗
          </a>
        </div>

        <p className="font-mono text-xs text-muted mb-16">
          {hero.globeCities[0].label} —{" "}
          {formatCoord(hero.globeCities[0].lat, hero.globeCities[0].lng)}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted font-mono">
            <span className="text-accent-secondary">&lt;</span>
            {personalInfo.name}
            <span className="text-accent-secondary">/&gt;</span>
          </p>
          <p className="text-xs text-muted">
            Built with Next.js &amp; Tailwind CSS · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
