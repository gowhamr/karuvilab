"use client";

import React from 'react';
import { useImageCompressStore } from '../store';
import { CompressionFormat } from '../types';
import { getSupportedFormats } from '../utils';
import { Lock, Unlock, Monitor, Zap, ShieldCheck } from 'lucide-react';
import { SliderField } from '@/components/ui/SliderField';

export const AdvancedSettings: React.FC<{ itemId?: string | undefined }> = ({ itemId }) => {
  const globalSettings = useImageCompressStore(state => state.globalSettings);
  const updateGlobalSettings = useImageCompressStore(state => state.updateGlobalSettings);
  const items = useImageCompressStore(state => state.items);
  const updateItemSettings = useImageCompressStore(state => state.updateItemSettings);
  const uiMode = useImageCompressStore(state => state.ui.mode);

  const [supportedFormats, setSupportedFormats] = React.useState<string[]>(['image/jpeg', 'image/png']);

  const settings = itemId 
    ? items.find(i => i.id === itemId)?.settings || globalSettings 
    : globalSettings;

  React.useEffect(() => {
    getSupportedFormats().then(setSupportedFormats);
  }, []);

  const update = React.useCallback((patch: Partial<typeof globalSettings>) => {
    if (itemId) {
      updateItemSettings(itemId, patch);
    } else {
      updateGlobalSettings(patch);
    }
  }, [itemId, updateItemSettings, updateGlobalSettings]);

  const presets = [
    { label: 'Balanced', quality: 80, lossless: false, icon: <Monitor size={14} /> },
    { label: 'Maximum', quality: 40, lossless: false, icon: <Zap size={14} /> },
    { label: 'Lossless', quality: 100, lossless: true, icon: <ShieldCheck size={14} /> },
  ];

  if (uiMode === 'simple' && !itemId) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => update({ quality: p.quality, lossless: p.lossless })}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-black uppercase transition-all ${
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

      <div className="p-6 bg-bg border border-border rounded-2xl space-y-6">
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
          <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Output Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as CompressionFormat[]).map((fmt) => (
              <button
                key={fmt}
                disabled={!supportedFormats.includes(fmt)}
                onClick={() => update({ format: fmt })}
                className={`py-2 px-1 rounded-xl border text-xs font-black uppercase transition-all disabled:opacity-30 ${
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

        {/* Lossless Toggle */}
        {settings.format === 'image/png' && (
          <div className="flex items-center justify-between p-4 bg-surface-2 border border-border rounded-xl">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-text">Lossless Compression</h4>
              <p className="text-tiny text-text-4 font-medium">Maximize quality, larger file size</p>
            </div>
            <button
              onClick={() => update({ lossless: !settings.lossless })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.lossless ? 'bg-blue' : 'bg-surface border border-border'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.lossless ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        )}

        {/* Strict Privacy Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-500">Strict Privacy Mode</h4>
            <p className="text-tiny text-text-4 font-medium pr-4">Clear original from memory instantly after compression. Disables comparison view.</p>
          </div>
          <button
            onClick={() => update({ strictPrivacyMode: !settings.strictPrivacyMode })}
            className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 ${settings.strictPrivacyMode ? 'bg-red-500' : 'bg-surface border border-border'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.strictPrivacyMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Resize Controls */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Dimensions</label>
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
                aria-label="Image Width"
                placeholder="Width"
                value={settings.resizeWidth || ''}
                onChange={(e) => update({ resizeWidth: e.target.value ? Number(e.target.value) : null })}
                className="w-full pl-3 pr-8 py-2 bg-surface border border-border rounded-xl text-xs focus:ring-1 focus:ring-blue outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-tiny font-bold text-text-4">W</span>
            </div>
            <div className="relative">
              <input
                type="number"
                aria-label="Image Height"
                placeholder="Height"
                value={settings.resizeHeight || ''}
                onChange={(e) => update({ resizeHeight: e.target.value ? Number(e.target.value) : null })}
                className="w-full pl-3 pr-8 py-2 bg-surface border border-border rounded-xl text-xs focus:ring-1 focus:ring-blue outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-tiny font-bold text-text-4">H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
