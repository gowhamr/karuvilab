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
    <footer className="w-full bg-mat-base border-t border-border/60 mt-auto pb-24 md:pb-0 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Top section: Recent Tools & Links */}
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-6">
          {/* Continue Using */}
          {(!mounted || recentTools.length > 0) && (
            <div className="flex-1 space-y-3 min-h-15">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
                Continue Using
              </h4>
              {!mounted ? (
                <div className="flex gap-2">
                  <div className="w-24 h-7 bg-surface border border-border rounded-xl animate-pulse" />
                  <div className="w-28 h-7 bg-surface border border-border rounded-xl animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recentTools.slice(0, 4).map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.href}`}
                      className="px-3 py-1.5 bg-surface rounded-xl text-xs font-bold text-text-2 hover:text-blue transition-all shadow-sm active:scale-95"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Links Column Group */}
          <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6 bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm md:justify-items-end">
            <div className="space-y-3">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
                Resources
              </h4>
              <ul className="space-y-0.5">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-text-muted hover:text-blue transition-colors py-1 block flex items-center md:justify-end"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
                Legal
              </h4>
              <ul className="space-y-0.5">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-text-muted hover:text-blue transition-colors py-1 block flex items-center md:justify-end"
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
            <KVLogo size="sm" withText={false} className="opacity-60 hover:opacity-100 transition-all" />
            <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-2">
              Powered by KaruviLab
            </span>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-tiny font-bold uppercase tracking-widest-sm text-text-2">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3 h-3" /> Works Offline
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> 100% Private
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Local Processing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
