import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrismDetail from "@/components/PrismDetail";

export const metadata: Metadata = {
  title: "Prism — Naman Tyagi",
  description:
    "Prism is a self-hosted LLM gateway and control plane — cost visibility, automatic failover, PII/prompt-injection guardrails, exact-match caching, and full observability.",
};

export default function PrismPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors mb-12"
          >
            <ArrowLeft size={14} />
            Selected Work
          </Link>
          <PrismDetail />
        </div>
      </main>
      <Footer />
    </>
  );
}
