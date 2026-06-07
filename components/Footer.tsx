"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, WifiOff, Cpu, Lock, Clock } from "lucide-react";
import { KVLogo } from "@/components/ui/KVLogo";
import { getRecentTools, ToolEntry } from "@/src/tool-registry";

export function Footer() {
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRecentTools(getRecentTools());
    setIsOnline(navigator.onLine);
    setMounted(true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navigationLinks = [
    { label: "All Tools", href: "/all-tools" },
    { label: "Settings", href: "/settings" },
    { label: "Help & Support", href: "/help" },
    { label: "About Us", href: "/about" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ];

  return (
    <footer className="w-full bg-[--kv-mat-base] border-t border-border/60 mt-auto pb-24 md:pb-0 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Top section: Recent Tools & Links */}
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-6">
          {/* Continue Using */}
          <div className="flex-1 space-y-3 min-h-[60px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">
              Continue Using
            </h4>
            {!mounted ? (
              <div className="flex gap-2">
                <div className="w-24 h-7 bg-surface border border-border rounded-xl animate-pulse" />
                <div className="w-28 h-7 bg-surface border border-border rounded-xl animate-pulse" />
              </div>
            ) : recentTools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentTools.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${tool.href}`}
                    className="px-3 py-1.5 bg-surface border border-border rounded-xl text-[10px] font-bold text-text-2 hover:text-blue hover:border-blue/30 transition-all shadow-sm active:scale-95"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-text-4 text-xs font-semibold">
                <div className="p-1.5 rounded-lg bg-bg border border-border">
                  <Clock className="w-3.5 h-3.5 text-text-4" />
                </div>
                <span>
                  No recent tools yet.{" "}
                  <Link href="/all-tools" className="text-brand-primary hover:underline font-black">
                    Browse tools
                  </Link>
                </span>
              </div>
            )}
          </div>

          {/* Quick Links Column Group */}
          <div className="flex-1 grid grid-cols-2 gap-6 md:justify-items-end">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">
                Resources
              </h4>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-semibold text-text-3 hover:text-brand-primary transition-colors py-0.5 block md:text-right"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-4">
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-semibold text-text-3 hover:text-brand-primary transition-colors py-0.5 block md:text-right"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* Bottom section: Brand, Trust, Status */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-2 shrink-0">
            <KVLogo size="sm" withText={false} className="opacity-70 grayscale hover:grayscale-0 transition-all" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-4">
              Powered by KaruviLab
            </span>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-[10px] font-black uppercase tracking-widest text-text-4/80">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3 h-3" /> Works Offline
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> No Uploads
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> 100% Private
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Local Processing
            </span>
          </div>

          {/* Status Badge */}
          <div className="shrink-0 mt-2 lg:mt-0">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
              !mounted 
                ? "bg-surface border-border text-text-4" 
                : isOnline 
                  ? "bg-success/5 border-success/15 text-success" 
                  : "bg-warn/5 border-warn/15 text-warn animate-pulse"
            }`}>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  !mounted ? "bg-text-4" : isOnline ? "bg-success" : "bg-warn"
                }`}
              />
              <span>{!mounted ? "Checking..." : isOnline ? "Offline Ready" : "Running Locally"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
