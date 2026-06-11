"use client";

import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, getRecentTools, ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useShallow } from "zustand/react/shallow";
import { m } from "framer-motion";
import { useI18n } from "@/src/lib/i18n/store";
import { KVLogo } from "@/components/ui/KVLogo";
import { MobileSidebar } from "./layout/MobileSidebar";
import { getDeviceCapabilities } from "@/src/utils";
import { Home, Info, HelpCircle, Settings, Shield, FileWarning, X, Clock, Search, Command, LayoutGrid, Heart, LucideIcon } from "lucide-react";

const SUPPORT_LINKS = [
  { href: "/about/", label: "About", icon: Info, key: 'common.about' },
  { href: "/help/", label: "Help", icon: HelpCircle, key: 'common.help' },
  { href: "/settings/", label: "Settings", icon: Settings, key: 'common.settings' },
  { href: "/privacy/", label: "Privacy", icon: Shield, key: 'common.privacy' },
  { href: "/disclaimer/", label: "Disclaimer", icon: FileWarning, key: 'common.disclaimer' },
];

const SidebarItem = memo(function SidebarItem({ 
  href, 
  isActive, 
  onClick, 
  icon: Icon, 
  label, 
  color,
  category,
  toolId,
  isSmall = false,
  isHoverable = true
}: { 
  href: string; 
  isActive: boolean; 
  onClick: () => void; 
  icon?: LucideIcon; 
  label: string; 
  color?: string;
  category?: string;
  toolId?: string;
  isSmall?: boolean;
  isHoverable?: boolean;
}) {

  const content = (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center transition-all font-bold outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-mat-base ${
        isSmall 
          ? `h-[52px] px-4 text-[11px] rounded-xl ${isActive ? "bg-blue/10 text-blue" : "text-text-3 hover:text-blue hover:bg-blue/5"}`
          : `h-[52px] px-3 rounded-2xl text-sm ${isActive ? "bg-blue/5 text-blue" : "text-text-3 hover:text-text hover:bg-[--kv-mat-hover]"}`
      }`}
      style={{
        color: !isSmall && isActive ? color : undefined,
        backgroundColor: !isSmall && isActive ? `color-mix(in srgb, ${color} 20%, transparent)` : undefined,
      }}
    >
      <div 
        className={isSmall 
          ? "w-8 h-8 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center mr-3 group-hover:bg-blue/20 transition-all"
          : `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "" : "bg-transparent group-hover:scale-105"}`
        }
        style={{
          color: !isSmall && isActive ? color : undefined,
        }}
      >
        {Icon ? <Icon className={isSmall ? "w-3.5 h-3.5" : "w-5 h-5"} /> : <ToolIcon category={category} toolId={toolId} className={isSmall ? "w-3.5 h-3.5" : "w-5 h-5"} />}
      </div>
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );

  if (!isHoverable) return content;

  return (
    <m.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
      {content}
    </m.div>
  );
});

const CoreLinks = memo(function CoreLinks({ pathname, setIsOpen, isHoverable }: { pathname: string; setIsOpen: () => void; isHoverable: boolean }) {
  const t = useI18n(state => state.t);

  return (
    <div className="space-y-2">
      <SidebarItem
        href="/"
        isActive={pathname === "/"}
        onClick={setIsOpen}
        label={t('common.home')}
        icon={Home}
        isHoverable={isHoverable}
      />
    </div>
  );
});

const CategoriesList = memo(function CategoriesList({ pathname, setIsOpen, isHoverable }: { pathname: string; setIsOpen: () => void; isHoverable: boolean }) {
  return (
    <div className="space-y-4">
      <div className="px-5 flex items-center gap-2 text-[12px] font-black text-text-4 uppercase tracking-[0.15em]">
        <LayoutGrid className="w-4 h-4" />
        Universal Tools
      </div>
      <div className="space-y-1">
        {CATEGORIES.map((cat) => (
          <SidebarItem
            key={cat.id}
            href={`/${cat.href}`}
            isActive={pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`)}
            onClick={setIsOpen}
            label={cat.label}
            color={cat.color}
            category={cat.id}
            isHoverable={isHoverable}
          />
        ))}
        <SidebarItem
          href="/all-tools"
          isActive={pathname === "/all-tools"}
          onClick={setIsOpen}
          label="All Tools"
          icon={LayoutGrid}
          isHoverable={isHoverable}
        />
      </div>
    </div>
  );
});

const SupportLinks = memo(function SupportLinks({ pathname, setIsOpen, isHoverable }: { pathname: string; setIsOpen: () => void; isHoverable: boolean }) {
  const t = useI18n(state => state.t);

  return (
    <div className="pt-6 border-t border-border space-y-1">
      {SUPPORT_LINKS.map(link => (
        <SidebarItem
          key={link.href}
          href={link.href}
          isActive={pathname === link.href}
          onClick={setIsOpen}
          label={t(link.key as any) || link.label}
          icon={link.icon}
          isSmall
          isHoverable={isHoverable}
        />
      ))}
    </div>
  );
});

