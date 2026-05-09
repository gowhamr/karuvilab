"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, getRecentTools, ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useState, useEffect } from "react";
import { Home, Info, HelpCircle, Settings, Shield, X, Clock, Search, Command, LayoutGrid, Zap, Layout, Heart } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const SUPPORT_LINKS = [
  { href: "/about/", label: "About", icon: Info },
  { href: "/help/", label: "Help", icon: HelpCircle },
  { href: "/settings/", label: "Settings", icon: Settings },
  { href: "/privacy/", label: "Privacy", icon: Shield },
  { href: "/disclaimer/", label: "Disclaimer", icon: Shield },
];

function SidebarContent({ pathname, recent, favorites, setIsOpen }: { pathname: string, recent: ToolEntry[], favorites: ToolEntry[], setIsOpen: (o: boolean) => void }) {
  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar pb-24 md:pb-8">
      {/* Mobile Search (Sticky Layout) */}
      <div className="md:hidden sticky top-0 z-20 bg-surface/50 backdrop-blur-xl -mx-4 px-4 py-3 mb-4 border-b border-border/10">
        <button 
          onClick={() => {
            setIsOpen(false);
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
          }}
          className="w-full h-[48px] flex items-center justify-between px-4 bg-bg dark:bg-white/5 border border-border dark:border-white/5 rounded-2xl text-[11px] font-bold text-text-4 dark:text-white/40 hover:bg-blue/5 dark:hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-surface dark:bg-white/5 border border-border dark:border-white/5 flex items-center justify-center group-hover:bg-blue/10 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <span>Quick Search</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-1 bg-surface dark:bg-black/40 border border-border dark:border-white/10 rounded-lg text-[8px] font-mono group-hover:border-blue/30">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Core Links */}
      <div className="space-y-2">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`group flex items-center gap-3 h-[52px] px-4 rounded-2xl transition-all font-bold text-xs ${
            pathname === "/" 
              ? "bg-blue text-white neon-glow" 
              : "text-text-2 dark:text-white/60 hover:bg-blue/10 hover:text-blue dark:hover:bg-white/5 dark:hover:text-white"
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            pathname === "/" ? "bg-white/20" : "bg-bg dark:bg-white/5 border border-border dark:border-white/5 group-hover:bg-blue/20"
          }`}>
            <Home className="w-4 h-4" />
          </div>
          Home
        </Link>
      </div>

      {/* Personal Favorites */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <div className="px-4 flex items-center gap-2 text-[10px] font-black text-text-4 dark:text-white/30 uppercase tracking-[0.2em]">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            Personal Favorites
          </div>
          <div className="space-y-1">
            {favorites.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className={`group flex items-center h-[52px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                  pathname.includes(tool.href) 
                    ? "bg-blue/10 text-blue" 
                    : "text-text-3 dark:text-white/60 hover:text-blue dark:hover:text-white hover:bg-blue/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center mr-3 group-hover:bg-red-500/20 transition-all">
                  <ToolIcon toolId={tool.id} category={tool.category} className="w-3.5 h-3.5 text-red-500" />
                </div>
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Used */}
      {recent.length > 0 && (
        <div className="space-y-3">
          <div className="px-4 flex items-center gap-2 text-[10px] font-black text-text-4 dark:text-white/30 uppercase tracking-[0.2em]">
            <Clock className="w-3.5 h-3.5" />
            Recent Activity
          </div>
          <div className="space-y-1">
            {recent.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className={`group flex items-center h-[52px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                  pathname.includes(tool.href) 
                    ? "bg-blue/10 text-blue" 
                    : "text-text-3 dark:text-white/60 hover:text-blue dark:hover:text-white hover:bg-blue/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue/20 group-hover:bg-blue mr-3 transition-all" />
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        <div className="px-4 flex items-center gap-2 text-[10px] font-black text-text-4 dark:text-white/30 uppercase tracking-[0.2em]">
          <LayoutGrid className="w-3.5 h-3.5" />
          Universal Tools
        </div>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const isActive = pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`);
            return (
              <Link
                key={cat.id}
                href={`/${cat.href}`}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 h-[52px] px-4 rounded-2xl transition-all font-bold text-[11px] ${
                  isActive
                    ? "bg-blue/10 text-blue shadow-sm shadow-blue/5"
                    : "text-text-3 dark:text-white/60 hover:bg-blue/5 hover:text-blue dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? "bg-blue text-white neon-glow" : "bg-bg dark:bg-white/5 border border-border dark:border-white/5 group-hover:bg-blue/10"
                }`}>
                  <ToolIcon category={cat.id} className="w-4 h-4" />
                </div>
                <span className="flex-1">{cat.label}</span>
                {isActive && (
                   <div className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div className="pt-6 border-t border-border dark:border-white/5 space-y-1">
        {SUPPORT_LINKS.map(link => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 h-[48px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                pathname === link.href ? "text-blue bg-blue/5" : "text-text-4 dark:text-white/40 hover:text-blue dark:hover:text-white hover:bg-blue/5 dark:hover:bg-white/5"
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg dark:bg-white/5 border border-border dark:border-white/5 group-hover:border-blue/20 transition-all">
                <Icon className="w-4 h-4" />
              </div>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const { isSidebarOpen: isOpen, setIsSidebarOpen: setIsOpen } = useSearchStore();
  const { favorites: favoriteIds } = useFavoriteStore();
  const [recent, setRecent] = useState<ToolEntry[]>([]);
  const [favorites, setFavorites] = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, -100], [1, 0]);

  useEffect(() => {
    setIsOpen(false);
    setRecent(getRecentTools().slice(0, 5));
    if (hydrated) {
      setFavorites(ALL_TOOLS.filter(t => favoriteIds.includes(t.id)).slice(0, 5));
    }
  }, [pathname, setIsOpen, favoriteIds, hydrated]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Drawer */}
            <motion.aside
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.05}
              onDragEnd={(_, info) => {
                if (info.offset.x < -100 || info.velocity.x < -500) {
                  setIsOpen(false);
                }
              }}
              style={{ x, opacity }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[82vw] max-w-[360px] rounded-r-[32px] sidebar-glass z-[70] flex flex-col md:hidden overflow-hidden touch-none"
            >
              {/* Drag Handle */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/20 rounded-full md:hidden" />

              <div className="h-20 flex items-center justify-between px-6 border-b border-border dark:border-white/5 bg-white/5">
                <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tight text-text dark:text-white">
                  <div className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center text-white neon-glow">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <span>Karuvi<span className="text-blue">Lab</span></span>
                </Link>
                <button
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-text-4 dark:text-white/40"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent pathname={pathname} recent={recent} favorites={favorites} setIsOpen={setIsOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[280px] rounded-r-[32px] sidebar-glass z-30 flex-col overflow-hidden">
        <div className="h-24 flex items-center px-8 border-b border-border dark:border-white/5 bg-white/5">
          <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-blue flex items-center justify-center text-white neon-glow">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>Karuvi<span className="text-blue">Lab</span></span>
          </Link>
        </div>
        <SidebarContent pathname={pathname} recent={recent} favorites={favorites} setIsOpen={setIsOpen} />
        <div className="p-6 border-t border-border dark:border-white/5 bg-white/5">
           <div className="p-5 rounded-3xl bg-gradient-to-br from-blue/10 to-transparent border border-blue/20 space-y-3 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue/10 blur-xl group-hover:bg-blue/20 transition-all rounded-full" />
              <p className="text-[10px] font-black text-blue uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Enterprise Ready
              </p>
              <p className="text-[10px] text-text-4 dark:text-white/40 font-bold leading-relaxed">Secure, local-first tools for high-performance workflows.</p>
           </div>
        </div>
      </aside>
    </>
  );
}
