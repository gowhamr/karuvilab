"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch } from "../components/SettingUI";
import { Zap, Boxes, Database, Cpu } from "lucide-react";

export const PerformanceSection = memo(function PerformanceSection() {
  const { performance, updatePerformance } = useSettingsStore();

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Reduced Motion" 
        description="Minimize animations and transitions for a faster feel and better battery life."
        icon={Zap}
      >
        <SettingSwitch 
          checked={performance.reducedMotion}
          onChange={(reducedMotion) => updatePerformance({ reducedMotion })}
        />
      </SettingRow>

      <SettingRow 
        label="Lazy Rendering" 
        description="Only render off-screen components when they enter the viewport."
        icon={Boxes}
      >
        <SettingSwitch 
          checked={performance.lazyRendering}
          onChange={(lazyRendering) => updatePerformance({ lazyRendering })}
        />
      </SettingRow>

      <SettingRow 
        label="Persistent Cache" 
        description="Store calculated results and tool states locally to avoid re-computation."
        icon={Database}
      >
        <SettingSwitch 
          checked={performance.cachePreferences}
          onChange={(cachePreferences) => updatePerformance({ cachePreferences })}
        />
      </SettingRow>

      <SettingRow 
        label="Low Bandwidth Mode" 
        description="Disable non-essential assets and scripts to save data."
        icon={Cpu}
      >
        <SettingSwitch 
          checked={performance.lowBandwidthMode}
          onChange={(lowBandwidthMode) => updatePerformance({ lowBandwidthMode })}
        />
      </SettingRow>
    </div>
  );
});
