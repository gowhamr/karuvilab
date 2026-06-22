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
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 flex flex-col gap-8">
        
        {/* 2-Column Mobile Layout for Links */}
        <div className="grid grid-cols-2 gap-8 md:flex md:gap-24">
          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-base font-bold tracking-[0.08em] text-text-2">
              Resources
            </h4>
            <ul className="flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-base font-medium text-text-3 hover:text-blue transition-colors block w-fit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-base font-bold tracking-[0.08em] text-text-2">
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-base font-medium text-text-3 hover:text-blue transition-colors block w-fit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-border/60" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-6">
          {/* Brand Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <KVLogo size="sm" withText={false} loading="lazy" className="opacity-80 hover:opacity-100 transition-all" />
              <span className="text-base font-bold tracking-widest text-text-2 uppercase">
                KARUVILAB
              </span>
            </div>
            <span className="text-base text-text-muted pl-[52px]">Privacy-first toolkit</span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-text-3 pl-[52px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <WifiOff className="w-4 h-4 text-text-muted" /> Works Offline
              </span>
              <span className="text-border/60">•</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-4 h-4 text-text-muted" /> 100% Private
              </span>
            </div>
            <span className="hidden sm:block text-border/60">•</span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Cpu className="w-4 h-4 text-text-muted" /> Local Processing
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
