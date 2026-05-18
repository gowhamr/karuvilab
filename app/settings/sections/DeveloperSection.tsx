"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { Terminal, Activity, FlaskConical, Flag } from "lucide-react";

export const DeveloperSection = memo(function DeveloperSection() {
  const developer = useSettingsStore(state => state.developer);
  const updateDeveloper = useSettingsStore(state => state.updateDeveloper);

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Debug Mode" 
        description="Enable verbose logging and internal tool state visibility."
        icon={Terminal}
        helpText="Logs all internal events to the browser console. Useful for troubleshooting errors."
      >
        <SettingSwitch 
          checked={developer.debugMode}
          onChange={(debugMode) => updateDeveloper({ debugMode })}
        />
      </SettingRow>

      <SettingRow 
        label="Render Diagnostics" 
        description="Show component re-render counts and performance metrics in the UI."
        icon={Activity}
        helpText="Overlays performance stats on every page. May slightly impact UI responsiveness."
      >
        <SettingSwitch 
          checked={developer.renderDiagnostics}
          onChange={(renderDiagnostics) => updateDeveloper({ renderDiagnostics })}
        />
      </SettingRow>

      <SettingRow 
        label="Experimental Features" 
        description="Try out new features before they are officially released. May be unstable."
        icon={FlaskConical}
        helpText="Enable this to test upcoming tools. Note that these may crash or lose data."
      >
        <SettingSwitch 
          checked={developer.experimentalFeatures}
          onChange={(experimentalFeatures) => updateDeveloper({ experimentalFeatures })}
        />
      </SettingRow>

      <div className="pt-8 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-4 flex items-center gap-2">
          <Flag className="w-3.5 h-3.5" />
          Internal Feature Flags
        </h3>
        <div className="bg-bg border border-border rounded-2xl divide-y divide-border/40 overflow-hidden">
          {Object.entries(developer.featureFlags).length === 0 ? (
            <div className="p-6 text-center text-text-4 text-xs font-medium italic">
              No active feature flags in this environment.
            </div>
          ) : (
            Object.entries(developer.featureFlags).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-4">
                <span className="text-xs font-mono font-bold text-text-2">{key}</span>
                <SettingSwitch 
                  checked={enabled}
                  onChange={(val) => updateDeveloper({ featureFlags: { ...developer.featureFlags, [key]: val } })}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
