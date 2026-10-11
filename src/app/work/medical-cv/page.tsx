import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalVisionDetail from "@/components/MedicalVisionDetail";

export const metadata: Metadata = {
  title: "Real-Time Kidney-Stone Detection — Naman Tyagi",
  description:
    "Ongoing academic computer vision research at NYU Tandon's FAMS Lab: a real-time pipeline for detecting and localizing kidney stones in microscopic-camera video.",
};

export default function MedicalCvPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/#experience"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors mb-12"
          >
            <ArrowLeft size={14} />
            Experience
          </Link>
          <MedicalVisionDetail />
        </div>
      </main>
      <Footer />
    </>
  );
}
