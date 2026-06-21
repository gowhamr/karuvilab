"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, WifiOff, Cpu, Lock, Clock } from "lucide-react";
import { KVLogo } from "@/components/ui/KVLogo";
import { getRecentTools, ToolEntry } from "@/src/tool-registry";

import { useFullscreenContext } from '@/src/contexts/FullscreenContext';

export function Footer() {
  const { isFullscreen } = useFullscreenContext();
  const [recentTools, setRecentTools] = useState<ToolEntry[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  if (isFullscreen) return null;

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
    <footer className="w-full bg-mat-base border-t border-border/60 mt-auto pb-24 md:pb-0 z-content relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Top section: Recent Tools & Links */}
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
          {/* Continue Using */}
          {(!mounted || recentTools.length > 0) && (
            <div className="flex-1 space-y-4 min-h-15">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-2">
                Continue Using
              </h4>
              {!mounted ? (
                <div className="flex gap-2">
                  <div className="w-24 h-8 bg-surface border border-border rounded-xl animate-pulse" />
                  <div className="w-28 h-8 bg-surface border border-border rounded-xl animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recentTools.slice(0, 4).map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.href}`}
                      prefetch={false}
                      className="px-3 py-1.5 bg-surface border border-border/50 rounded-xl text-sm font-bold text-text-2 hover:bg-surface-hover hover:text-blue transition-all shadow-sm active:scale-95"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Links Column Group */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-2">
                Resources
              </h4>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-sm font-medium text-text-3 hover:text-blue transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-2">
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-sm font-medium text-text-3 hover:text-blue transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/60" />

        {/* Bottom section: Brand, Trust, Status */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <KVLogo size="sm" withText={false} loading="lazy" className="opacity-60 hover:opacity-100 transition-all" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-3">
              KaruviLab
            </span>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-8 text-[11px] font-bold uppercase tracking-wider text-text-3">
            <span className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-blue/70" /> Works Offline
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue/70" /> 100% Private
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-blue/70" /> Local Processing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
