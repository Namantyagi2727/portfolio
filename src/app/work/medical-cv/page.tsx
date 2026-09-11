import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalVisionDetail from "@/components/MedicalVisionDetail";

export const metadata: Metadata = {
  title: "Endoscopic Stone Detection — Naman Tyagi",
  description:
    "Ongoing computer vision research at NYU's FAMS Lab: a real-time detection pipeline over a continuous endoscopic camera feed in a simulated renal environment.",
};

export default function MedicalCvPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors mb-12"
          >
            <ArrowLeft size={14} />
            Selected Work
          </Link>
          <MedicalVisionDetail />
        </div>
      </main>
      <Footer />
    </>
  );
}
