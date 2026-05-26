import Link from "next/link";
import { Heart } from "lucide-react";
import { KVLogo } from "@/components/ui/KVLogo";

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 border-t border-border/10 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
        <div className="space-y-4 text-center md:text-left">
          <Link href="/" className="flex items-center gap-3 group justify-center md:justify-start">
            <KVLogo size="md" loading="lazy" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-4 leading-none mb-1">Powered by</span>
              <span className="brand-wordmark text-xl tracking-tight leading-none text-text">
                KaruviLab
              </span>
            </div>
          </Link>
          <p className="text-text-4 text-[10px] font-black uppercase tracking-[0.2em]">100% Local-First Processing • Built for the privacy-conscious developer.</p>
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
