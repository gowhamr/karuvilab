"use client";

import { memo, useCallback } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect, SettingSwitch } from "../components/SettingUI";
import { Sun, Zap } from "lucide-react";

export const AppearanceSection = memo(function AppearanceSection() {
  const appearance = useSettingsStore(state => state.appearance);
  const updateAppearance = useSettingsStore(state => state.updateAppearance);

  const handleThemeChange = useCallback((theme: any) => {
    updateAppearance({ theme });
    const resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    document.documentElement.setAttribute("data-theme", resolved);
  }, [updateAppearance]);

  const handleQuickActionsToggle = useCallback((val: boolean) => {
    updateAppearance({ showQuickActions: val });
  }, [updateAppearance]);

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
          ariaLabel="Theme Selection"
          onChange={handleThemeChange}
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' }
          ]}
        />
      </SettingRow>

      <SettingRow
        label="Smart Quick Actions"
        description="Show Paste & Detect and Upload File shortcuts on the dashboard. Off by default — enable only if you find them useful."
        icon={Zap}
        helpText="Paste & Detect reads your clipboard and routes you to the best matching tool. Upload File detects file type and jumps directly to the right tool. Requires clipboard permission on first use."
      >
        <SettingSwitch
          checked={appearance.showQuickActions ?? false}
          onChange={handleQuickActionsToggle}
          ariaLabel="Enable Smart Quick Actions on dashboard"
        />
      </SettingRow>
    </div>
  );
});

