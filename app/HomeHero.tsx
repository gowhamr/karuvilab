"use client";

import { memo } from "react";
import { Sparkles, CloudOff, Lock, UserMinus, Zap, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { Button } from "@/components/ui/Button";
import { m, AnimatePresence } from "framer-motion";

const TRUST_ITEMS = [
  { icon: CloudOff, text: "No Uploads" },
  { icon: Lock,     text: "100% Private" },
  { icon: UserMinus,text: "No Accounts" },
  { icon: Zap,      text: "Instant" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

const TIPS = [
  "KaruviLab processes 100% of your data inside your browser. No files are ever uploaded.",
  "Use Ctrl+K or Cmd+K anytime to quickly search and switch between 150+ tools.",
  "Drag & drop files directly onto supported tools for instant execution.",
  "Favorite your frequently used tools to pin them to your personal dashboard."
];

interface HomeHeroProps {
  isReturning?: boolean;
}

export const HomeHero = memo(function HomeHero({ isReturning = false }: HomeHeroProps) {
  const greeting = getGreeting();
  const dateStr = getFormattedDate();
  const todayTip = TIPS[new Date().getDay() % TIPS.length];

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isReturning ? (
        <m.section
          key="returning-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          aria-label="Welcome back to KaruviLab"
          className="relative flex flex-col items-center text-center px-4 pt-6 md:pt-10 pb-4 overflow-hidden"
        >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-screen h-48 scale-x-[1.4] scale-y-125 bg-gradient-to-r from-blue/5 via-indigo-500/5 to-purple-500/5 rounded-full blur-[80px] z-behind"
        />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/5 border border-blue/15 text-[11px] font-bold text-text-muted mb-3">
          <Calendar className="w-3 h-3 text-blue" />
          <span>{dateStr}</span>
        </div>
        
        <h1 className="font-black tracking-tight text-text text-2xl md:text-3xl lg:text-4xl max-w-lg mb-1">
          {greeting} <span className="inline-block motion-safe:animate-wave origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted font-medium mb-5 max-w-md mx-auto">
          💡 <span className="text-text-2">{todayTip}</span>
        </p>

        <div className="w-full max-w-2xl mx-auto relative z-content mb-4">
          <SearchBar variant="hero" />
        </div>
      </m.section>
      ) : (
      <m.section
        key="new-hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        aria-label="Welcome to KaruviLab"
        className="relative flex flex-col items-center text-center px-4 pt-6 md:pt-10 pb-2 overflow-hidden"
      >
        {/* ── Ambient glows ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-screen h-72 scale-x-[1.4] scale-y-125 bg-gradient-to-r from-blue/10 via-indigo-500/8 to-purple-500/10 rounded-full blur-[100px] z-behind"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[10%] w-48 h-48 bg-blue/5 rounded-full blur-[60px] z-behind"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] right-[8%] w-40 h-40 bg-purple-500/5 rounded-full blur-[60px] z-behind"
      />

      {/* ── Tag pill ── */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue/5 border border-blue/15 text-xs font-bold uppercase tracking-widest text-blue shadow-sm mb-4">
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        <span>Privacy-First Toolkit</span>
      </div>

      {/* ── Headline ── */}
      <h1 className="font-black tracking-tighter text-text mx-auto text-balance transition-all duration-500 text-4xl md:text-5xl lg:text-6xl leading-[1.1] max-w-xl mb-4 font-poppins">
        Build faster with KaruviLab.{" "}
        <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Privacy you can trust.
        </span>
      </h1>

      {/* ── Sub-copy ── */}
      <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed font-medium mb-5">
        Browser-native productivity tools running locally. Secure, lightning-fast, and completely free.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
        <Link href="/all-tools">
          <Button
            variant="primary"
            size="lg"
            aria-label="Browse all tools"
            className="font-poppins font-bold"
          >
            Browse All Tools
            <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      {/* ── Trust strip ── */}
      <div
        role="list"
        aria-label="Key features"
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.text}
            role="listitem"
            className="flex items-center gap-1.5"
          >
            <item.icon className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="w-full max-w-5xl mx-auto bg-gradient-to-r from-transparent via-divider to-transparent transition-all duration-500 mt-8 h-px opacity-100"
      />
    </m.section>
    )}
    </AnimatePresence>
  );
});

HomeHero.displayName = "HomeHero";
