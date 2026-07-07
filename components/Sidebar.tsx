"use client";

import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, getRecentTools, ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useShallow } from "zustand/react/shallow";
import { m, AnimatePresence } from "framer-motion";
import { useI18n } from "@/src/lib/i18n/store";
import { KVLogo } from "@/components/ui/KVLogo";
import { MobileSidebar } from "./layout/MobileSidebar";
import {
  Home, Info, HelpCircle, Settings, Shield, FileWarning,
  X, Clock, Search, Command, LayoutGrid, Heart, LucideIcon,
  ChevronRight, PanelLeftClose
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useSettingsStore } from "@/src/store/settings/store";

// ── Support links ─────────────────────────────────────────────────────────────

const SUPPORT_LINKS = [
  { href: "/about/",      label: "About",      icon: Info,        key: "common.about"      },
  { href: "/help/",       label: "Help",        icon: HelpCircle,  key: "common.help"       },
  { href: "/settings/",   label: "Settings",    icon: Settings,    key: "common.settings"   },
  { href: "/privacy/",    label: "Privacy",     icon: Shield,      key: "common.privacy"    },
  { href: "/disclaimer/", label: "Disclaimer",  icon: FileWarning, key: "common.disclaimer" },
];

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────

interface SidebarItemProps {
  href: string;
  isActive: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  label: string;
  color?: string;
  category?: string;
  toolId?: string;
  /** compact = small tool links in favorites/recent */
  compact?: boolean;
  isHoverable?: boolean;
}

const SidebarItem = memo(function SidebarItem({
  href, isActive, onClick, icon: Icon, label,
  color, category, toolId, compact = false, isHoverable = true,
}: SidebarItemProps) {

  const content = (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-btn transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        compact
          ? "h-10 px-3 text-caption font-semibold"
          : "h-11 px-3 text-body font-semibold",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <m.span
          layoutId="sidebar-active-pill"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          aria-hidden="true"
        />
      )}

      {/* Icon container */}
      <div
        className={cn(
          "flex items-center justify-center shrink-0 rounded-lg transition-all duration-150",
          compact ? "w-7 h-7" : "w-9 h-9",
          isActive
            ? "bg-primary/15 text-primary"
            : "bg-surface-elevated text-text-secondary group-hover:bg-primary/8 group-hover:text-primary"
        )}
        style={color && !isActive ? { background: `${color}15`, color } : undefined}
        aria-hidden="true"
      >
        {Icon
          ? <Icon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          : <ToolIcon category={category} toolId={toolId} className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        }
      </div>

      <span className="flex-1 truncate leading-none">{label}</span>
    </Link>
  );

  if (!isHoverable) return content;

  return (
    <m.div
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {content}
    </m.div>
  );
});

// ── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <p
      role="group"
      aria-label={typeof children === 'string' ? children : undefined}
      className="px-3 mb-2 flex items-center gap-2 text-[10px] font-black text-text-4 uppercase tracking-widest"
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}

// ── Core Links (Home) ─────────────────────────────────────────────────────────

const CoreLinks = memo(function CoreLinks({
  pathname, setIsOpen, isHoverable,
}: { pathname: string; setIsOpen: () => void; isHoverable: boolean }) {
  const t = useI18n(s => s.t);
  return (
    <>
      <SidebarItem
        href="/"
        isActive={pathname === "/"}
        onClick={setIsOpen}
        label={t("common.home")}
        icon={Home}
        isHoverable={isHoverable}
      />
      <SidebarItem
        href="/workbench"
        isActive={pathname === "/workbench"}
        onClick={setIsOpen}
        label="Workbench"
        icon={LayoutGrid} // You can use AppWindow or LayoutGrid, I'll use LayoutGrid since AppWindow isn't imported here
        isHoverable={isHoverable}
      />
    </>
  );
});

// ── Categories ────────────────────────────────────────────────────────────────

