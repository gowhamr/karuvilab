"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const APP_VERSION = "2.0.0";

type Theme = "light" | "dark" | "system";
type FontSize = "normal" | "large";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("system");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [cleared, setCleared] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ keys: 0, bytes: 0 });

  useEffect(() => {
    const storedTheme = localStorage.getItem("karuvi.theme") as Theme | null;
    const storedFont = localStorage.getItem("karuvi.fontSize") as FontSize | null;
    if (storedTheme) setTheme(storedTheme);
    if (storedFont) setFontSize(storedFont);
    calcStorage();
  }, []);

  const calcStorage = () => {
    let bytes = 0;
    let keys = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      bytes += k.length + (localStorage.getItem(k) || "").length;
      keys++;
    }
    setStorageInfo({ keys, bytes });
  };

  const applyTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("karuvi.theme", t);
    const resolved = t === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t;
    document.documentElement.setAttribute("data-theme", resolved);
  };

  const applyFontSize = (f: FontSize) => {
    setFontSize(f);
    localStorage.setItem("karuvi.fontSize", f);
    document.documentElement.setAttribute("data-font-size", f);
  };

  const clearData = () => {
    const keysToKeep: string[] = [];
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith("karuvi.theme") || k.startsWith("karuvi.fontSize")) {
        keysToKeep.push(k);
      } else {
        toRemove.push(k);
      }
    }
    toRemove.forEach(k => localStorage.removeItem(k));
    setCleared(true);
    calcStorage();
    setTimeout(() => setCleared(false), 3000);
  };

  const clearAll = () => {
    localStorage.clear();
    setCleared(true);
    calcStorage();
    setTheme("system");
    setFontSize("normal");
    setTimeout(() => setCleared(false), 3000);
  };

  const fmtBytes = (b: number) => b < 1024 ? b + " B" : (b / 1024).toFixed(1) + " KB";

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-sm text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">Settings</span>
        </nav>
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-text-3">Preferences are stored locally in your browser.</p>
      </div>

      {/* Theme */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Appearance</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          <div className="flex gap-3 flex-wrap">
            {(["light", "dark", "system"] as Theme[]).map(t => (
              <button
                key={t}
                onClick={() => applyTheme(t)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${theme === t ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
              >
                <span>{t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}</span>
                <span className="capitalize">{t === "system" ? "System default" : t}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-4">System follows your OS dark/light mode preference.</p>
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Text Size</h2>
        <div className="flex gap-3">
          {(["normal", "large"] as FontSize[]).map(f => (
            <button
              key={f}
              onClick={() => applyFontSize(f)}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-colors capitalize ${fontSize === f ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
            >
              {f === "normal" ? "A Normal" : "A Large"}
            </button>
          ))}
        </div>
      </div>

      {/* Local data */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Local Data</h2>
        <div className="bg-bg border border-border rounded-xl p-4 flex items-center justify-between text-sm">
          <span className="text-text-3">Stored data: <strong className="text-text">{storageInfo.keys} items · {fmtBytes(storageInfo.bytes)}</strong></span>
          <span className="text-xs text-text-4">localStorage only</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearData}
            className="px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold hover:border-red-400 hover:text-red-500 transition-colors"
          >
            Clear history & tool data
          </button>
          <button
            onClick={clearAll}
            className="px-5 py-2.5 bg-surface border border-red-300 dark:border-red-700 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear everything (including preferences)
          </button>
        </div>
        {cleared && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-sm text-green-700 dark:text-green-400">
            Storage cleared successfully.
          </div>
        )}
        <p className="text-xs text-text-4">KaruviLab stores only recently visited tools and your preferences. No personal data or file contents are ever saved.</p>
      </div>

      {/* App info */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
        <h2 className="text-lg font-bold">App Info</h2>
        <dl className="space-y-2">
          {[
            { label: "Version", value: APP_VERSION },
            { label: "Platform", value: "Next.js 15 App Router" },
            { label: "Processing", value: "100% client-side (no server uploads)" },
            { label: "License", value: "MIT" },
            { label: "Maintainer", value: "R Gowtham · Wanderseven" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <dt className="text-text-4 w-32 flex-shrink-0">{item.label}</dt>
              <dd className="font-medium text-text-2">{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-3 pt-2">
          <a href="mailto:wanderseven@proton.me" className="text-sm text-blue hover:underline">Contact support</a>
          <span className="text-text-4">·</span>
          <Link href="/privacy" className="text-sm text-blue hover:underline">Privacy Policy</Link>
          <span className="text-text-4">·</span>
          <Link href="/terms" className="text-sm text-blue hover:underline">Terms</Link>
        </div>
      </div>
    </div>
  );
}
