"use client";

import { memo } from "react";
import { useWorldClockStore } from "@/src/features/world-clock/store";
import { SettingRow, SettingSelect } from "../components/SettingUI";
import { Globe } from "lucide-react";

export const WorldClockSection = memo(function WorldClockSection() {
  const settings = useWorldClockStore(state => state.settings);
  const updateSettings = useWorldClockStore(state => state.updateSettings);

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Primary Display Label" 
        description="Choose what information takes the most prominent spot on your clock cards."
        icon={Globe}
        helpText="If you track multiple teams across different regions, setting this to Custom Label allows you to name them 'Dev Team 1', 'Client Office', etc."
      >
        <SettingSelect 
          value={settings.primaryLabel}
          onChange={(val) => updateSettings({ primaryLabel: val as 'city' | 'country' | 'custom' })}
          options={[
            { label: 'City (Default)', value: 'city' },
            { label: 'Country', value: 'country' },
            { label: 'Custom Label', value: 'custom' }
          ]}
        />
      </SettingRow>
    </div>
  );
});
