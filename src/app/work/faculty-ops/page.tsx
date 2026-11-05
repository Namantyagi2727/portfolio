import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacultyOpsDetail from "@/components/FacultyOpsDetail";

export const metadata: Metadata = {
  title: "Faculty Operations Platform — Naman Tyagi",
  description:
    "My contributions to a team-built Django REST Framework and PostgreSQL platform supporting 500+ NYU faculty: Celery Beat workflow automation, data ingestion and integration testing, AI document classification, and a RAG policy chatbot.",
};

export default function FacultyOpsPage() {
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
          <FacultyOpsDetail />
        </div>
      </main>
      <Footer />
    </>
  );
}