const CategoriesList = memo(function CategoriesList({
  pathname, setIsOpen, isHoverable,
}: { pathname: string; setIsOpen: () => void; isHoverable: boolean }) {
  return (
    <div className="space-y-0.5">
      <SectionLabel icon={LayoutGrid}>Tools</SectionLabel>
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
  );
});

// ── Support Links ─────────────────────────────────────────────────────────────

const SupportLinks = memo(function SupportLinks({
  pathname, setIsOpen, isHoverable,
}: { pathname: string; setIsOpen: () => void; isHoverable: boolean }) {
  const t = useI18n(s => s.t);
  return (
    <div className="space-y-0.5 pt-6 mt-4 border-t border-border/60">
      <SectionLabel>More</SectionLabel>
      {SUPPORT_LINKS.map(link => (
        <SidebarItem
          key={link.href}
          href={link.href}
          isActive={pathname === link.href}
          onClick={setIsOpen}
          label={(t(link.key as any) as string) || link.label}
          icon={link.icon}
          compact
          isHoverable={isHoverable}
        />
      ))}
    </div>
  );
});

// ── Sidebar Content (shared between desktop and mobile) ───────────────────────

const SidebarContent = memo(function SidebarContent({
  pathname, recent, favorites, setIsOpen, isHoverable,
}: {
  pathname: string;
  recent: ToolEntry[];
  favorites: ToolEntry[];
  setIsOpen: () => void;
  isHoverable: boolean;
}) {
  const t = useI18n(s => s.t);

  const handleSearchClick = useCallback(() => {
    setIsOpen();
    useSearchStore.getState().setIsPaletteOpen(true);
  }, [setIsOpen]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* ── Search shortcut (always visible) ── */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button
          onClick={handleSearchClick}
          aria-label="Search tools (⌘K)"
          aria-haspopup="dialog"
          className={cn(
            "w-full h-10 flex items-center gap-2.5 px-3 rounded-xl",
            "bg-mat-base border border-border text-text-4 text-xs font-medium",
            "hover:border-blue/30 hover:bg-blue/5 hover:text-text-3 transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          )}
        >
          <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">{t("common.search").split("...")[0]}…</span>
          <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-surface border border-border rounded-md text-[10px] font-mono">
            <Command className="w-2.5 h-2.5" aria-hidden="true" />K
          </kbd>
        </button>
      </div>

      {/* ── Scrollable nav area ── */}
      <nav
        className="flex-1 overflow-y-auto px-2 pb-24 md:pb-6 space-y-5 no-scrollbar"
        aria-label="Main navigation"
        style={{ contain: "layout style" }}
      >
        {/* Home */}
        <div className="space-y-0.5 pt-1">
          <CoreLinks pathname={pathname} setIsOpen={setIsOpen} isHoverable={isHoverable} />
        </div>

        {/* Categories */}
        <CategoriesList pathname={pathname} setIsOpen={setIsOpen} isHoverable={isHoverable} />

        {/* Favorites */}
        <AnimatePresence initial={false}>
          {favorites.length > 0 && (
            <m.div
              key="favorites"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-0.5 overflow-hidden"
            >
              <SectionLabel icon={Heart}>{t("common.favorites")}</SectionLabel>
              {favorites.map(tool => (
                <SidebarItem
                  key={tool.id}
                  href={`/${tool.href}`}
                  isActive={pathname === `/${tool.href}` || pathname.startsWith(`/${tool.href}/`)}
                  onClick={setIsOpen}
                  label={tool.name}
                  toolId={tool.id}
                  category={tool.category}
                  compact
                  isHoverable={isHoverable}
                />
              ))}
            </m.div>
          )}
        </AnimatePresence>

        {/* Recently Used */}
        <AnimatePresence initial={false}>
          {recent.length > 0 && (
            <m.div
              key="recent"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-0.5 overflow-hidden"
            >
              <SectionLabel icon={Clock}>{t("common.recent")}</SectionLabel>
              {recent.map(tool => (
                <SidebarItem
                  key={tool.id}
                  href={`/${tool.href}`}
                  isActive={pathname === `/${tool.href}` || pathname.startsWith(`/${tool.href}/`)}
                  onClick={setIsOpen}
                  label={tool.name}
                  toolId={tool.id}
                  category={tool.category}
                  compact
                  isHoverable={isHoverable}
                />
              ))}
            </m.div>
          )}
        </AnimatePresence>

        {/* Support / utility links */}
        <SupportLinks pathname={pathname} setIsOpen={setIsOpen} isHoverable={isHoverable} />
      </nav>
    </div>
  );
});

// ── Sidebar Root ──────────────────────────────────────────────────────────────

export function Sidebar() {
  const { isFullscreen } = useFullscreenContext();
  const pathname          = usePathname() ?? "";
  const setIsSidebarOpen  = useSearchStore(s => s.setIsSidebarOpen);
  const desktopSidebarOpen = useSettingsStore(s => s.appearance.desktopSidebarOpen !== false);
  const toggleDesktopSidebar = useSettingsStore(s => s.toggleDesktopSidebar);
  const favoriteIds       = useFavoriteStore(useShallow(s => s.favorites));
  const [recent,   setRecent]   = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setHydrated(true);
    });
  }, []);
  useEffect(() => {
    if (hydrated) {
      Promise.resolve().then(() => {
        setRecent(getRecentTools().slice(0, 5));
      });
    }
  }, [pathname, hydrated]);

  const favorites = useMemo(() => {
    if (!hydrated || favoriteIds.length === 0) return [];
    const favSet = new Set(favoriteIds);
    return ALL_TOOLS.filter(t => favSet.has(t.id)).slice(0, 10);
  }, [favoriteIds, hydrated]);

  if (isFullscreen) return null;

  const sharedContent = (
    <SidebarContent
      pathname={pathname}
      recent={recent}
      favorites={favorites}
      setIsOpen={closeSidebar}
      isHoverable={false}
    />
  );

  const desktopContent = (
    <SidebarContent
      pathname={pathname}
      recent={recent}
      favorites={favorites}
      setIsOpen={closeSidebar}
      isHoverable={true}
    />
  );

  return (
    <>
      {/* ── Mobile drawer ── */}
      <MobileSidebar>
        {/* Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-border bg-surface">
          <Link
            href="/"
            onClick={closeSidebar}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-lg"
            aria-label="KaruviLab home"
          >
            <KVLogo withText size="sm" loading="lazy" />
          </Link>
          <button
            className={cn(
              "w-11 h-11 shrink-0 flex items-center justify-center rounded-xl mr-1",
              "text-text-4 hover:text-text hover:bg-mat-hover",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            )}
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {sharedContent}
      </MobileSidebar>

      {/* ── Desktop fixed sidebar ── */}
      {desktopSidebarOpen && (
        <aside
          id="desktop-sidebar"
          className={cn(
            "hidden md:flex fixed top-0 left-0 bottom-0 w-sidebar z-sidebar",
            "flex-col overflow-hidden",
            "bg-surface border-r border-border",
            "rounded-r-3xl",
          )}
          style={{ contain: "layout style" }}
          aria-label="Main sidebar navigation"
        >
          {/* Logo header */}
          <div className="h-18 shrink-0 flex items-center justify-between px-6 border-b border-border/60">
            <Link
              href="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue rounded-lg"
              aria-label="KaruviLab home"
            >
              <KVLogo withText size="md" loading="lazy" />
            </Link>
            <button
              className={cn(
                "w-9 h-9 shrink-0 flex items-center justify-center rounded-lg -mr-2",
                "text-text-4 hover:text-text hover:bg-mat-hover",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              )}
              onClick={toggleDesktopSidebar}
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {desktopContent}

        </aside>
      )}
    </>
  );
}
