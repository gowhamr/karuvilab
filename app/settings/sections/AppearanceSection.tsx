"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect } from "../components/SettingUI";
import { Sun, Maximize } from "lucide-react";

export const AppearanceSection = memo(function AppearanceSection() {
  const appearance = useSettingsStore(state => state.appearance);
  const updateAppearance = useSettingsStore(state => state.updateAppearance);

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Theme Preference" 
        description="Choose how KaruviLab looks to you. System will follow your device settings."
        icon={Sun}
        helpText="Dark mode is optimized for low-light environments and reduces eye strain. Light mode provides high contrast for daytime use."
      >
        <SettingSelect 
          value={appearance.theme}
          onChange={(theme) => {
            updateAppearance({ theme });
            const resolved = theme === "system"
              ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
              : theme;
            document.documentElement.setAttribute("data-theme", resolved);
          }}
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
        helpText="Compact mode reduces whitespace between elements, ideal for power users and small screens."
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
    </div>
  );
});
