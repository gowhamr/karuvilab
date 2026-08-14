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

  if (isFullscreen) return null;

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
    <footer className="w-full bg-mat-base border-t border-border/60 mt-auto pb-24 md:pb-8 z-content relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col md:flex-row md:justify-between gap-8 md:gap-12">
        
        {/* Brand & Trust Badges */}
        <div className="flex flex-col gap-3 md:max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center opacity-80">
              <KVLogo size="sm" withText={false} />
            </div>
            <span className="text-sm font-bold tracking-widest text-text-2 uppercase">
              KaruviLab
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <WifiOff className="w-3 h-3" aria-hidden="true" /> Offline
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" /> Private
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Cpu className="w-3 h-3" aria-hidden="true" /> Local
            </span>
          </div>
        </div>

        {/* Resources (One Column) */}
        <nav aria-label="Site navigation">
          <ul className="flex flex-col gap-2.5">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-sm font-medium text-text-3 hover:text-blue transition-colors block w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 pt-6 border-t border-border/60">
        {/* Legal (One Row) */}
        <nav aria-label="Legal links">
          <ul className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
            <li aria-label="Copyright">&copy; {new Date().getFullYear()} KaruviLab</li>
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="hover:text-text-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
