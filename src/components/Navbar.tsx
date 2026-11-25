"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { personalInfo } from "@/lib/data";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [redEye, setRedEye] = useState(true);

  useEffect(() => {
    setRedEye(document.documentElement.dataset.theme === "redeye");
  }, []);

  const toggleRedEye = () => {
    const next = !redEye;
    setRedEye(next);
    if (next) document.documentElement.dataset.theme = "redeye";
    else delete document.documentElement.dataset.theme;
    localStorage.setItem("theme", next ? "redeye" : "paper");
    window.dispatchEvent(new Event("themechange"));
  };

  const themeButton = (
    <button
      type="button"
      onClick={toggleRedEye}
      aria-pressed={!redEye}
      aria-label="Daylight mode"
      title={redEye ? "Daylight mode" : "Red-eye mode"}
      className="text-muted hover:text-accent transition-colors p-1"
    >
      {redEye ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/#hero"
          className="text-sm font-medium tracking-tight text-foreground hover:text-accent transition-colors"
        >
          {personalInfo.name}
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={`/${link.href}`}
                className="text-sm text-muted hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-5">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            GitHub ↗
          </a>
          {themeButton}
          <kbd className="text-[10px] font-mono text-muted border border-border rounded px-1.5 py-1">⌘K</kbd>
        </div>

        <div className="md:hidden flex items-center gap-2">
          {themeButton}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      )}
    </header>
  );
}
