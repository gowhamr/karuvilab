"use client";

import React, { useEffect, useState } from "react";
import { getSystemInfo, SystemInfo } from "@/src/lib/support-utils";
import { Info, Globe, Code, Heart, ShieldCheck, Zap } from "lucide-react";

export function AboutSection() {
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    setSysInfo(getSystemInfo());
  }, []);

  const stats = [
    { label: "Version", value: "2.1.0" },
    { label: "Environment", value: "Production" },
    { label: "Client Engine", value: "Next.js 15" },
    { label: "UI Library", value: "React 19" },
  ];

  return (
    <div className="space-y-12">
      {/* Brand Card */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-[28px] bg-blue flex items-center justify-center text-white shadow-2xl shadow-blue/25">
          <span className="text-4xl font-black italic">K</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">KaruviLab</h2>
          <p className="text-text-3 text-sm font-medium max-w-sm mx-auto leading-relaxed">
            The private-first, professional utility laboratory. Fast, local, and free forever.
          </p>
        </div>
        <div className="flex gap-4">
           <button className="p-3 bg-bg border border-border rounded-2xl hover:bg-surface transition-all active:scale-95" title="GitHub">
             <Code className="w-5 h-5 text-text-3" />
           </button>
           <button className="p-3 bg-bg border border-border rounded-2xl hover:bg-surface transition-all active:scale-95" title="Twitter">
             <Globe className="w-5 h-5 text-text-3" />
           </button>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {[
           { label: "100% Local", desc: "Files never leave your device.", icon: ShieldCheck },
           { label: "No Tracking", desc: "No cookies, no accounts, no ads.", icon: Zap },
         ].map((item, i) => {
           const Icon = item.icon;
           return (
             <div key={i} className="p-6 bg-surface border border-border rounded-[32px] flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue/5 flex items-center justify-center text-blue flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black">{item.label}</h3>
                  <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest">{item.desc}</p>
                </div>
             </div>
           );
         })}
      </div>

      {/* App Stats */}
      <div className="bg-bg/50 border border-border rounded-[32px] overflow-hidden">
        <div className="px-8 py-4 border-b border-border bg-bg/80 flex items-center justify-between">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">App Information</span>
           <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-green-500/80">Systems Online</span>
           </div>
        </div>
        <div className="divide-y divide-border">
          {stats.map((stat, i) => (
            <div key={i} className="flex justify-between px-8 py-5">
              <span className="text-xs font-bold text-text-4">{stat.label}</span>
              <span className="text-xs font-black text-text font-mono">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Diagnostics */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 ml-4">Device Diagnostics</h3>
        <div className="p-6 bg-surface border border-border rounded-[32px] space-y-4">
           <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 opacity-60">Browser</p>
                <p className="text-xs font-bold truncate">{sysInfo?.browser}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 opacity-60">Operating System</p>
                <p className="text-xs font-bold truncate">{sysInfo?.os}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 opacity-60">Viewport</p>
                <p className="text-xs font-bold truncate">{sysInfo?.screenSize}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-4 opacity-60">Last Sync</p>
                <p className="text-xs font-bold truncate">{new Date().toLocaleTimeString()}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="text-center space-y-4 pt-4 pb-8">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by Karuvi Team
        </div>
        <p className="text-[9px] text-text-4 max-w-xs mx-auto opacity-40">
          © 2026 KaruviLab. Licensed under MIT. All calculations are provided without warranty.
        </p>
      </div>
    </div>
  );
}
