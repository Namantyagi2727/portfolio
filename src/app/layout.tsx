import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import CommandPalette from "@/components/CommandPalette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Reserved for occasional informal annotations only — never a heading, nav
// item, button, or body paragraph. See design spec's Typography section.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

// The apex domain 307-redirects to www, so www is the canonical origin for
// absolute OG/Twitter URLs.
const SITE_URL = "https://www.namantyagi.dev";
const SITE_TITLE = "Naman Tyagi — Software Engineer | Applied AI & ML";
const SITE_DESCRIPTION =
  "Software engineer and NYU Tandon MS Computer Science graduate working across applied AI, LLM systems, computer vision, and cloud. Projects include Prism, a multi-provider LLM gateway; RAGBase, offline document Q&A; and ConTicx, a ticketing and payments app.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Naman Tyagi",
    "Software Engineer",
    "Applied AI",
    "Machine Learning",
    "LLM Systems",
    "Computer Vision",
    "Cloud",
    "Full-Stack",
    "RAG",
    "NYU Tandon",
    "Portfolio",
  ],
  authors: [{ name: "Naman Tyagi", url: SITE_URL }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Naman Tyagi",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased bg-background text-foreground`}
      >
        <MotionConfig reducedMotion="user">
          {children}
          <CommandPalette />
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
