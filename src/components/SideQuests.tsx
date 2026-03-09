"use client";

import { sideQuests, funStats } from "@/lib/data";

const statusConfig = {
  ACTIVE: {
    label: "ACTIVE",
    className: "bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30",
  },
  "IN PROGRESS": {
    label: "IN PROGRESS",
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  },
  PASSIVE: {
    label: "PASSIVE",
    className: "bg-gray-500/10 text-gray-400 border border-gray-500/30",
  },
};

export default function SideQuests() {
  return (
    <section id="sidequests" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">07 / Side Quests</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Side Quests</h2>
          <p className="text-[#6b7280] mt-3 text-sm">Because life isn&apos;t just about the main storyline.</p>
        </div>

        {/* Quest cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {sideQuests.map((quest, i) => {
            const status = statusConfig[quest.status];
            return (
              <div
                key={i}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-[#00d4ff]/30"
              >
                {/* Icon + status badge */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{quest.icon}</span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#ededed]">{quest.title}</h3>

                {/* Description */}
                <p className="text-xs text-[#6b7280] leading-relaxed">{quest.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stat block */}
        <div className="border border-[#1e1e1e] rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-[#1e1e1e]">
            {funStats.map((stat, i) => (
              <div key={i} className="p-5">
                <p className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider mb-1.5">{stat.label}</p>
                <p className="text-sm font-mono font-semibold text-[#ededed]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
