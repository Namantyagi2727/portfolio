import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://namantyagi.dev"),
  title: "Naman Tyagi | AI/ML Engineer",
  description:
    "AI/ML engineer and MS CS student at NYU Tandon. IEEE published researcher. 6+ internships across AI, cloud, and enterprise software.",
  keywords: [
    "Naman Tyagi",
    "AI Engineer",
    "ML Engineer",
    "Full Stack Developer",
    "Cloud Architect",
    "NYU",
    "RAG",
    "LLM",
    "Portfolio",
  ],
  authors: [{ name: "Naman Tyagi" }],
  openGraph: {
    title: "Naman Tyagi | AI/ML Engineer",
    description:
      "AI/ML engineer and MS CS student at NYU Tandon. IEEE published researcher. 6+ internships across AI, cloud, and enterprise software.",
    type: "website",
    url: "https://namantyagi.dev",
    siteName: "Naman Tyagi Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Naman Tyagi — AI/ML Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Tyagi | AI/ML Engineer",
    description:
      "AI/ML engineer and MS CS student at NYU Tandon. IEEE published researcher. 6+ internships across AI, cloud, and enterprise software.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-[#ededed]`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
