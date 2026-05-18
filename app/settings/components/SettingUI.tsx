"use client";

import { memo, useState } from "react";
import { Check, Info, HelpCircle } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  helpText?: string;
}

export const SettingRow = memo(function SettingRow({ label, description, children, icon: Icon, helpText }: SettingRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 border-b border-border/40 last:border-0 group/row">
      <div className="flex gap-5">
        {Icon && (
          <div className="w-12 h-12 rounded-[18px] bg-blue/5 flex items-center justify-center text-blue flex-shrink-0 group-hover/row:bg-blue/10 transition-colors shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text">{label}</h3>
            {helpText && <SettingHelp text={helpText} />}
          </div>
          {description && <p className="text-sm text-text-4 font-medium leading-relaxed max-w-lg">{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0 pl-17 sm:pl-0">
        {children}
      </div>
    </div>
  );
});

export const SettingHelp = memo(function SettingHelp({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-text-4 hover:text-blue transition-colors outline-none"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-surface border border-border rounded-2xl shadow-premium text-[11px] font-medium text-text-3 leading-relaxed pointer-events-none"
          >
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-surface" />
            {text}
          </m.div>
        )}
      </AnimatePresence>
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
        relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue/20
        ${checked ? 'bg-blue' : 'bg-bg border border-border'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-lg
          ${checked ? 'translate-x-6' : 'translate-x-1'}
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
    <div className="flex p-1.5 bg-bg border border-border rounded-2xl shadow-inner">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative
            ${value === opt.value 
              ? 'text-text' 
              : 'text-text-4 hover:text-text'}
          `}
        >
          {value === opt.value && (
            <m.div 
              layoutId="active-setting"
              className="absolute inset-0 bg-surface border border-border/40 rounded-xl shadow-sm -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
});
