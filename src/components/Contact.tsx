"use client";

import { useState } from "react";
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/lib/data";

// ── Web3Forms setup ──────────────────────────────────────────────
// 1. Go to https://web3forms.com
// 2. Enter namantyagi2727@gmail.com → click "Create Access Key"
// 3. Replace the string below with your key
const WEB3FORMS_KEY = "476f9eaf-3a76-455f-bf27-41f1bf7d7d8f";
// ─────────────────────────────────────────────────────────────────

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio contact from ${form.name}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-4 py-3 text-sm text-[#ededed] placeholder-[#6b7280]/50 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all duration-200 font-mono";

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">08 / Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Get In Touch</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Left — info */}
          <div>
            <p className="text-[#6b7280] leading-relaxed mb-8">
              I'm currently open to full-time roles, research collaborations, and interesting projects in AI/ML, cloud, and full-stack engineering. If you have an opportunity or just want to chat, my inbox is always open.
            </p>

            {/* Open to work badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-[#00d4ff]/30 text-sm text-[#ededed] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
              Open to opportunities
            </div>

            {/* Contact links */}
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-3 text-[#6b7280] hover:text-[#00d4ff] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#1e1e1e] flex items-center justify-center group-hover:border-[#00d4ff]/40 transition-colors">
                  <Mail size={15} />
                </div>
                <span className="text-sm">{personalInfo.email}</span>
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#6b7280] hover:text-[#00d4ff] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#1e1e1e] flex items-center justify-center group-hover:border-[#00d4ff]/40 transition-colors">
                  <Github size={15} />
                </div>
                <span className="text-sm">github.com/Namantyagi2727</span>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#6b7280] hover:text-[#00d4ff] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#1e1e1e] flex items-center justify-center group-hover:border-[#00d4ff]/40 transition-colors">
                  <Linkedin size={15} />
                </div>
                <span className="text-sm">linkedin.com/in/naman-tyagi-nt2727</span>
              </a>

              <div className="flex items-center gap-3 text-[#6b7280]">
                <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#1e1e1e] flex items-center justify-center">
                  <MapPin size={15} />
                </div>
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div
            className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-7 hover:border-[#00d4ff]/20 transition-colors"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* Success state */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-8"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(34,197,94,0.1)" }}
                  >
                    <CheckCircle size={32} className="text-[#22c55e]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#ededed] mb-2">Message sent!</h3>
                  <p className="text-sm text-[#6b7280] mb-6">I'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs font-mono text-[#00d4ff] hover:underline"
                  >
                    Send another →
                  </button>
                </motion.div>
              ) : (
                /* Form */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-sm font-semibold text-[#ededed] mb-1">Send a message</h3>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b7280] mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b7280] mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono text-[#6b7280] mb-1.5">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="What's on your mind?"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
                      <AlertCircle size={13} />
                      Something went wrong. Try emailing directly.
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-[#0a0a0a] transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
                    style={{ background: "#00d4ff", boxShadow: "0 0 20px rgba(0,212,255,0.25)" }}
                  >
                    {status === "loading" ? (
                      <Loader size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    {status === "loading" ? "Sending…" : "Send Message"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