const SidebarContent = memo(function SidebarContent({ 
  pathname, 
  recent, 
  favorites, 
  setIsOpen,
  isHoverable
}: { 
  pathname: string, 
  recent: ToolEntry[], 
  favorites: ToolEntry[], 
  setIsOpen: () => void,
  isHoverable: boolean
}) {
  const t = useI18n(state => state.t);
  
  const handleSearchClick = useCallback(() => {
    setIsOpen();
    useSearchStore.getState().setIsPaletteOpen(true);
  }, [setIsOpen]);

  return (
    <nav 
      className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar pb-24 md:pb-8"
      style={{ contain: 'layout style' }}
    >
      {/* Mobile Search (Sticky Layout) */}
      <div className="md:hidden sticky top-0 z-20 bg-surface -mx-4 px-4 py-3 mb-4 border-b border-border">
        <button 
          onClick={handleSearchClick}
          className="w-full h-[48px] flex items-center justify-between px-4 bg-bg border border-border rounded-2xl text-[11px] font-bold text-text-4 hover:border-blue/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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

      <CoreLinks pathname={pathname} setIsOpen={setIsOpen} isHoverable={isHoverable} />
      <CategoriesList pathname={pathname} setIsOpen={setIsOpen} isHoverable={isHoverable} />

      {/* Personal Favorites */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <div className="px-4 flex items-center gap-2 text-[12px] font-black text-text-4 uppercase tracking-[0.20em]">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            {t('common.favorites')}
          </div>
          <div className="space-y-1">
            {favorites.map(tool => (
              <SidebarItem
                key={tool.id}
                href={`/${tool.href}`}
                isActive={pathname === `/${tool.href}` || pathname.startsWith(`/${tool.href}/`)}
                onClick={setIsOpen}
                label={tool.name}
                toolId={tool.id}
                category={tool.category}
                isSmall
                isHoverable={isHoverable}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Used */}
      {recent.length > 0 && (
        <div className="space-y-3">
          <div className="px-4 flex items-center gap-2 text-[12px] font-black text-text-4 uppercase tracking-[0.20em]">
            <Clock className="w-3.5 h-3.5" />
            {t('common.recent')}
          </div>
          <div className="space-y-1">
            {recent.map(tool => (
              <SidebarItem
                key={tool.id}
                href={`/${tool.href}`}
                isActive={pathname === `/${tool.href}` || pathname.startsWith(`/${tool.href}/`)}
                onClick={setIsOpen}
                label={tool.name}
                toolId={tool.id}
                category={tool.category}
                isSmall
                isHoverable={isHoverable}
              />
            ))}
          </div>
        </div>
      )}

      <SupportLinks pathname={pathname} setIsOpen={setIsOpen} isHoverable={isHoverable} />
    </nav>
  );
});

import { useFullscreenContext } from '@/src/contexts/FullscreenContext';

export function Sidebar() {
  const { isFullscreen } = useFullscreenContext();
  const pathname = usePathname() ?? "";
  const setIsSidebarOpen = useSearchStore(state => state.setIsSidebarOpen);
  const favoriteIds = useFavoriteStore(useShallow(state => state.favorites));
  const [recent, setRecent] = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isHoverable, setIsHoverable] = useState<boolean | null>(null);

  if (isFullscreen) return null;

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);

  useEffect(() => {
    setHydrated(true);
    const caps = getDeviceCapabilities();
    setIsHoverable(!caps.isMobile);
  }, [setIsSidebarOpen]);

  useEffect(() => {
    if (hydrated) {
      setRecent(getRecentTools().slice(0, 5));
    }
  }, [pathname, hydrated]);

  const favorites = useMemo(() => {
    if (!hydrated || favoriteIds.length === 0) return [];
    const favSet = new Set(favoriteIds);
    return ALL_TOOLS.filter(t => favSet.has(t.id)).slice(0, 10);
  }, [favoriteIds, hydrated]);

  return (
    <>
      {isHoverable === false ? (
        <MobileSidebar>
          <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-mat-surface">
            <Link href="/" onClick={closeSidebar}>
              <KVLogo withText size="sm" loading="lazy" />
            </Link>
            <button
              className="w-11 h-11 flex items-center justify-center hover:bg-mat-hover rounded-xl transition-colors text-text-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <SidebarContent 
            pathname={pathname} 
            recent={recent} 
            favorites={favorites} 
            setIsOpen={closeSidebar} 
            isHoverable={isHoverable}
          />
        </MobileSidebar>
      ) : (
        /* Desktop Permanent Sidebar */
        <aside 
          className={`hidden md:flex fixed top-0 left-0 bottom-0 w-[280px] rounded-r-[32px] bg-mat-surface border-r border-mat-border shadow-mat-shine z-30 flex-col overflow-hidden ${!hydrated ? 'invisible' : ''}`}
          style={{ contain: 'layout style' }}
        >
          <div className="h-20 flex items-center px-8 border-b border-border bg-mat-surface">
            <Link href="/">
              <KVLogo withText size="md" loading="lazy" />
            </Link>
          </div>
          <SidebarContent 
            pathname={pathname} 
            recent={recent} 
            favorites={favorites} 
            setIsOpen={closeSidebar} 
            isHoverable={isHoverable || false}
          />
          <div className="p-4 border-t border-border bg-mat-base">
             <div className="p-4 rounded-2xl border border-border bg-mat-surface space-y-2 relative overflow-hidden group">
                <p className="text-[12px] font-black text-blue uppercase tracking-[0.15em] flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Local-First
                </p>
                <p className="text-[12px] text-text-4 font-bold leading-tight">Private & secure data processing.</p>
             </div>
          </div>
        </aside>
      )}
    </>
  );
}
