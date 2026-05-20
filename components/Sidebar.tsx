"use client";

import React, { memo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, getRecentTools, ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { Home, Info, HelpCircle, Settings, Shield, X, Clock, Search, Command, LayoutGrid, Zap, Layout, Heart } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { m, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useI18n } from "@/src/lib/i18n/store";
import { KVLogo } from "@/components/ui/KVLogo";

const SUPPORT_LINKS = [
  { href: "/about/", label: "About", icon: Info, key: 'common.about' },
  { href: "/help/", label: "Help", icon: HelpCircle, key: 'common.help' },
  { href: "/settings/", label: "Settings", icon: Settings, key: 'common.settings' },
  { href: "/privacy/", label: "Privacy", icon: Shield, key: 'common.privacy' },
  { href: "/disclaimer/", label: "Disclaimer", icon: Shield, key: 'common.disclaimer' },
];

const SidebarContent = memo(function SidebarContent({ 
  pathname, 
  recent, 
  favorites, 
  setIsOpen 
}: { 
  pathname: string, 
  recent: ToolEntry[], 
  favorites: ToolEntry[], 
  setIsOpen: (o: boolean) => void 
}) {
  const { t } = useI18n();

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar pb-24 md:pb-8">
      {/* Mobile Search (Sticky Layout) */}
      <div className="md:hidden sticky top-0 z-20 bg-surface -mx-4 px-4 py-3 mb-4 border-b border-border">
        <button 
          onClick={() => {
            setIsOpen(false);
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
          }}
          className="w-full h-[48px] flex items-center justify-between px-4 bg-bg border border-border rounded-2xl text-[11px] font-bold text-text-4 hover:border-blue/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center group-hover:bg-blue/5 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <span>{t('common.search').split('...')[0]}</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-1 bg-surface border border-border rounded-lg text-[8px] font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Core Links */}
      <div className="space-y-2">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          aria-current={pathname === "/" ? "page" : undefined}
          className={`group flex items-center gap-3 h-[56px] px-4 rounded-2xl transition-all font-bold text-sm ${
            pathname === "/" 
              ? "bg-blue/10 text-blue" 
              : "text-text-2 hover:bg-blue/5 hover:text-blue"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            pathname === "/" ? "bg-blue/20" : "bg-transparent group-hover:bg-blue/10"
          }`}>
            <Home className="w-5 h-5" />
          </div>
          {t('common.home')}
        </Link>
      </div>

      {/* Categories - Moved up for stability */}
      <div className="space-y-4">
        <div className="px-5 flex items-center gap-2 text-[11px] font-black text-text-4 uppercase tracking-[0.15em]">
          <LayoutGrid className="w-4 h-4" />
          Universal Tools
        </div>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`);
            const color = cat.color;
            return (
              <Link
                key={cat.id}
                href={`/${cat.href}`}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 h-[52px] px-3 rounded-2xl transition-all font-bold text-sm ${
                  isActive
                    ? "bg-blue/5 text-blue"
                    : "text-text-3 hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                style={{
                  color: isActive ? color : undefined,
                  backgroundColor: isActive ? `${color}15` : undefined, // 15 hex is ~8% opacity
                }}
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? "" : "bg-transparent group-hover:scale-105"
                  }`}
                  style={{
                    color: isActive ? color : undefined,
                  }}
                >
                  <ToolIcon category={cat.id} className="w-5 h-5" />
                </div>
                <span className="flex-1">{cat.label}</span>
              </Link>
            );
          })}
          <Link
            href="/all-tools"
            onClick={() => setIsOpen(false)}
            className={`group flex items-center gap-3 h-[52px] px-3 rounded-2xl transition-all font-bold text-sm ${
              pathname === "/all-tools"
                ? "bg-blue/10 text-blue"
                : "text-text-3 hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              pathname === "/all-tools" ? "text-blue" : "bg-transparent group-hover:scale-105"
            }`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="flex-1">All Tools</span>
          </Link>
        </div>
      </div>

      {/* Personal Favorites - Only show if hydrated and exists */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <div className="px-4 flex items-center gap-2 text-[10px] font-black text-text-4 uppercase tracking-[0.2em]">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            {t('common.favorites')}
          </div>
          <div className="space-y-1">
            {favorites.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center h-[52px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                  pathname.includes(tool.href) 
                    ? "bg-blue/10 text-blue" 
                    : "text-text-3 hover:text-blue hover:bg-blue/5"
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
          <div className="px-4 flex items-center gap-2 text-[10px] font-black text-text-4 uppercase tracking-[0.2em]">
            <Clock className="w-3.5 h-3.5" />
            {t('common.recent')}
          </div>
          <div className="space-y-1">
            {recent.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center h-[52px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                  pathname.includes(tool.href) 
                    ? "bg-blue/10 text-blue" 
                    : "text-text-3 hover:text-blue hover:bg-blue/5"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue/20 group-hover:bg-blue mr-3 transition-all" />
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Support */}
      <div className="pt-6 border-t border-border space-y-1">
        {SUPPORT_LINKS.map(link => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 h-[48px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                pathname === link.href ? "text-blue bg-blue/5" : "text-text-4 hover:text-blue hover:bg-blue/5"
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg border border-border group-hover:border-blue/20 transition-all">
                <Icon className="w-4 h-4" />
              </div>
              {t(link.key as any) || link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const isOpen = useSearchStore(state => state.isSidebarOpen);
  const setIsOpen = useSearchStore(state => state.setIsSidebarOpen);
  const favoriteIds = useFavoriteStore(state => state.favorites);
  const [recent, setRecent] = useState<ToolEntry[]>([]);
  const [favorites, setFavorites] = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Initialize hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Sync data on mount and changes
  useEffect(() => {
    if (hydrated) {
      setRecent(getRecentTools().slice(0, 5));
      setFavorites(ALL_TOOLS.filter(t => favoriteIds.includes(t.id)).slice(0, 5));
    }
  }, [pathname, favoriteIds, hydrated]);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, -100], [1, 0]);

  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Drawer */}
            <m.aside
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
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 left-0 bottom-0 w-[82vw] max-w-[320px] rounded-r-[32px] bg-surface border-r border-border z-[70] flex flex-col md:hidden overflow-hidden touch-none"
            >
              {/* Drag Handle */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/20 rounded-full md:hidden" />

              <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-bg">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <KVLogo withText size="sm" />
                </Link>
                <button
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-xl transition-colors text-text-4"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent pathname={pathname} recent={recent} favorites={favorites} setIsOpen={setIsOpen} />
            </m.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[280px] rounded-r-[32px] bg-surface border-r border-border z-30 flex-col overflow-hidden">
        <div className="h-20 flex items-center px-8 border-b border-border bg-bg">
          <Link href="/">
            <KVLogo withText size="md" />
          </Link>
        </div>
        <SidebarContent pathname={pathname} recent={recent} favorites={favorites} setIsOpen={setIsOpen} />
        <div className="p-4 border-t border-border bg-bg">
           <div className="p-4 rounded-2xl border border-border bg-surface space-y-2 relative overflow-hidden group">
              <p className="text-[9px] font-black text-blue uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Local-First
              </p>
              <p className="text-[9px] text-text-4 font-bold leading-tight">Private & secure data processing.</p>
           </div>
        </div>
      </aside>
    </>
  );
}
