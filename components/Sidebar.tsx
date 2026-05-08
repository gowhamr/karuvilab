"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, getRecentTools, ToolEntry, ALL_TOOLS } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useState, useEffect } from "react";
import { Home, Info, HelpCircle, Settings, Shield, X, Clock, Search, Command, LayoutGrid, Zap, Layout } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { motion, AnimatePresence } from "framer-motion";

const SUPPORT_LINKS = [
  { href: "/about/", label: "About", icon: Info },
  { href: "/help/", label: "Help", icon: HelpCircle },
  { href: "/settings/", label: "Settings", icon: Settings },
  { href: "/privacy/", label: "Privacy", icon: Shield },
  { href: "/disclaimer/", label: "Disclaimer", icon: Shield },
];

function SidebarContent({ pathname, recent, setIsOpen }: { pathname: string, recent: ToolEntry[], setIsOpen: (o: boolean) => void }) {
  return (
    <nav className="flex-1 overflow-y-auto p-3 space-y-6 no-scrollbar">
      {/* Core Links */}
      <div className="space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 h-[48px] px-4 rounded-xl transition-all font-bold text-xs ${pathname === "/" ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-text-2 dark:text-white/60 hover:bg-blue/5 hover:text-blue dark:hover:bg-white/5 dark:hover:text-white"}`}
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <button 
          onClick={() => {
            setIsOpen(false);
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
          }}
          className="w-full h-[48px] flex items-center justify-between px-4 bg-surface dark:bg-white/5 border border-border dark:border-white/5 rounded-xl text-[10px] font-bold text-text-4 dark:text-white/40 hover:bg-blue/5 dark:hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4" />
            <span>Quick Search</span>
          </div>
          <div className="flex items-center gap-0.5 px-1 py-0.5 bg-bg dark:bg-black/40 border border-border dark:border-white/10 rounded text-[8px] font-mono">
            <Command className="w-2 h-2" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Recently Used */}
      {recent.length > 0 && (
        <div className="space-y-2">
          <div className="px-4 flex items-center gap-2 text-[9px] font-black text-text-4 dark:text-white/30 uppercase tracking-[0.2em]">
            <Clock className="w-3 h-3" />
            Recent
          </div>
          <div className="space-y-0.5">
            {recent.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.href}`}
                className={`flex items-center h-[48px] px-4 text-[11px] rounded-lg transition-all font-medium ${pathname.includes(tool.href) ? "bg-blue/10 text-blue font-bold" : "text-text-3 dark:text-white/60 hover:text-blue dark:hover:text-white"}`}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <div className="px-4 flex items-center gap-2 text-[9px] font-black text-text-4 dark:text-white/30 uppercase tracking-[0.2em]">
          <LayoutGrid className="w-3 h-3" />
          Categories
        </div>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`);
            return (
              <Link
                key={cat.id}
                href={`/${cat.href}`}
                className={`flex items-center gap-3 h-[48px] px-4 rounded-xl transition-all font-bold text-[11px] ${
                  isActive
                    ? "bg-blue/10 text-blue"
                    : "text-text-3 dark:text-white/60 hover:bg-blue/5 hover:text-blue dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? "bg-blue text-white shadow-sm shadow-blue/20" : "bg-surface dark:bg-white/5 border border-border dark:border-white/5"
                }`}>
                  <ToolIcon category={cat.id} className="w-4 h-4" />
                </div>
                <span className="flex-1">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div className="pt-4 border-t border-border dark:border-white/5 space-y-1">
        {SUPPORT_LINKS.map(link => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 h-[48px] px-4 text-[11px] rounded-xl transition-all font-bold ${
                pathname === link.href ? "text-blue bg-blue/5" : "text-text-4 dark:text-white/40 hover:text-blue dark:hover:text-white hover:bg-blue/5 dark:hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
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
  const [recent, setRecent] = useState<ToolEntry[]>([]);

  useEffect(() => {
    setIsOpen(false);
    setRecent(getRecentTools().slice(0, 8));
  }, [pathname, setIsOpen]);

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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[82vw] max-w-[360px] rounded-r-[24px] glass-dark z-[70] flex flex-col border-r border-white/10 md:hidden overflow-hidden"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-white">
                  <div className="w-6 h-6 rounded bg-blue flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>Karuvi<span className="text-blue">Lab</span></span>
                </Link>
                <button
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent pathname={pathname} recent={recent} setIsOpen={setIsOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[280px] rounded-r-[24px] bg-surface border-r border-border z-30 flex-col overflow-hidden">
        <div className="h-16 flex items-center px-6 border-b border-border bg-bg/50">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center text-white shadow-lg shadow-blue/20">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span>Karuvi<span className="text-blue">Lab</span></span>
          </Link>
        </div>
        <SidebarContent pathname={pathname} recent={recent} setIsOpen={setIsOpen} />
        <div className="p-4 border-t border-border bg-bg/30">
           <div className="p-4 rounded-2xl bg-gradient-to-br from-blue/5 to-transparent border border-blue/10 space-y-2">
              <p className="text-[10px] font-black text-blue uppercase tracking-widest">Enterprise Ready</p>
              <p className="text-[9px] text-text-4 font-medium leading-relaxed">Secure, local-first tools for high-performance workflows.</p>
           </div>
        </div>
      </aside>
    </>
  );
}
