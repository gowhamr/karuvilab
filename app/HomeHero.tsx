import { Sparkles, CloudOff, Lock, UserMinus, Zap } from "lucide-react";

const TRUST_ITEMS = [
  { icon: CloudOff, text: "No Uploads" },
  { icon: Lock, text: "100% Private" },
  { icon: UserMinus, text: "No Accounts" },
  { icon: Zap, text: "Instant" }
];

export function HomeHero() {
  return (
    <section className="relative pt-4 md:pt-10 flex flex-col items-center text-center space-y-3 md:space-y-5 px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue/10 via-indigo-500/5 to-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Tag pill — reduce size */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mat-surface border border-mat-border text-[10px] font-bold uppercase tracking-widest text-text-3">
        <Sparkles className="w-3 h-3 text-brand-primary" />
        <span>Productivity Refined</span>
      </div>

      {/* H1 — reduce size on mobile */}
      <h1 className="text-[26px] sm:text-[36px] md:text-[48px] font-black tracking-tighter leading-[1.1] text-text max-w-2xl">
        Build faster with KV.<br />
        <span className="block text-text-3">Privacy you can trust.</span>
      </h1>

      {/* Description — tighter, 1 line on mobile */}
      <p className="text-[13px] sm:text-[15px] md:text-[16px] text-text-3 font-medium max-w-sm sm:max-w-md mx-auto leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
        The world's most private browser-side toolkit. Local-first tools by KaruviLab.
        <span className="block text-text-3 mt-1">Fast. Secure. Local-first.</span>
      </p>

      {/* Trust strip — compact on mobile */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <item.icon className="w-3 h-3 text-brand-primary" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-3">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
