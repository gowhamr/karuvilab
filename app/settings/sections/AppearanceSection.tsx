"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect, SettingSwitch } from "../components/SettingUI";
import { Sun, Maximize, Zap, LayoutPanelTop } from "lucide-react";

export const AppearanceSection = memo(function AppearanceSection() {
  const { appearance, updateAppearance } = useSettingsStore();

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Theme Preference" 
        description="Choose how KaruviLab looks to you. System will follow your device settings."
        icon={Sun}
      >
        <SettingSelect 
          value={appearance.theme}
          onChange={(theme) => updateAppearance({ theme })}
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' }
          ]}
        />
      </SettingRow>

      <SettingRow 
        label="Density Mode" 
        description="Comfortable is standard, Compact shows more content at once."
        icon={Maximize}
      >
        <SettingSelect 
          value={appearance.density}
          onChange={(density) => updateAppearance({ density })}
          options={[
            { label: 'Comfortable', value: 'comfortable' },
            { label: 'Compact', value: 'compact' }
          ]}
        />
      </SettingRow>

      <SettingRow 
        label="Interface Animations" 
        description="Enable smooth transitions and micro-interactions throughout the app."
        icon={Zap}
      >
        <SettingSwitch 
          checked={appearance.animationsEnabled}
          onChange={(animationsEnabled) => updateAppearance({ animationsEnabled })}
        />
      </SettingRow>

      <SettingRow 
        label="Compact Sidebar" 
        description="Always keep the navigation sidebar in a collapsed state."
        icon={LayoutPanelTop}
      >
        <SettingSwitch 
          checked={appearance.compactMode}
          onChange={(compactMode) => updateAppearance({ compactMode })}
        />
      </SettingRow>
    </div>
  );
});
