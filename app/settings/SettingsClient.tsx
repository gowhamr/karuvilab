"use client";

import { useState, memo } from "react";
import dynamic from "next/dynamic";
import { 
  Sun, Shield, UserSearch, Star, 
  Settings2, RefreshCw,
  ChevronRight, ArrowLeft
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useIsHydrated } from "@/src/store/settings/store";
import Link from "next/link";

// --- Lazy Load Sections ---
const AppearanceSection = dynamic(() => import("./sections/AppearanceSection").then(m => m.AppearanceSection), { ssr: false });
const PrivacySection = dynamic(() => import("./sections/PrivacySection").then(m => m.PrivacySection), { ssr: false });
const AccessibilitySection = dynamic(() => import("./sections/AccessibilitySection").then(m => m.AccessibilitySection), { ssr: false });
const ToolPreferencesSection = dynamic(() => import("./sections/ToolPreferencesSection").then(m => m.ToolPreferencesSection), { ssr: false });
const FavoritesSection = dynamic(() => import("./sections/FavoritesSection").then(m => m.FavoritesSection), { ssr: false });

const MENU_ITEMS = [
  { id: 'appearance', label: 'Appearance', icon: Sun, desc: 'Themes, density, animations' },
  { id: 'accessibility', label: 'Accessibility', icon: UserSearch, desc: 'Font size, contrast' },
  { id: 'privacy', label: 'Data & Privacy', icon: Shield, desc: 'Storage, logic, history' },
  { id: 'favorites', label: 'Favorites', icon: Star, desc: 'Pinned tools, recent history' },
  { id: 'tools', label: 'Tool Preferences', icon: Settings2, desc: 'Formats, inputs, auto-copy' },
];

export default function SettingsClient() {
  const isHydrated = useIsHydrated();
  const [activeSection, setActiveSection] = useState('appearance');

  if (!isHydrated) {
    return (
      <div className="flex flex-col md:flex-row gap-12 animate-pulse">
        <div className="w-full md:w-72 space-y-4">
          <div className="h-8 w-32 bg-surface rounded-lg" />
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 w-full bg-surface rounded-2xl" />)}
          </div>
        </div>
        <div className="flex-1 space-y-8">
           <div className="h-[500px] w-full bg-surface rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-12 min-h-[700px]">
      
      {/* ── Sidebar Navigation ─────────────────────────────────────────── */}
      <aside className="w-full md:w-72 flex-shrink-0 space-y-8">
        <div className="space-y-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-4 hover:text-blue transition-colors px-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 px-4 mb-4">Settings</h2>
            <nav className="space-y-1">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full group flex items-center gap-3 p-3 rounded-2xl transition-all text-left relative
                    ${activeSection === item.id 
                      ? 'bg-blue text-white shadow-lg shadow-blue/20' 
                      : 'hover:bg-blue/5 text-text-2'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${activeSection === item.id ? 'bg-white/20' : 'bg-surface border border-border group-hover:bg-blue/10'}
                  `}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{item.label}</div>
                    <div className={`text-[10px] truncate font-medium ${activeSection === item.id ? 'text-white/60' : 'text-text-4'}`}>
                      {item.desc}
                    </div>
                  </div>
                  {activeSection === item.id && (
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue/5 to-transparent border border-blue/10 rounded-3xl space-y-4">
           <p className="text-[10px] font-black text-blue uppercase tracking-widest flex items-center gap-2">
             <RefreshCw className="w-3 h-3" />
             Local-First App
           </p>
           <p className="text-[10px] text-text-4 font-bold leading-relaxed">
             Settings are updated instantly and stored strictly on your device.
           </p>
        </div>
      </aside>

      {/* ── Active Section Content ────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 pb-24 md:pb-0">
        <AnimatePresence mode="wait">
          <m.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface border border-border/40 rounded-[40px] p-8 md:p-12 shadow-premium relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue/5 blur-3xl rounded-full pointer-events-none" />
            
            <header className="mb-12 space-y-3 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue/5 flex items-center justify-center text-blue mb-6">
                 {(() => {
                   const Icon = MENU_ITEMS.find(m => m.id === activeSection)?.icon || Settings2;
                   return <Icon className="w-7 h-7" />;
                 })()}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                {MENU_ITEMS.find(m => m.id === activeSection)?.label}
              </h1>
              <p className="text-lg text-text-3 font-medium max-w-xl">
                {MENU_ITEMS.find(m => m.id === activeSection)?.desc}. Changes are saved automatically.
              </p>
            </header>

            <div className="relative z-10">
              {activeSection === 'appearance' && <AppearanceSection />}
              {activeSection === 'privacy' && <PrivacySection />}
              {activeSection === 'accessibility' && <AccessibilitySection />}
              {activeSection === 'tools' && <ToolPreferencesSection />}
              {activeSection === 'favorites' && <FavoritesSection />}
            </div>
          </m.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
