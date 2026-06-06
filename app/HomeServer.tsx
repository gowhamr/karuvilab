import { Sparkles, CloudOff, Lock, UserMinus, Zap } from "lucide-react";
import { translations } from "@/src/lib/i18n";

const TRUST_ITEMS = [
  { icon: CloudOff, text: "No Uploads" },
  { icon: Lock, text: "100% Private" },
  { icon: UserMinus, text: "No Accounts" },
  { icon: Zap, text: "Instant" }
];

export function HomeHero() {
  const t = translations.en.hero;
  return (
    <section className="relative pt-6 md:pt-12 flex flex-col items-center text-center space-y-6 px-4">
      {/* Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mat-surface border border-mat-border text-[11px] font-bold uppercase tracking-widest text-text-4">
        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
        <span>{t.tag}</span>
      </div>

      {/* H1 — Server rendered, SEO-optimized */}
      <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-black tracking-tighter leading-[1.1] text-text max-w-2xl">
        {t.title}<br />
        <span className="text-text-4">{t.subtitle}</span>
      </h1>

      {/* Subheadline — 14px minimum */}
      <p className="text-[14px] md:text-[16px] text-text-3 font-medium max-w-md mx-auto leading-relaxed">
        {t.desc}
        <span className="block text-text-4 mt-1">Fast. Secure. Local-first.</span>
      </p>

      {/* Trust strip — always visible, 75% opacity */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity">
            <item.icon className="w-3.5 h-3.5 text-brand-primary" />
            <span className="text-[12px] font-bold uppercase tracking-widest text-text-4">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
