import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AirspaceDetail from "@/components/AirspaceDetail";

export const metadata: Metadata = {
  title: "Airspace Congestion Monitoring — Naman Tyagi",
  description:
    "A streaming pipeline ingesting flight telemetry from the OpenSky API into Kafka and Spark Structured Streaming for in-stream risk scoring, anomaly detection, and spatial aggregation.",
};

export default function AirspacePage() {
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
          <AirspaceDetail />
        </div>
      </main>
      <Footer />
    </>
  );
}
