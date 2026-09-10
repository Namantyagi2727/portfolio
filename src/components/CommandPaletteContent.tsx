"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { personalInfo } from "@/lib/data";

const SECTIONS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const itemClass =
  "px-3 py-2 rounded-md text-sm normal-case tracking-normal text-muted data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent cursor-pointer outline-none";

export default function CommandPaletteContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const go = (href: string) => {
    onClose();
    // router.push handles the hash-scroll whether we're already on "/" (same-page
    // scroll, same as clicking an in-page anchor) or on a nested route like
    // /work/prism (navigates to "/" first, then scrolls) — same mechanism the
    // existing "Selected Work" back-link on /work/prism already relies on.
    router.push(`/${href}`);
  };

  const openLink = (url: string) => {
    onClose();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
    } catch {
      // Clipboard API unavailable (insecure origin or denied permission) — nothing to recover from client-side.
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[60] flex items-start justify-center pt-32 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border bg-surface overflow-hidden font-mono text-sm shadow-lg"
      >
        <Command.Input
          autoFocus
          placeholder="Jump to..."
          className="w-full px-4 py-3 bg-transparent text-foreground outline-none border-b border-border placeholder:text-muted"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-2 text-muted">No results.</Command.Empty>
          <Command.Group heading="Sections" className="text-[10px] uppercase tracking-widest text-muted px-2 py-1">
            {SECTIONS.map((s) => (
              <Command.Item key={s.href} onSelect={() => go(s.href)} className={itemClass}>
                {s.label}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Actions" className="text-[10px] uppercase tracking-widest text-muted px-2 py-1 mt-2">
            <Command.Item onSelect={() => openLink(personalInfo.github)} className={itemClass}>
              Open GitHub
            </Command.Item>
            <Command.Item onSelect={() => openLink(personalInfo.linkedin)} className={itemClass}>
              Open LinkedIn
            </Command.Item>
            <Command.Item onSelect={copyEmail} className={itemClass}>
              Copy email
            </Command.Item>
            <Command.Item onSelect={() => openLink("/resume.pdf")} className={itemClass}>
              Open résumé
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
