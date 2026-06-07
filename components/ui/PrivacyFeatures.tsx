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
            className="relative p-6 bg-mat-surface border border-mat-border rounded-2xl overflow-hidden group shadow-premium hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="hidden sm:block absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
              <f.icon className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-text transition-all duration-500">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-text tracking-tight">{f.title}</h3>
              <p className="text-[13px] text-text-4 font-semibold leading-snug">
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
        className="bg-gradient-to-br from-blue to-blue-dark rounded-3xl p-6 md:p-8 text-text flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue/20"
      >
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white">
            Security is not a feature, it's our foundation.
          </h2>
          <p className="text-blue-light/85 text-sm md:text-base font-medium max-w-xl">
            KaruviLab solves privacy concerns with local-first processing. No sign-ups, no cookies, no compromise.
          </p>
        </div>
        <Link 
          href="/privacy" 
          className="px-6 py-3 bg-mat-surface text-text border border-mat-border rounded-xl text-xs font-black hover:scale-105 transition-transform shadow-lg whitespace-nowrap"
        >
          View Privacy Policy
        </Link>
      </m.div>
    </div>
  );
}
