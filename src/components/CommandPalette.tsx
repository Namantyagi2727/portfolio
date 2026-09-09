"use client";

import { useEffect, useState, lazy, Suspense } from "react";

const CommandPaletteContent = lazy(() => import("./CommandPaletteContent"));

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <Suspense fallback={null}>
      <CommandPaletteContent onClose={() => setOpen(false)} />
    </Suspense>
  );
}
