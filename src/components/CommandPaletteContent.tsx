"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import { personalInfo } from "@/lib/data";

const SECTIONS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Side Quests", href: "#sidequests" },
  { label: "Contact", href: "#contact" },
];

const itemClass =
  "px-3 py-2 rounded-md text-sm normal-case tracking-normal text-[#c7bcae] data-[selected=true]:bg-[#d97b3f]/10 data-[selected=true]:text-[#d97b3f] cursor-pointer outline-none";

export default function CommandPaletteContent({ onClose }: { onClose: () => void }) {
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
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
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
      className="fixed inset-0 z-[60] flex items-start justify-center pt-32 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-[#2a231c] bg-[#1c1712] overflow-hidden font-mono text-sm"
      >
        <Command.Input
          autoFocus
          placeholder="Jump to..."
          className="w-full px-4 py-3 bg-transparent text-[#f5f0e8] outline-none border-b border-[#2a231c] placeholder:text-[#8a8073]"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-2 text-[#8a8073]">No results.</Command.Empty>
          <Command.Group heading="Sections" className="text-[10px] uppercase tracking-widest text-[#8a8073] px-2 py-1">
            {SECTIONS.map((s) => (
              <Command.Item key={s.href} onSelect={() => go(s.href)} className={itemClass}>
                {s.label}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Actions" className="text-[10px] uppercase tracking-widest text-[#8a8073] px-2 py-1 mt-2">
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
