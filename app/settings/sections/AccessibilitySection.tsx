"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect, SettingSwitch } from "../components/SettingUI";
import { Type, Eye } from "lucide-react";

export const AccessibilitySection = memo(function AccessibilitySection() {
  const accessibility = useSettingsStore(state => state.accessibility);
  const updateAccessibility = useSettingsStore(state => state.updateAccessibility);

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Font Scaling" 
        description="Adjust the base font size for better readability."
        icon={Type}
        helpText="Increases or decreases the size of all text throughout the application. 100% is the default."
      >
        <SettingSelect 
          value={accessibility.fontScaling.toString()}
          onChange={(v) => updateAccessibility({ fontScaling: parseFloat(v) })}
          options={[
            { label: '90%', value: '0.9' },
            { label: '100%', value: '1.0' },
            { label: '110%', value: '1.1' },
            { label: '120%', value: '1.2' }
          ]}
        />
      </SettingRow>

      <SettingRow 
        label="High Contrast" 
        description="Enhance visibility by using higher contrast colors and borders."
        icon={Eye}
        helpText="Makes text and icons stand out more against the background, improving visibility for users with low vision."
      >
        <SettingSwitch 
          checked={accessibility.highContrast}
          onChange={(highContrast) => updateAccessibility({ highContrast })}
        />
      </SettingRow>
    </div>
  );
});
