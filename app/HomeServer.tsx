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
    <section className="relative pt-4 md:pt-10 flex flex-col items-center text-center space-y-3 md:space-y-5 px-4">
      {/* Tag pill — reduce size */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[--kv-mat-surface] border border-[--kv-mat-border] text-[10px] font-bold uppercase tracking-widest text-[--kv-text-muted]">
        <Sparkles className="w-3 h-3 text-[--kv-brand-primary]" />
        <span>{t.tag}</span>
      </div>

      {/* H1 — reduce size on mobile */}
      <h1 className="text-[26px] sm:text-[36px] md:text-[48px] font-black tracking-tighter leading-[1.1] text-[--kv-text] max-w-2xl">
        {t.title}<br />
        <span className="block text-[--kv-text-muted]">{t.subtitle}</span>
      </h1>

      {/* Description — tighter, 1 line on mobile */}
      <p className="text-[13px] sm:text-[15px] md:text-[16px] text-[--kv-text-muted] font-medium max-w-sm sm:max-w-md mx-auto leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
        {t.desc}
        <span className="block text-[--kv-text-muted] mt-1">Fast. Secure. Local-first.</span>
      </p>

      {/* Trust strip — compact on mobile */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <item.icon className="w-3 h-3 text-[--kv-brand-primary]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[--kv-text-muted]">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
