"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSelect, SettingSwitch } from "../components/SettingUI";
import { Star, Clock, LayoutGrid } from "lucide-react";

export const FavoritesSection = memo(function FavoritesSection() {
  const favorites = useSettingsStore(state => state.favorites);
  const updateFavorites = useSettingsStore(state => state.updateFavorites);

  return (
    <div className="space-y-2">
      <SettingRow 
        label="Recent Tools History" 
        description="Show recently used tools in the home page and sidebar."
        icon={Clock}
      >
        <SettingSwitch 
          checked={favorites.recentTools.length > 0}
          onChange={(val) => !val && updateFavorites({ recentTools: [] })}
        />
      </SettingRow>

      <SettingRow 
        label="History Capacity" 
        description="The maximum number of recent tools to remember."
        icon={LayoutGrid}
      >
        <SettingSelect 
          value={favorites.maxRecentTools.toString()}
          onChange={(v) => updateFavorites({ maxRecentTools: parseInt(v) })}
          options={[
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '20', value: '20' }
          ]}
        />
      </SettingRow>

      <SettingRow 
        label="Pin to Home" 
        description="Automatically pin your most used tools to the top of the home page."
        icon={Star}
      >
        <SettingSwitch 
          checked={favorites.pinnedTools.length > 0}
          onChange={(val) => !val && updateFavorites({ pinnedTools: [] })}
        />
      </SettingRow>
    </div>
  );
});
