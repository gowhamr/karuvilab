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
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((f, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative p-8 bg-surface border border-border rounded-[32px] overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
              <f.icon className="w-32 h-32" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-[--kv-text] transition-all duration-500">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-text tracking-tight">{f.title}</h3>
              <p className="text-sm text-text-4 font-semibold leading-relaxed">
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
        className="bg-gradient-to-br from-blue to-blue-dark rounded-[40px] p-8 md:p-12 text-[--kv-text] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue/20"
      >
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Security is not a feature,<br />it's our foundation.
          </h2>
          <p className="text-blue-light text-lg font-medium max-w-xl">
            KaruviLab was built to solve the privacy concerns of modern developer and office tools. 
            No sign-ups, no cookies, no compromise.
          </p>
        </div>
        <Link 
          href="/privacy" 
          className="px-8 py-4 bg-[--kv-mat-surface] text-[--kv-text] rounded-2xl font-black hover:scale-105 transition-transform shadow-xl whitespace-nowrap"
        >
          View Privacy Policy
        </Link>
      </m.div>
    </div>
  );
}
