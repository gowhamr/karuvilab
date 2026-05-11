"use client";

import { useState, useEffect, memo, useMemo } from "react";
import Link from "next/link";
import { 
  Sun, Moon, Laptop, Type, Trash2, ShieldCheck, 
  Info, Download, Upload, RefreshCcw, Check, 
  HardDrive, Database, Globe, Zap, AlertCircle
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const APP_VERSION = "2.1.0";

type Theme = "light" | "dark" | "system";
type FontSize = "normal" | "large";

const SettingsClient = memo(function SettingsClient() {
  const [theme, setTheme] = useState<Theme>("system");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [cleared, setCleared] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ keys: 0, bytes: 0, details: [] as any[] });
  const [isExporting, setIsExporting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("karuvi-theme") as Theme | null;
    const storedFont = localStorage.getItem("karuvi-font-size") as FontSize | null;
    if (storedTheme) setTheme(storedTheme);
    if (storedFont) setFontSize(storedFont);
    calcStorage();
    
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const calcStorage = () => {
    let bytes = 0;
    let keys = 0;
    const details = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      const val = localStorage.getItem(k) || "";
      const size = k.length + val.length;
      bytes += size;
      keys++;
      
      if (k.startsWith("karuvi.favorites")) details.push({ label: "Favorites", size });
      else if (k.startsWith("karuvi.recent")) details.push({ label: "Recent Tools", size });
    }
    setStorageInfo({ keys, bytes, details });
  };

  const applyTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("karuvi-theme", t);
    const resolved = t === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t;
    document.documentElement.setAttribute("data-theme", resolved);
  };

  const applyFontSize = (f: FontSize) => {
    setFontSize(f);
    localStorage.setItem("karuvi-font-size", f);
    document.documentElement.setAttribute("data-font-size", f);
  };

  const clearData = () => {
    if (!confirm("Are you sure? This will remove your recently used tools and tool-specific history.")) return;
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (!k.startsWith("karuvi-theme") && !k.startsWith("karuvi-font-size")) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setCleared(true);
    calcStorage();
    setTimeout(() => setCleared(false), 3000);
  };

  const clearAll = () => {
    if (!confirm("DANGER: This will delete ALL data, including your themes, fonts, and favorites. Continue?")) return;
    localStorage.clear();
    setCleared(true);
    calcStorage();
    setTheme("system");
    setFontSize("normal");
    setTimeout(() => setCleared(false), 3000);
  };

  const exportSettings = () => {
    setIsExporting(true);
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      data[k] = localStorage.getItem(k)!;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `karuvilab-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setTimeout(() => setIsExporting(false), 1000);
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v as string));
        alert("Settings imported successfully! Reloading...");
        window.location.reload();
      } catch (err) {
        alert("Failed to import settings. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const fmtBytes = (b: number) => b < 1024 ? b + " B" : (b / 1024).toFixed(1) + " KB";

  const SettingSection = ({ title, icon: Icon, children, description }: any) => (
    <div className="bg-surface border border-border/40 rounded-[32px] overflow-hidden transition-all hover:border-blue/20">
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center text-blue">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-text">{title}</h2>
            {description && <p className="text-xs text-text-4 font-bold uppercase tracking-wider">{description}</p>}
          </div>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
      {/* Header */}
      <header className="space-y-4 pt-12">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">Settings</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Preferences</h1>
        <p className="text-lg text-text-3 max-w-2xl leading-relaxed font-medium">
          Customize your local workspace. All data stays strictly in your browser.
        </p>
      </header>

      <div className="grid gap-6">
        {/* Appearance */}
        <SettingSection title="Appearance" icon={Sun} description="UI look and feel">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "light", icon: Sun, label: "Light" },
                { id: "dark", icon: Moon, label: "Dark" },
                { id: "system", icon: Laptop, label: "System" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTheme(t.id as Theme)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${
                    theme === t.id 
                      ? "border-blue bg-blue/5 text-blue" 
                      : "border-border/40 hover:border-blue/20 bg-bg/50 text-text-4"
                  }`}
                >
                  <t.icon className={`w-6 h-6 ${theme === t.id ? "text-blue" : ""}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                  {theme === t.id && (
                    <m.div layoutId="active-theme" className="absolute top-2 right-2">
                       <div className="w-2 h-2 bg-blue rounded-full shadow-lg shadow-blue/50" />
                    </m.div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-text-4">
                <Type className="w-4 h-4" />
                Text Size
              </label>
              <div className="flex gap-3">
                {(["normal", "large"] as FontSize[]).map(f => (
                  <button
                    key={f}
                    onClick={() => applyFontSize(f)}
                    className={`flex-1 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                      fontSize === f 
                        ? "bg-blue text-white shadow-lg shadow-blue/20" 
                        : "bg-surface border border-border text-text-3 hover:border-blue/20"
                    }`}
                  >
                    {f === "normal" ? "Standard" : "Accessible (Large)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Local Data Management */}
        <SettingSection title="Data & Privacy" icon={Database} description="Browser storage">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-bg/50 border border-border/40 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue/5 rounded-xl text-blue">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">Storage Usage</p>
                  <p className="text-xs text-text-4 font-bold">{storageInfo.keys} items stored locally</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-blue">{fmtBytes(storageInfo.bytes)}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-4">Used</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={exportSettings}
                disabled={isExporting}
                className="flex items-center justify-center gap-3 p-4 bg-surface border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue hover:text-blue transition-all"
              >
                {isExporting ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                Export Settings
              </button>
              <label className="flex items-center justify-center gap-3 p-4 bg-surface border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue hover:text-blue transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Settings
                <input type="file" accept=".json" className="hidden" onChange={importSettings} />
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={clearData}
                className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl group hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-4 h-4 text-text-4 group-hover:text-orange-500 transition-colors" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Clear History & Cache</span>
                </div>
                <div className="px-2 py-1 bg-bg rounded-lg text-[9px] font-black text-text-4">Recommended</div>
              </button>
              <button
                onClick={clearAll}
                className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl group hover:border-red-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-text-4 group-hover:text-red-500 transition-colors" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-500/80 group-hover:text-red-500">Factory Reset</span>
                </div>
                <AlertCircle className="w-4 h-4 text-red-500/40" />
              </button>
            </div>

            <div className="p-4 bg-blue/5 border border-blue/10 rounded-2xl flex gap-4">
               <ShieldCheck className="w-5 h-5 text-blue flex-shrink-0" />
               <p className="text-xs text-text-3 leading-relaxed font-medium">
                 KaruviLab follows a <strong>Privacy-First</strong> philosophy. No telemetry is gathered, and no data ever leaves your device. Everything is processed and stored locally.
               </p>
            </div>
          </div>
        </SettingSection>

        {/* System Info */}
        <SettingSection title="System" icon={Globe} description="App status">
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-bg/50 border border-border/40 rounded-2xl">
               <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} shadow-lg`} />
                 <span className="text-[11px] font-black uppercase tracking-widest">Connection Status</span>
               </div>
               <span className={`text-[11px] font-black uppercase tracking-widest ${isOnline ? "text-green-500" : "text-red-500"}`}>
                 {isOnline ? "Online" : "Offline Mode"}
               </span>
             </div>

             <div className="p-6 bg-surface border border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-text-4">App Version</span>
                  <span className="px-2 py-1 bg-bg rounded text-[10px] font-mono font-bold">{APP_VERSION}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-text-4">Platform</span>
                  <span className="text-[11px] font-bold">Next.js 16 (Enterprise)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-text-4">Open Source</span>
                  <span className="text-[11px] font-bold italic">MIT License</span>
                </div>
             </div>

             <div className="flex flex-wrap gap-4 pt-2">
               <a href="mailto:wanderseven@proton.me" className="text-[10px] font-black uppercase tracking-widest text-blue hover:underline">Report a Bug</a>
               <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue underline underline-offset-4">Privacy Policy</Link>
               <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue underline underline-offset-4">Terms of Service</Link>
             </div>
          </div>
        </SettingSection>
      </div>

      <AnimatePresence>
        {cleared && (
          <m.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl z-50 flex items-center gap-3"
          >
            <Check className="w-4 h-4" />
            Storage Cleared Successfully
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SettingsClient;
