"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect, SettingSwitch } from "../components/SettingUI";
import { Globe, Languages, Target } from "lucide-react";

export const LanguageSection = memo(function LanguageSection() {
  const { language, updateLanguage } = useSettingsStore();

  return (
    <div className="space-y-2">
      <SettingRow 
        label="App Language" 
        description="Choose your preferred language for the interface. More languages coming soon."
        icon={Languages}
      >
        <SettingSelect 
          value={language.locale}
          onChange={(locale) => updateLanguage({ locale })}
          options={[
            { label: 'English', value: 'en' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Tamil', value: 'ta' }
          ]}
        />
      </SettingRow>

      <SettingRow 
        label="RTL Support" 
        description="Optimize the interface for Right-to-Left languages like Arabic or Hebrew."
        icon={Globe}
      >
        <SettingSwitch 
          checked={language.rtl}
          onChange={(rtl) => updateLanguage({ rtl })}
        />
      </SettingRow>

      <SettingRow 
        label="Auto-Detect" 
        description="Automatically switch language based on your browser's primary locale."
        icon={Target}
      >
        <SettingSwitch 
          checked={language.autoDetect}
          onChange={(autoDetect) => updateLanguage({ autoDetect })}
        />
      </SettingRow>
    </div>
  );
});
