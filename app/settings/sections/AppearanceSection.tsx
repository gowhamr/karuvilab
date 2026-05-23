"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect } from "../components/SettingUI";
import { Sun } from "lucide-react";

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
    </div>
  );
});
