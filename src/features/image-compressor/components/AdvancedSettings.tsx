"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { CompressionFormat } from '../types';
import { getSupportedFormats } from '../utils';
import { Lock, Unlock, Monitor, Zap, ShieldCheck } from 'lucide-react';
import { SliderField } from '@/components/ui/SliderField';

export const AdvancedSettings: React.FC<{ itemId?: string | undefined }> = ({ itemId }) => {
  const { globalSettings, updateGlobalSettings, items, updateItemSettings, ui } = useImageCompressStore();
  const [supportedFormats, setSupportedFormats] = React.useState<string[]>(['image/jpeg', 'image/png']);

  const settings = itemId 
    ? items.find(i => i.id === itemId)?.settings || globalSettings 
    : globalSettings;

  React.useEffect(() => {
    getSupportedFormats().then(setSupportedFormats);
  }, []);

  const update = (patch: Partial<typeof globalSettings>) => {
    if (itemId) {
      updateItemSettings(itemId, patch);
    } else {
      updateGlobalSettings(patch);
    }
  };

  const presets = [
    { label: 'Balanced', quality: 80, lossless: false, icon: <Monitor size={14} /> },
    { label: 'Maximum', quality: 40, lossless: false, icon: <Zap size={14} /> },
    { label: 'Lossless', quality: 100, lossless: true, icon: <ShieldCheck size={14} /> },
  ];

  if (ui.mode === 'simple' && !itemId) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => update({ quality: p.quality, lossless: p.lossless })}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-black uppercase transition-all ${
              settings.quality === p.quality && settings.lossless === p.lossless
                ? 'bg-blue border-blue text-white shadow-lg shadow-blue/20'
                : 'bg-bg border-border text-text-4 hover:border-blue/30'
            }`}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-6 bg-bg border border-border rounded-[24px] space-y-6">
        {/* Quality */}
        <SliderField
          label="Compression Quality"
          id="quality-slider"
          min={1}
          max={100}
          value={settings.quality}
          onChange={(v) => update({ quality: v, lossless: false })}
          format={(v) => `${v}%`}
        />

        {/* Format Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Output Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as CompressionFormat[]).map((fmt) => (
              <button
                key={fmt}
                disabled={!supportedFormats.includes(fmt)}
                onClick={() => update({ format: fmt })}
                className={`py-2 px-1 rounded-xl border text-[10px] font-black uppercase transition-all disabled:opacity-30 ${
                  settings.format === fmt
                    ? 'bg-blue border-blue text-white shadow-lg shadow-blue/20'
                    : 'bg-bg border-border text-text-4 hover:border-blue/30'
                }`}
              >
                {fmt.split('/')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Resize Controls */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Dimensions</label>
            <button 
              onClick={() => update({ maintainAspectRatio: !settings.maintainAspectRatio })}
              className={`p-1 rounded-md transition-colors ${settings.maintainAspectRatio ? 'text-blue' : 'text-text-4'}`}
              title={settings.maintainAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
            >
              {settings.maintainAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                placeholder="Width"
                value={settings.resizeWidth || ''}
                onChange={(e) => update({ resizeWidth: e.target.value ? Number(e.target.value) : null })}
                className="w-full pl-3 pr-8 py-2 bg-surface border border-border rounded-xl text-xs focus:ring-1 focus:ring-blue outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-4">W</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Height"
                value={settings.resizeHeight || ''}
                onChange={(e) => update({ resizeHeight: e.target.value ? Number(e.target.value) : null })}
                className="w-full pl-3 pr-8 py-2 bg-surface border border-border rounded-xl text-xs focus:ring-1 focus:ring-blue outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-4">H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
