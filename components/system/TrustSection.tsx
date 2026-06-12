"use client";

import { ShieldCheck, CloudOff, WifiOff, Wifi, UserMinus, HardDrive, EyeOff } from "lucide-react";
import { m } from "framer-motion";

interface TrustSectionProps {
  className?: string;
  requiresNetwork?: boolean;
}

export function TrustSection({ className = "", requiresNetwork = false }: TrustSectionProps) {
  const features = [
    { 
      icon: CloudOff, 
      title: "Zero Server Uploads", 
      desc: "Your files never leave your browser. We don't have a backend that sees your data.",
      color: "text-blue",
      bg: "bg-blue/5"
    },
    { 
      icon: HardDrive, 
      title: "Local-First Computing", 
      desc: "All processing happens in your device's RAM using sandboxed Web Workers.",
      color: "text-success",
      bg: "bg-success/5"
    },
    { 
      icon: requiresNetwork ? Wifi : WifiOff, 
      title: requiresNetwork ? "Network Required" : "Fully Offline Capable", 
      desc: requiresNetwork 
        ? "This tool requires a network connection for external API data." 
        : "Once loaded, this tool works without any internet connection.",
      color: requiresNetwork ? "text-blue" : "text-warn",
      bg: requiresNetwork ? "bg-blue/5" : "bg-warn/5"
    },
    { 
      icon: EyeOff, 
      title: "No Account Needed", 
      desc: "Start using tools immediately. No sign-ups, no tracking, no cookies.",
      color: "text-text-4",
      bg: "bg-mat-raised"
    },
  ];

  return (
    <section className={`py-12 border-t border-border/60 ${className}`}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Enterprise-Grade Privacy</h2>
          <p className="text-sm text-text-4 font-bold uppercase tracking-widest">Built on local-first principles</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <m.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-mat-surface border border-mat-border shadow-mat-shine rounded-2xl space-y-4 group hover:border-blue/30 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-text">{f.title}</h3>
                <p className="text-xs text-text-3 leading-relaxed">{f.desc}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
