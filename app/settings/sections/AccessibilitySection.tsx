"use client";

import { memo } from "react";
import { useSettingsStore } from "@/src/store/settings/store";
import { SettingRow, SettingSwitch, SettingSelect } from "../components/SettingUI";
import { Eye, Move, Type, Keyboard, Focus, Volume2 } from "lucide-react";

export const AccessibilitySection = memo(function AccessibilitySection() {
  const accessibility = useSettingsStore(state => state.accessibility);
  const updateAccessibility = useSettingsStore(state => state.updateAccessibility);

  return (
    <div className="space-y-6">
      {/* Reduced Motion Toggle */}
      <SettingRow
        label="Reduce Motion"
        description="Disable animations and transitions globally for a smoother, faster UI."
        icon={Move}
        helpText="Turning this on disables interactive scale animations, hover transitions, and screen transitions to conserve battery and reduce CPU usage."
      >
        <SettingSwitch
          checked={!!accessibility.reduceMotion}
          ariaLabel="Reduce Motion"
          onChange={(val) => updateAccessibility({ reduceMotion: val })}
        />
      </SettingRow>

      {/* Font Scaling Selection */}
      <SettingRow
        label="Text Scaling"
        description="Adjust font size of labels, descriptions, and interactive areas globally."
        icon={Type}
        helpText="Changes font scaling factor. Normal is 100%. Choose Small, Large, or Huge to customize readability."
      >
        <SettingSelect
          value={String(accessibility.fontScaling)}
          ariaLabel="Text Scaling"
          onChange={(val) => updateAccessibility({ fontScaling: parseFloat(val) })}
          options={[
            { label: "90%", value: "0.9" },
            { label: "100%", value: "1.0" },
            { label: "110%", value: "1.1" },
            { label: "120%", value: "1.2" },
          ]}
        />
      </SettingRow>

      {/* High Contrast Toggle */}
      <SettingRow
        label="High Contrast Borders"
        description="Add prominent borders and separation lines to all containers for better readability."
        icon={Eye}
        helpText="Increases border contrast across cards, menus, and sidebars, improving layout boundaries."
      >
        <SettingSwitch
          checked={!!accessibility.highContrast}
          ariaLabel="High Contrast Borders"
          onChange={(val) => updateAccessibility({ highContrast: val })}
        />
      </SettingRow>

      {/* Keyboard Shortcut Overlay Toggle */}
      <SettingRow
        label="Keyboard Shortcut Overlay"
        description="Show keyboard shortcut hints next to clickable elements."
        icon={Keyboard}
        helpText="Displays small badges with keyboard shortcuts to help you navigate without a mouse."
      >
        <SettingSwitch
          checked={!!accessibility.keyboardShortcutsOverlay}
          ariaLabel="Keyboard Shortcut Overlay"
          onChange={(val) => updateAccessibility({ keyboardShortcutsOverlay: val })}
        />
      </SettingRow>

      {/* Focus Mode Toggle */}
      <SettingRow
        label="Focus Mode"
        description="Simplify the interface by dimming secondary elements."
        icon={Focus}
        helpText="Dims non-essential UI elements like the sidebar and background patterns to help you concentrate."
      >
        <SettingSwitch
          checked={!!accessibility.focusMode}
          ariaLabel="Focus Mode"
          onChange={(val) => updateAccessibility({ focusMode: val })}
        />
      </SettingRow>

      {/* Read Aloud Toggle */}
      <SettingRow
        label="Read Aloud"
        description="Enable text-to-speech for results and important messages."
        icon={Volume2}
        helpText="Uses your device's built-in text-to-speech engine to read calculator results and alerts."
      >
        <SettingSwitch
          checked={!!accessibility.readAloud}
          ariaLabel="Read Aloud"
          onChange={(val) => updateAccessibility({ readAloud: val })}
        />
      </SettingRow>
    </div>
  );
});
