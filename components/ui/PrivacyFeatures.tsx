"use client";

import { Shield, EyeOff, ServerOff, HardDrive, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import Link from "next/link";

const FEATURES = [
  {
    icon: HardDrive,
    title: "Client-Side Computing",
    desc: "Your files never leave your machine. All processing happens locally in your browser's sandboxed environment.",
    color: "blue"
  },
  {
    icon: EyeOff,
    title: "Zero Tracking",
    desc: "We don't use invasive analytics or store your tool inputs. Your workflow is yours and yours alone.",
    color: "indigo"
  },
  {
    icon: ServerOff,
    title: "Serverless Architecture",
    desc: "By removing the middleman (the server), we eliminate data breach risks and provide instant performance.",
    color: "violet"
  }
];

export function PrivacyFeatures() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative flex items-start gap-4 md:flex-col md:items-start p-4 md:p-8 bg-[--kv-mat-surface] border border-[--kv-mat-border] rounded-2xl md:rounded-[32px] overflow-hidden group shadow-premium hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="hidden sm:block absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
              <f.icon className="w-24 h-24" />
            </div>
            
            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-text transition-all duration-500">
              <f.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-black text-[--kv-text] tracking-tight">{f.title}</h3>
              <p className="text-[13px] md:text-sm text-[--kv-text-muted] font-medium mt-1 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </m.div>
        ))}
      </div>
      
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-blue to-blue-dark rounded-3xl p-6 md:p-12 text-text flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 shadow-xl shadow-blue/20"
      >
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-[22px] md:text-4xl font-black tracking-tight leading-tight text-white">
            Security is not a feature, it's our foundation.
          </h2>
          <p className="text-white/85 text-[14px] md:text-[16px] font-medium leading-relaxed max-w-xl">
            KaruviLab solves privacy concerns with local-first processing. No sign-ups, no cookies, no compromise.
          </p>
        </div>
        <Link 
          href="/privacy" 
          className="w-full md:w-auto h-[52px] px-8 bg-white text-[#1E293B] rounded-xl font-bold text-[15px] hover:bg-white/90 transition-opacity flex items-center justify-center whitespace-nowrap shadow-lg"
        >
          View Privacy Policy
        </Link>
      </m.div>
    </div>
  );
}
