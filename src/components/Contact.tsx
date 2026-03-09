import { Mail, Github, Linkedin, MapPin, Send } from "lucide-react";
import { personalInfo } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">08 / Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Get In Touch</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left */}
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

          {/* Right: CTA card */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-[#00d4ff]/30 transition-colors">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "rgba(0,212,255,0.1)", boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}
            >
              <Send size={28} style={{ color: "#00d4ff" }} />
            </div>
            <h3 className="text-lg font-semibold text-[#ededed] mb-2">Say Hello</h3>
            <p className="text-sm text-[#6b7280] mb-6 leading-relaxed">
              Whether it's a job opportunity, collaboration, or just a conversation about AI — I'd love to hear from you.
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-[#0a0a0a] transition-all duration-200 hover:scale-105"
              style={{ background: "#00d4ff", boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}
            >
              <Mail size={15} />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
