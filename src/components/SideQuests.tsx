import { awayFromKeyboard } from "@/lib/data";
import SideQuestsIllustration from "./SideQuestsIllustration";

// A modest personal area, not an arcade — one compact original
// illustration (per the design brief, replacing the earlier icon-pill
// row) referencing three existing verified interests, plus the existing
// awayFromKeyboard line. No invented achievements, race attendance,
// travel counts, or favorites.
export default function SideQuests() {
  return (
    <div className="py-12 border-t border-border">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Side Quests</p>

      <div className="mb-6">
        <SideQuestsIllustration />
      </div>

      <p className="text-sm text-muted leading-relaxed max-w-2xl mb-2">{awayFromKeyboard}</p>
      <p className="text-muted text-lg" style={{ fontFamily: "var(--font-hand)" }}>
        — usually with a second monitor open somewhere nearby
      </p>
    </div>
  );
}
