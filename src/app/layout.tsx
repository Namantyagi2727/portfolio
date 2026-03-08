import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Naman Tyagi | AI/ML Engineer",
  description:
    "Portfolio of Naman Tyagi — AI/ML Engineer, Full-Stack Developer & Cloud Architect. MS CS at NYU Tandon. IEEE published researcher.",
  keywords: [
    "Naman Tyagi",
    "AI Engineer",
    "ML Engineer",
    "Full Stack Developer",
    "Cloud Architect",
    "NYU",
    "Portfolio",
  ],
  authors: [{ name: "Naman Tyagi" }],
  openGraph: {
    title: "Naman Tyagi | AI/ML Engineer",
    description:
      "Portfolio of Naman Tyagi — AI/ML Engineer, Full-Stack Developer & Cloud Architect.",
    type: "website",
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
      </body>
    </html>
  );
}
