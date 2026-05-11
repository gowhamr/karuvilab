"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { Shield, HardDrive, LineChart, History, Trash2 } from "lucide-react";

export const PrivacySection = memo(function PrivacySection() {
  const { privacy, updatePrivacy, resetAll } = useSettingsStore();

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Local-First Processing" 
        description="All tool logic runs strictly in your browser. This setting cannot be disabled."
        icon={Shield}
      >
        <SettingSwitch checked={true} onChange={() => {}} disabled />
      </SettingRow>

      <SettingRow 
        label="Ephemeral Storage" 
        description="Automatically clear all tool history and temporary files when you close the tab."
        icon={HardDrive}
      >
        <SettingSwitch 
          checked={privacy.clearStorageOnExit}
          onChange={(clearStorageOnExit) => updatePrivacy({ clearStorageOnExit })}
        />
      </SettingRow>

      <SettingRow 
        label="Anonymous Telemetry" 
        description="Help us improve KaruviLab by sending non-identifiable usage data."
        icon={LineChart}
      >
        <SettingSwitch 
          checked={privacy.telemetryEnabled}
          onChange={(telemetryEnabled) => updatePrivacy({ telemetryEnabled })}
        />
      </SettingRow>

      <SettingRow 
        label="Action History" 
        description="Remember your last used tools and inputs for a faster workflow."
        icon={History}
      >
        <SettingSwitch 
          checked={privacy.historyEnabled}
          onChange={(historyEnabled) => updatePrivacy({ historyEnabled })}
        />
      </SettingRow>

      <div className="pt-8">
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
