"use client";

import { useState, useMemo, memo, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Sun, Shield, 
  RefreshCw,
  ChevronRight, ArrowLeft,
  History as HistoryIcon, Search,
  HelpCircle
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useIsHydrated, useSettingsStore } from "@/src/store/settings/store";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { formatBytes } from "@/src/utils";

// --- Lazy Load Sections ---
const AppearanceSection = dynamic(() => import("./sections/AppearanceSection").then(m => m.AppearanceSection), { ssr: false });
const PrivacySection = dynamic(() => import("./sections/PrivacySection").then(m => m.PrivacySection), { ssr: false });
const HistorySection = dynamic(() => import("./sections/HistorySection").then(m => m.HistorySection), { ssr: false });
const HelpSection = dynamic(() => import("./sections/HelpSection").then(m => m.HelpSection), { ssr: false });

const MENU_ITEMS = [
  { id: 'appearance', label: 'Appearance', icon: Sun, desc: 'Themes & modes', group: 'Personalization' },
  { id: 'privacy', label: 'Data & Privacy', icon: Shield, desc: 'Storage, reset', group: 'Application' },
  { id: 'history', label: 'Calc History', icon: HistoryIcon, desc: 'Saved calculations', group: 'History' },
  { id: 'help', label: 'Support & FAQ', icon: HelpCircle, desc: 'Security, help', group: 'Support' },
];

export default function SettingsClient() {
  const isHydrated = useIsHydrated();
  const theme = useSettingsStore(s => s.appearance.theme);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [storageUsage, setStorageUsage] = useState<string>("...");

  // Storage estimation
  useEffect(() => {
    if (!isHydrated) return;
    
    async function estimateStorage() {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const { usage } = await navigator.storage.estimate();
          setStorageUsage(formatBytes(usage || 0));
        } catch (e) {
          setStorageUsage("Unknown");
        }
      } else {
        setStorageUsage("N/A");
      }
    }
    
    estimateStorage();
  }, [isHydrated, activeSection]);

  const indicators = useMemo(() => ({
    appearance: theme.charAt(0).toUpperCase() + theme.slice(1),
    privacy: storageUsage,
    history: "",
    help: "v2.1"
  }), [theme, storageUsage]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return MENU_ITEMS;
    const q = searchQuery.toLowerCase();
    return MENU_ITEMS.filter(item => 
      item.label.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof MENU_ITEMS> = {};
    filteredItems.forEach(item => {
      const groupName = item.group;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });
    return groups;
  }, [filteredItems]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
        <div className="w-full lg:w-80 space-y-4">
          <div className="h-8 w-32 bg-surface rounded-lg" />
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-14 w-full bg-surface rounded-2xl" />)}
          </div>
        </div>
        <div className="flex-1 space-y-8">
           <div className="h-full w-full bg-surface rounded-5xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-screen">
      
      {/* ── Sidebar Navigation ─────────────────────────────────────────── */}
      <aside className={cn("w-full lg:w-80 flex-shrink-0 space-y-8", activeSection ? "hidden lg:block" : "block")}>
        <div className="space-y-6">
          <div className="px-4 space-y-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 hover:text-blue transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-4 group-focus-within:text-blue transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-bg border border-border rounded-2xl text-xs font-bold text-text placeholder:text-text-4 focus:border-blue/40 outline-none transition-all"
              />
            </div>
          </div>
          
          <nav className="space-y-8 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar px-1" role="tablist">
            {Object.entries(groupedItems).map(([group, items]) => (
              <div key={group} className="space-y-2">
                <h2 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 px-4">{group}</h2>
                <div className="space-y-1">
                  {items.map((item) => {
                    const indicator = indicators[item.id as keyof typeof indicators];
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveSection(item.id)}
                        className={`
                          w-full group flex items-center gap-3 p-3 rounded-2xl transition-all text-left relative
                          ${isActive 
                            ? 'bg-blue text-white shadow-md shadow-blue/10' 
                            : 'hover:bg-blue/5 text-text-2'}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                          ${isActive ? 'bg-white/20' : 'bg-surface border border-border group-hover:bg-blue/10'}
                        `}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-tiny font-bold uppercase tracking-widest-sm leading-none">{item.label}</div>
                            {indicator && (
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                isActive ? "bg-white/20 text-white" : "bg-blue/5 text-blue/60 group-hover:text-blue/80"
                              )}>
                                {indicator}
                              </span>
                            )}
                          </div>
                          <div className={`text-[11px] truncate font-medium mt-1 ${isActive ? 'text-indigo-100' : 'text-text-4'}`}>
                            {item.desc}
                          </div>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 opacity-60" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="px-4 py-8 text-center space-y-2">
                <p className="text-xs font-black text-text-4 uppercase tracking-widest">No results found</p>
                <p className="text-xs text-text-4 opacity-60">Try searching for theme, cache, or privacy.</p>
              </div>
            )}
          </nav>
        </div>

        <div className="hidden lg:block p-6 bg-gradient-to-br from-blue/5 to-transparent border border-blue/10 rounded-3xl space-y-4">
           <p className="text-xs font-black text-blue uppercase tracking-widest flex items-center gap-2">
             <RefreshCw className="w-3 h-3" />
             Local-First App
           </p>
           <p className="text-xs text-text-4 font-bold leading-relaxed">
             Settings are updated instantly and stored strictly on your device.
           </p>
        </div>
      </aside>

      {/* ── Active Section Content ────────────────────────────────────────── */}
      <div className={cn("flex-1 min-w-0 lg:pb-0", activeSection ? "block" : "hidden lg:block")}>
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <div key="empty" className="hidden lg:flex flex-col items-center justify-center min-h-[500px] text-center space-y-4 text-text-4">
              <Shield className="w-12 h-12 opacity-20" />
              <p className="font-bold">Select a category to view settings</p>
            </div>
          ) : (
            <m.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface border border-border/40 rounded-4xl lg:rounded-6xl p-6 md:p-10 lg:p-16 shadow-premium relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue/5 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue/5 blur-3xl rounded-full pointer-events-none" />
              
              <header className="mb-6 lg:mb-16 space-y-4 relative z-10">
                <button 
                  onClick={() => setActiveSection(null)}
                  className="lg:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest-sm text-text-4 hover:text-text mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Settings Menu
                </button>
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-blue/5 items-center justify-center text-blue shadow-inner shadow-blue/10">
                     {(() => {
                       const Icon = MENU_ITEMS.find(m => m.id === activeSection)?.icon || Sun;
                       return <Icon className="w-6 h-6 lg:w-8 lg:h-8" />;
                     })()}
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight">
                      {MENU_ITEMS.find(m => m.id === activeSection)?.label}
                    </h1>
                    <p className="hidden lg:block text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 mt-1">
                      {MENU_ITEMS.find(m => m.id === activeSection)?.group}
                    </p>
                  </div>
                </div>
                <p className="hidden lg:block text-sm text-text-4 font-medium max-w-2xl leading-relaxed pt-2">
                  {MENU_ITEMS.find(m => m.id === activeSection)?.desc}. These preferences are synced across your local sessions automatically.
                </p>
              </header>
  
              <div className="relative z-10 min-h-96">
                {activeSection === 'appearance' && <AppearanceSection />}
                {activeSection === 'privacy' && <PrivacySection />}
                {activeSection === 'history' && <HistorySection />}
                {activeSection === 'help' && <HelpSection />}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
