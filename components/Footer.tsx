"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, WifiOff, Cpu } from "lucide-react";
import { KVLogo } from "@/components/ui/KVLogo";
import { useFullscreenContext } from '@/src/contexts/FullscreenContext';

export function Footer() {
  const { isFullscreen } = useFullscreenContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isFullscreen || !mounted) return null;

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
    <footer className="w-full bg-mat-base border-t border-border/60 mt-auto pb-24 md:pb-16 z-content relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 flex flex-col gap-12">
        
        {/* Resources */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-text-2">
            Resources
          </h4>
          <ul className="flex flex-col gap-3">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-sm font-medium text-text-3 hover:text-blue transition-colors block w-fit"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Legal */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-text-2">
            Legal
          </h4>
          <ul className="flex flex-col gap-3">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-sm font-medium text-text-3 hover:text-blue transition-colors block w-fit"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px w-full max-w-sm bg-border/60" />

        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <KVLogo size="sm" withText={false} loading="lazy" className="opacity-60 hover:opacity-100 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-3">
            KaruviLab
          </span>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-6 lg:gap-10 text-[11px] font-bold uppercase tracking-wider text-text-3">
          <span className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-blue/70" /> Works Offline
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue/70" /> 100% Private
          </span>
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue/70" /> Local Processing
          </span>
        </div>
        
      </div>
    </footer>
  );
}
