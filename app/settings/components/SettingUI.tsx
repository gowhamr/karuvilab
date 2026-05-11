"use client";

import { memo } from "react";
import { Check } from "lucide-react";

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}

export const SettingRow = memo(function SettingRow({ label, description, children, icon: Icon }: SettingRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-border/40 last:border-0">
      <div className="flex gap-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-blue/5 flex items-center justify-center text-blue flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-text">{label}</h3>
          {description && <p className="text-xs text-text-4 font-medium leading-relaxed max-w-md">{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
});

interface SettingSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export const SettingSwitch = memo(function SettingSwitch({ checked, onChange, disabled }: SettingSwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2
        ${checked ? 'bg-blue' : 'bg-bg border border-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
          ${!checked ? 'shadow-sm' : ''}
        `}
      />
    </button>
  );
});

interface SettingSelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: any) => void;
}

export const SettingSelect = memo(function SettingSelect({ options, value, onChange }: SettingSelectProps) {
  return (
    <div className="flex gap-2 p-1 bg-bg border border-border rounded-xl">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
            ${value === opt.value 
              ? 'bg-white dark:bg-white/10 text-text shadow-sm' 
              : 'text-text-4 hover:text-text'}
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
});
