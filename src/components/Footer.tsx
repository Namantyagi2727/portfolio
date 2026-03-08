import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#6b7280] font-mono">
          <span style={{ color: "#00d4ff" }}>&lt;</span>
          {personalInfo.name}
          <span style={{ color: "#00d4ff" }}>/&gt;</span>
        </p>
        <p className="text-xs text-[#6b7280]">
          Built with Next.js &amp; Tailwind CSS · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
