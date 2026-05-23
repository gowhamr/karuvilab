"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { Shield, HardDrive, LineChart, History, Trash2, Download, Upload, Check, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";

export const PrivacySection = memo(function PrivacySection() {
  const privacy = useSettingsStore(state => state.privacy);
  const updatePrivacy = useSettingsStore(state => state.updatePrivacy);
  const resetAll = useSettingsStore(state => state.resetAll);
  const [isExporting, setIsExporting] = useState(false);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const exportSettings = () => {
    setIsExporting(true);
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        const val = localStorage.getItem(k);
        if (val) data[k] = val;
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `karuvilab-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    revokeUrl(url);
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

  const clearCache = () => {
    if (!confirm("Are you sure? This will remove your recently used tools, saved inputs, and all tool-specific data. Your theme and favorites will be preserved.")) return;
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        // Preserve critical settings
        if (!k.startsWith("karuvi-theme") && !k.startsWith("karuvi-font-size") && !k.startsWith("karuvi-settings") && !k.startsWith("karuvi-favorites")) {
          keysToRemove.push(k);
        }
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    alert("Cache cleared successfully.");
  };

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Local-First Processing" 
        description="All tool logic runs strictly in your browser. This setting cannot be disabled."
        icon={Shield}
        helpText="This is our core promise. We don't have a backend that sees your files or data. Everything happens in your browser's memory and workers."
      >
        <SettingSwitch checked={true} onChange={() => {}} disabled />
      </SettingRow>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        <button
          onClick={exportSettings}
          disabled={isExporting}
          className="flex items-center justify-center gap-3 p-4 bg-surface border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue hover:text-blue transition-all"
        >
          {isExporting ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          Export Settings (Store)
        </button>
        <label className="flex items-center justify-center gap-3 p-4 bg-surface border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-blue hover:text-blue transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          Import Settings
          <input type="file" accept=".json" className="hidden" onChange={importSettings} />
        </label>
      </div>

      <SettingRow 
        label="Clear Tool Data" 
        description="Wipe all locally stored tool inputs and processing history."
        icon={RefreshCcw}
        helpText="This will empty your local tool cache. Your theme preferences and favorites are kept safe."
      >
        <button 
          onClick={clearCache}
          className="px-4 py-2 bg-surface border border-border rounded-xl text-[10px] font-black uppercase hover:border-blue hover:text-blue transition-all"
        >
          Clear Cache
        </button>
      </SettingRow>

      <div className="pt-12 border-t border-border/40 mt-8">
        <h4 className="text-xs font-black uppercase tracking-widest text-red-500/60 mb-4">Danger Zone</h4>
        <button
          onClick={() => {
            if (confirm('DANGER: This will delete ALL your settings, favorites, and history. This cannot be undone.')) {
              localStorage.clear();
              resetAll();
              window.location.reload();
            }
          }}
          className="w-full sm:w-auto px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Factory Reset App
        </button>
      </div>
    </div>
  );
});
