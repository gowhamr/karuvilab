import { Sparkles, CloudOff, Lock, UserMinus, Zap } from "lucide-react";

const TRUST_ITEMS = [
  { icon: CloudOff, text: "No Uploads" },
  { icon: Lock, text: "100% Private" },
  { icon: UserMinus, text: "No Accounts" },
  { icon: Zap, text: "Instant" }
];

export function HomeHero() {
  return (
    <section className="relative pt-1 md:pt-4 flex flex-col items-center text-center space-y-2 md:space-y-4 px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue/10 via-indigo-500/5 to-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Tag pill — reduce size */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[--kv-mat-surface] border border-border/40 text-[10px] font-bold uppercase tracking-widest text-[--kv-text-muted] shadow-sm">
        <Sparkles className="w-3 h-3 text-[--kv-brand-primary]" />
        <span>Productivity Refined</span>
      </div>

      {/* H1 — reduce size on mobile */}
      <h1 className="text-[22px] md:text-5xl font-black tracking-tighter leading-[1.1] text-[--kv-text] max-w-2xl mt-1">
        Build faster with KV.<br />
        <span className="block text-[--kv-brand-primary]">Privacy you can trust.</span>
      </h1>

      {/* Description — tighter, 1 line on mobile */}
      <p className="text-[13px] sm:text-[15px] md:text-[16px] text-[--kv-text-muted] font-medium max-w-sm sm:max-w-md mx-auto leading-snug sm:leading-relaxed">
        Local-first tools by KaruviLab.
        <span className="block text-[--kv-text-muted] mt-1">Fast. Secure. Local-first.</span>
      </p>

      {/* Trust strip — compact on mobile */}
      <div className="flex items-center justify-center gap-x-3 gap-y-1 md:gap-x-4">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-1 md:gap-1.5 shrink-0">
            <item.icon className="w-3 h-3 text-[--kv-brand-primary]" aria-hidden="true" />
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-[--kv-text-muted]">{item.text}</span>
          </div>
        ))}
      </div>
      
      {/* Visual separation boundary */}
      <div className="w-full max-w-5xl mx-auto mt-4 md:mt-8 h-px bg-gradient-to-r from-transparent via-mat-border-focus to-transparent opacity-50" />
    </section>
  );
}
