"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { Shield, HardDrive, LineChart, History, Trash2, Download, Upload, Check, RefreshCcw, Loader2, Terminal, Gauge } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { performFactoryReset, clearToolData } from "@/src/lib/factory-reset";

import { useToast } from "@/components/ui/Toast";
import { PrivacyFeatures } from "@/components/ui/PrivacyFeatures";
import { logger } from "@/src/lib/logger";
import dynamic from "next/dynamic";

export const PrivacySection = memo(function PrivacySection() {
  const resetAll = useSettingsStore(state => state.resetAll);
  const developerMode = useSettingsStore(state => state.privacy.developerMode);
  const updatePrivacy = useSettingsStore(state => state.updatePrivacy);
  const [isExporting, setIsExporting] = useState(false);
  const [isReseting, setIsReseting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();
  const exportTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel pending timeout on unmount to avoid React state-update-on-unmounted-component warning
  useEffect(() => {
    return () => {
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current);
    };
  }, []);

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
    // Firefox requires the anchor to be in the DOM to trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    revokeUrl(url);
    exportTimeoutRef.current = setTimeout(() => setIsExporting(false), 1000);
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
          logger.error("Clear Cache failed", { error: err });
          toast("Failed to clear some data.", "error");
        } finally {
          setIsClearing(false);
        }
      }
    });
  };

  return (
    <div className="space-y-12">
      {/* --- Essential Processing Notice --- */}
      <SettingRow 
        label="Local-First Processing" 
        description="All tool logic runs strictly in your browser. This setting cannot be disabled."
        icon={Shield}
        helpText="This is our core promise. We don't have a backend that sees your files or data. Everything happens in your browser's memory and workers."
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue/5 border border-blue/10 rounded-lg text-blue">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-tiny font-bold uppercase tracking-widest-sm">Always Active</span>
        </div>
      </SettingRow>

      {/* --- Performance Inspector HUD --- */}
      <SettingRow
        label="Performance Inspector"
        description="Display real-time performance metrics (Worker Spawn, Dynamic Import times, V8 Heap Memory, Execution Waterfall, and Educational Concepts). Zero behavioral tracking."
        icon={Gauge}
        helpText="Designed for engineers and learners. Displays real-time Web Worker initialization times, dynamic import latency, V8 memory consumption, and interactive architectural lessons."
      >
        <SettingSwitch
          checked={!!developerMode}
          onChange={(val) => updatePrivacy({ developerMode: val })}
        />
      </SettingRow>

      {/* --- Data Management Grid --- */}
      <section className="space-y-6 pt-10 border-t border-border/40">
        <h3 className="text-sm font-black text-text uppercase tracking-widest flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue" />
          Data Management
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportSettings}
            disabled={isExporting}
            className="flex items-center justify-center gap-3 p-6 bg-surface border border-border rounded-2xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue hover:text-blue hover:bg-blue/5 transition-all group"
          >
            {isExporting ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5 text-text-4 group-hover:text-blue" />}
            Export Settings (JSON)
          </button>
          
          <label className="flex items-center justify-center gap-3 p-6 bg-surface border border-border rounded-2xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue hover:text-blue hover:bg-blue/5 transition-all cursor-pointer group">
            <Upload className="w-5 h-5 text-text-4 group-hover:text-blue" />
            Import Settings
            <input type="file" accept=".json" className="hidden" onChange={importSettings} />
          </label>

          <button 
            onClick={handleClearCache}
            disabled={isClearing}
            className="sm:col-span-2 flex items-center justify-center gap-3 p-6 bg-surface border border-red-500/30 dark:border-red-500/20 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm text-red-600 dark:text-red-400 hover:border-red-500/60 hover:bg-red-500/5 transition-all disabled:opacity-50 group shadow-sm shadow-red-500/5"
          >
            {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5 text-red-500/70 group-hover:text-red-500" />}
            {isClearing ? 'Clearing Storage...' : 'Clear All Tool Data'}
          </button>
        </div>
        <p className="text-xs text-text-4 font-medium leading-relaxed max-w-xl">
          Use these controls to backup your settings or wipe the local storage used by tools. 
          KaruviLab never stores your data on a server, but clearing cache will reset local tool states.
        </p>
      </section>

      {/* --- Danger Zone --- */}
      <section className="pt-12 border-t border-border/40">
        <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300 font-medium leading-relaxed">
              Factory reset will permanently wipe all settings, favorites, history, and cached assets. 
              The application will revert to its initial state.
            </p>
          </div>

          <button
            onClick={() => {
              toast('DANGER: This will delete ALL your settings, favorites, and history. This cannot be undone.', 'error', {
                label: 'Reset',
                onClick: async () => {
                  setIsReseting(true);
                  try {
                    await performFactoryReset();
                  } catch (err) {
                    logger.error("Factory Reset failed", { error: err });
                    localStorage.clear();
                    resetAll();
                    window.location.reload();
                  }
                }
              });
            }}
            disabled={isReseting}
            className="w-full sm:w-auto px-8 py-4 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {isReseting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isReseting ? 'Resetting...' : 'Factory Reset App'}
          </button>
        </div>
      </section>
    </div>
  );
});
