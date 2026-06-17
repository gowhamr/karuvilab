"use client";

import { memo, useState } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow } from "../components/SettingUI";
import { HardDrive, Download, Upload, Check, RefreshCcw, Loader2, Trash2 } from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { performFactoryReset, clearToolData } from "@/src/lib/factory-reset";
import { useToast } from "@/components/ui/Toast";

export const DataSection = memo(function DataSection() {
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
    <div className="space-y-6">
      <SettingRow 
        label="Data Export & Portability" 
        description="Download your entire local configuration as a JSON file. This includes your theme preferences, custom settings, and favorites."
        icon={HardDrive}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportSettings}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-surface border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue hover:text-blue transition-all"
           aria-label="Export JSON">
            {isExporting ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            Export JSON
          </button>
          <label className="flex items-center justify-center gap-2 px-6 py-2.5 bg-surface border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue hover:text-blue transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import
            <input type="file" accept=".json" className="hidden" onChange={importSettings} />
          </label>
        </div>
      </SettingRow>

      <SettingRow 
        label="Clear Tool Data" 
        description="Wipe all locally stored tool inputs, temporary buffers, and processing history. Your primary settings are preserved."
        icon={RefreshCcw}
        helpText="This will empty your local tool cache (IndexedDB and LocalStorage prefixes). Useful if a tool feels laggy or if you want to clear sensitive calculations."
      >
        <button 
          onClick={handleClearCache}
          disabled={isClearing}
          className="px-6 py-2.5 bg-surface border border-border rounded-xl text-xs font-black uppercase hover:border-blue hover:text-blue transition-all disabled:opacity-50 flex items-center gap-2"
         aria-label="Wipe Cache">
          {isClearing ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Wipe Cache
        </button>
      </SettingRow>

      <div className="pt-12 border-t border-border/40 mt-8">
        <h4 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-error/60 mb-6">System Recovery</h4>
        <div className="p-6 bg-error/[0.03] border border-error/10 rounded-3xl space-y-4">
          <p className="text-sm text-text-3 font-medium leading-relaxed">
            Factory resetting will permanently delete <span className="text-error font-bold">ALL</span> data including favorites, history, custom themes, and cached assets. This action is irreversible.
          </p>
          <button
            onClick={() => {
              toast('DANGER: This will delete ALL your settings, favorites, and history.', 'error', {
                label: 'Reset',
                onClick: async () => {
                  setIsReseting(true);
                  try {
                    await performFactoryReset();
                  } catch (err) {
                    localStorage.clear();
                    resetAll();
                    window.location.reload();
                  }
                }
              });
            }}
            aria-label="Perform Factory Reset"
            disabled={isReseting}
            className="w-full sm:w-auto px-8 py-3 bg-error/10 text-error rounded-xl font-black text-xs uppercase tracking-widest hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isReseting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isReseting ? 'Resetting System...' : 'Perform Factory Reset'}
          </button>
        </div>
      </div>
    </div>
  );
});
