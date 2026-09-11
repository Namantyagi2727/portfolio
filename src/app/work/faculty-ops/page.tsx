import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacultyOpsDetail from "@/components/FacultyOpsDetail";

export const metadata: Metadata = {
  title: "Faculty Operations Platform — Naman Tyagi",
  description:
    "A cloud-integrated Django platform replacing manual faculty-affairs paperwork with structured workflows, approval-chain tracking, and automated records management for 500+ NYU faculty.",
};

export default function FacultyOpsPage() {
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
          <FacultyOpsDetail />
        </div>
      </main>
      <Footer />
    </>
  );
}
