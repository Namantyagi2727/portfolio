"use client";

import { sideQuests, funStats } from "@/lib/data";

const statusLabel: Record<string, string> = {
  ACTIVE: "ongoing",
  "IN PROGRESS": "in progress",
  PASSIVE: "background",
};

export default function SideQuests() {
  return (
    <section id="sidequests" className="py-24 px-6 bg-[#14100d]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">07 / Side Quests</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Side Quests</h2>
          <p className="text-[#8a8073] mt-3 text-sm">Because life isn&apos;t just about the main storyline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {sideQuests.map((quest, i) => (
            <div
              key={i}
              className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-[#d97b3f]/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{quest.icon}</span>
                <span className="text-[10px] font-mono italic text-[#8a8073]">{statusLabel[quest.status]}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#f5f0e8]">{quest.title}</h3>
              <p className="text-xs text-[#8a8073] leading-relaxed">{quest.description}</p>
            </div>
          ))}
        </div>

        <div className="border border-[#2a231c] rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-[#2a231c]">
            {funStats.map((stat, i) => (
              <div key={i} className="p-5">
                <p className="text-[10px] font-mono text-[#8a8073] uppercase tracking-wider mb-1.5">{stat.label}</p>
                <p className="text-sm font-mono font-semibold text-[#f5f0e8]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
