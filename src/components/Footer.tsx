import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a231c] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#8a8073] font-mono">
          <span style={{ color: "#d97b3f" }}>&lt;</span>
          {personalInfo.name}
          <span style={{ color: "#d97b3f" }}>/&gt;</span>
        </p>
        <p className="text-xs text-[#8a8073]">
          Built with Next.js &amp; Tailwind CSS · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
