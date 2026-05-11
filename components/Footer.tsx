import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 border-t border-border/10 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
        <div className="space-y-4 text-center md:text-left">
          <Link href="/" className="flex items-center gap-3 group justify-center md:justify-start">
            <div className="w-9 h-9 rounded-xl glass-icon flex items-center justify-center text-white shadow-lg shadow-ocean/25 group-hover:scale-105 transition-all">
              <span className="brand-wordmark text-lg leading-none mt-0.5 drop-shadow-sm">K</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="brand-wordmark text-xl tracking-tight leading-none text-text dark:text-white">
                KaruviLab
              </span>
              <div className="hairline-rule mt-1" />
            </div>
          </Link>
          <p className="text-text-4 text-[10px] font-black uppercase tracking-[0.2em]">Built for the privacy-conscious developer.</p>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/privacy" className="text-[9px] font-black uppercase tracking-widest text-text-4 hover:text-blue">Privacy</Link>
          <Link href="/terms" className="text-[9px] font-black uppercase tracking-widest text-text-4 hover:text-blue">Terms</Link>
          <Link href="/disclaimer" className="text-[9px] font-black uppercase tracking-widest text-text-4 hover:text-blue">Disclaimer</Link>
          <Link href="/about" className="text-[9px] font-black uppercase tracking-widest text-text-4 hover:text-blue">About</Link>
          <Link href="/contact" className="text-[9px] font-black uppercase tracking-widest text-text-4 hover:text-blue">Support</Link>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 pb-12 border-t border-border/5">
        <p className="text-[9px] font-black uppercase tracking-widest text-text-4">© 2026 KaruviLab. All rights reserved.</p>
        <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-4">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by developers
        </p>
      </div>
    </footer>
  );
}
