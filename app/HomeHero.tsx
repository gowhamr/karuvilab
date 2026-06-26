import { Sparkles, CloudOff, Lock, UserMinus, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { SearchBar } from "@/components/ui/search/SearchBar";

const TRUST_ITEMS = [
  { icon: CloudOff, text: "No Uploads" },
  { icon: Lock,     text: "100% Private" },
  { icon: UserMinus,text: "No Accounts" },
  { icon: Zap,      text: "Instant" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeHero({ isReturning = false }: { isReturning?: boolean }) {
  const greeting = getGreeting();

  if (isReturning) {
    return (
      <section
        aria-label="Welcome back to KaruviLab"
        className="relative flex flex-col items-center text-center px-4 pt-6 md:pt-10 pb-4 overflow-hidden transition-all duration-500"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-screen h-48 scale-x-[1.4] scale-y-125 bg-gradient-to-r from-blue/5 via-indigo-500/5 to-purple-500/5 rounded-full blur-[80px] z-behind"
        />
        
        <h1 className="font-black tracking-tight text-text text-2xl md:text-3xl lg:text-4xl max-w-lg mb-2">
          {greeting} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-text-4 font-medium mb-6">
          Continue where you left off
        </p>

        <div className="w-full max-w-2xl mx-auto relative z-content mb-4">
          <SearchBar variant="hero" />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Welcome to KaruviLab"
      className="relative flex flex-col items-center text-center px-4 pt-6 md:pt-10 pb-2 overflow-hidden transition-all duration-500"
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
      <h1 className="font-black tracking-tighter text-text mx-auto text-balance transition-all duration-500 text-4xl md:text-5xl lg:text-6xl leading-[1.1] max-w-xl mb-4">
        Build faster with KV.{" "}
        <span className="bg-gradient-to-r from-blue via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Privacy you can trust.
        </span>
      </h1>

      {/* ── Sub-copy ── */}
      <p className="text-sm sm:text-base text-text-4 max-w-xl mx-auto leading-relaxed font-medium mb-5">
        Browser-native productivity tools running locally. Secure, lightning-fast, and completely free.
      </p>

      {/* ── CTAs ── */}
      <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
        <Link
          href="/all-tools"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-blue text-white text-sm font-bold shadow-md shadow-blue/25 hover:bg-blue-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue/30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          aria-label="Browse all tools"
        >
          Browse All Tools
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          href="/pdf-tools"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-transparent border border-border text-sm font-bold text-text-muted hover:bg-surface hover:text-text hover:border-border-focus transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          aria-label="Explore PDF tools"
        >
          PDF Tools
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
            <item.icon className="w-3.5 h-3.5 text-brand-primary shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div
        aria-hidden="true"
        className="w-full max-w-5xl mx-auto bg-gradient-to-r from-transparent via-border to-transparent transition-all duration-500 mt-8 h-px opacity-100"
      />
    </section>
  );
}
