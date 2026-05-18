"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect, SettingSwitch } from "../components/SettingUI";
import { FileCode, Edit3, Copy, Download } from "lucide-react";

export const ToolPreferencesSection = memo(function ToolPreferencesSection() {
  const tools = useSettingsStore(state => state.tools);
  const updateTools = useSettingsStore(state => state.updateTools);

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Default Output Format" 
        description="Pre-select your preferred format when exporting results."
        icon={FileCode}
      >
        <SettingSelect 
          value={tools.defaultOutputFormat}
          onChange={(defaultOutputFormat) => updateTools({ defaultOutputFormat })}
          options={[
            { label: 'JSON', value: 'json' },
            { label: 'Plain Text', value: 'text' },
            { label: 'CSV', value: 'csv' }
          ]}
        />
      </SettingRow>

      <SettingRow 
        label="Remember Inputs" 
        description="Automatically restore your previous inputs when returning to a tool."
        icon={Edit3}
      >
        <SettingSwitch 
          checked={tools.rememberInputs}
          onChange={(rememberInputs) => updateTools({ rememberInputs })}
        />
      </SettingRow>

      <SettingRow 
        label="Auto-Copy Results" 
        description="Automatically copy calculated results to your clipboard upon completion."
        icon={Copy}
      >
        <SettingSwitch 
          checked={tools.autoCopyResults}
          onChange={(autoCopyResults) => updateTools({ autoCopyResults })}
        />
      </SettingRow>

      <SettingRow 
        label="Auto-Download Files" 
        description="Directly download processed files without asking for confirmation."
        icon={Download}
      >
        <SettingSwitch 
          checked={tools.autoDownloadFiles}
          onChange={(autoDownloadFiles) => updateTools({ autoDownloadFiles })}
        />
      </SettingRow>
    </div>
  );
});
