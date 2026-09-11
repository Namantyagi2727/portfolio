"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flag, Gamepad2, Swords } from "lucide-react";
import { awayFromKeyboard } from "@/lib/data";

// A modest personal area, not an arcade — three chosen elements (per the
// design brief), a small hover interaction, and the existing verified
// awayFromKeyboard line. No invented achievements, race attendance, travel
// counts, or favorites.
const QUESTS = [
  { icon: Flag, label: "F1 race weekends" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Swords, label: "Chess" },
];

export default function SideQuests() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="py-12 border-t border-border">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Side Quests</p>

      <div className="flex flex-wrap gap-4 mb-6">
        {QUESTS.map(({ icon: Icon, label }) => (
          <motion.div
            key={label}
            whileHover={shouldReduceMotion ? undefined : { y: -3, rotate: -1 }}
            className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2"
          >
            <Icon size={16} className="text-accent" />
            <span className="text-sm text-foreground">{label}</span>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed max-w-2xl mb-2">{awayFromKeyboard}</p>
      <p className="text-muted text-lg" style={{ fontFamily: "var(--font-hand)" }}>
        — usually with a second monitor open somewhere nearby
      </p>
    </div>
  );
}
