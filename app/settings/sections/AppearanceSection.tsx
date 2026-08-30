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
    let resolved = theme;
    if (theme === "system") {
      try {
        resolved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
      } catch {
        const attr = document.documentElement.getAttribute("data-theme");
        resolved = (attr === "dark" || attr === "light") ? attr : "light";
      }
    }
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    try {
      document.cookie = `kv-theme=${encodeURIComponent(theme)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
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

