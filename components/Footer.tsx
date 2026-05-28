import Link from "next/link";
import { Heart, Code, Globe, Mail, Shield, Zap, Cpu } from "lucide-react";
import { KVLogo } from "@/components/ui/KVLogo";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { CATEGORIES } from "@/src/tool-registry";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-border mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Top Section: Multi-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <KVLogo size="md" loading="lazy" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue leading-none mb-1">Elite Tools</span>
                  <span className="brand-wordmark text-2xl tracking-tight leading-none text-text">
                    KaruviLab
                  </span>
                </div>
              </Link>
              <p className="text-text-3 text-xs font-medium leading-relaxed max-w-[240px]">
                Professional, browser-native tools built for the privacy-conscious developer. 100% local processing.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://github.com/karuvilab" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg border border-border rounded-xl text-text-4 hover:text-blue hover:border-blue/30 transition-all shadow-sm" title="GitHub">
                <Code className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/karuvilab" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg border border-border rounded-xl text-text-4 hover:text-blue hover:border-blue/30 transition-all shadow-sm" title="Twitter">
                <Globe className="w-4 h-4" />
              </a>
              <a href="mailto:support@karuvilab.com" className="p-2 bg-bg border border-border rounded-xl text-text-4 hover:text-blue hover:border-blue/30 transition-all shadow-sm" title="Email Support">
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="inline-block">
              <PrivacyBadge />
            </div>
          </div>

          {/* Column 2: Tools (Categories) */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Universal Tools</h4>
            <nav className="grid grid-cols-1 gap-3">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/${cat.href}`}
                  className="text-xs font-bold text-text-3 hover:text-blue transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-border group-hover:bg-blue transition-colors" />
                  {cat.label}
                </Link>
              ))}
              <Link href="/all-tools" className="text-xs font-black text-blue hover:underline uppercase tracking-widest pt-2">
                Browse All →
              </Link>
            </nav>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Resources</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/blog" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Engineering Blog</Link>
              <Link href="/help" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Help Center</Link>
              <Link href="/sitemap" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Sitemap</Link>
              <Link href="/settings" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">User Preferences</Link>
              <Link href="/offline" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Offline Status</Link>
            </nav>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Legal & Support</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">About KaruviLab</Link>
              <Link href="/privacy" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Terms of Service</Link>
              <Link href="/disclaimer" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Disclaimer</Link>
              <Link href="/contact" className="text-xs font-bold text-text-3 hover:text-blue transition-colors">Contact Support</Link>
            </nav>
          </div>

        </div>

        {/* Middle Section: Capability Badges */}
        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4">
            <Zap className="w-3.5 h-3.5 text-yellow-500" /> PWA Ready
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4">
            <Globe className="w-3.5 h-3.5 text-blue" /> Offline Capable
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4">
            <Cpu className="w-3.5 h-3.5 text-success" /> Browser Native
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4">
            <Shield className="w-3.5 h-3.5 text-blue" /> Zero Server Upload
          </div>
        </div>

        {/* Bottom Section: Copyright & Attribution */}
        <div className="mt-12 pt-8 border-t border-border/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-4">
              © {currentYear} KaruviLab. All rights reserved.
            </p>
            <p className="text-[9px] font-bold text-text-4/60 uppercase tracking-tighter">
              v2.1.0-stable • Hardware Accelerated Web Tools
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-4 bg-bg px-4 py-2 rounded-full border border-border shadow-sm">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> by KaruviLab Developers
          </div>
        </div>
      </div>
    </footer>
  );
}
