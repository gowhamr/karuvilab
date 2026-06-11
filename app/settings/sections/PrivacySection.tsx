"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { Shield, HardDrive, LineChart, History, Trash2, Download, Upload, Check, RefreshCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { performFactoryReset, clearToolData } from "@/src/lib/factory-reset";

import { useToast } from "@/components/ui/Toast";

export const PrivacySection = memo(function PrivacySection() {
  const privacy = useSettingsStore(state => state.privacy);
  const updatePrivacy = useSettingsStore(state => state.updatePrivacy);
  const resetAll = useSettingsStore(state => state.resetAll);
  const [isExporting, setIsExporting] = useState(false);
  const [isReseting, setIsReseting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

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
        toast("Settings imported successfully! Reloading...", "success");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        toast("Failed to import settings. Invalid file format.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = async () => {
    toast("Are you sure? This will remove all tool-specific data.", "warn", {
      label: "Clear",
      onClick: async () => {
        setIsClearing(true);
        try {
          await clearToolData();
          toast("Cache cleared successfully.", "success");
        } catch (err) {
          console.error("Clear Cache failed:", err);
          toast("Failed to clear some data.", "error");
        } finally {
          setIsClearing(false);
        }
      }
    });
  };

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Local-First Processing" 
        description="All tool logic runs strictly in your browser. This setting cannot be disabled."
        icon={Shield}
        helpText="This is our core promise. We don't have a backend that sees your files or data. Everything happens in your browser's memory and workers."
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue/5 border border-blue/10 rounded-lg text-blue">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Always Active</span>
        </div>
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
          onClick={handleClearCache}
          disabled={isClearing}
          className="px-4 py-2 bg-surface border border-border rounded-xl text-[10px] font-black uppercase hover:border-blue hover:text-blue transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isClearing ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Clear Cache
        </button>
      </SettingRow>

      <div className="pt-12 border-t border-border/40 mt-8">
        <h4 className="text-xs font-black uppercase tracking-widest text-red-500/60 mb-4">Danger Zone</h4>
        <button
          onClick={() => {
            toast('DANGER: This will delete ALL your settings, favorites, and history. This cannot be undone.', 'error', {
              label: 'Reset',
              onClick: async () => {
                setIsReseting(true);
                try {
                  await performFactoryReset();
                } catch (err) {
                  console.error("Factory Reset failed:", err);
                  // Fallback attempt
                  localStorage.clear();
                  resetAll();
                  window.location.reload();
                }
              }
            });
          }}
          disabled={isReseting}
          className="w-full sm:w-auto px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isReseting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {isReseting ? 'Resetting...' : 'Factory Reset App'}
        </button>
      </div>
    </div>
  );
});
