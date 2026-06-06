"use client";

import { ShieldCheck, Lock, Zap, Gift, CloudOff, UserMinus } from "lucide-react";
import { m } from "framer-motion";

const INDICATORS = [
  { icon: CloudOff, title: "No Uploads", desc: "Data never leaves your browser" },
  { icon: UserMinus, title: "No Accounts", desc: "Start using tools instantly" },
  { icon: Lock, title: "100% Private", desc: "Local-only execution" },
  { icon: Zap, title: "Blazing Fast", desc: "Zero latency processing" },
];

export function TrustIndicators() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {INDICATORS.map((item, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="group p-4 md:p-5 bg-mat-surface border border-mat-border rounded-2xl flex flex-col gap-3 hover:border-blue/30 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-all">
            <item.icon className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-text tracking-tight">{item.title}</h3>
            <p className="text-[11px] text-text-4 font-semibold leading-tight">{item.desc}</p>
          </div>
        </m.div>
      ))}
    </div>
  );
}
