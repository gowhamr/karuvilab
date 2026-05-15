import React from 'react';
import { useImageCompressStore, CompressionFormat, ImageSettings } from '@/src/store/useImageCompressStore';
import { getSupportedFormats } from '@/src/lib/image-compression-utils';
import { Lock, Unlock, Monitor, Image as ImageIcon, Zap, ShieldCheck } from 'lucide-react';
import { SliderField } from '@/components/ui/SliderField';

export const SettingsPanel: React.FC<{ isGlobal?: boolean; itemId?: string }> = ({ isGlobal = true, itemId }) => {
  const { globalSettings, updateGlobalSettings, items, updateItemSettings } = useImageCompressStore();
  const [supportedFormats, setSupportedFormats] = React.useState<string[]>(['image/jpeg', 'image/png']);

  const settings = isGlobal 
    ? globalSettings 
    : items.find(i => i.id === itemId)?.settings || globalSettings;

  React.useEffect(() => {
    getSupportedFormats().then(setSupportedFormats);
  }, []);

  const update = (patch: Partial<ImageSettings>) => {
    if (isGlobal) {
      updateGlobalSettings(patch);
    } else if (itemId) {
      updateItemSettings(itemId, patch);
    }
  };

  const presets = [
    { label: 'Balanced', quality: 80, lossless: false, icon: <Monitor size={14} /> },
    { label: 'Maximum', quality: 40, lossless: false, icon: <Zap size={14} /> },
    { label: 'Lossless', quality: 100, lossless: true, icon: <ShieldCheck size={14} /> },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-surface border border-border rounded-2xl">
      {/* Presets */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-text-4 mb-3 block">Presets</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => update({ quality: p.quality, lossless: p.lossless })}
              className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl border text-[10px] font-black uppercase transition-all ${
                settings.quality === p.quality && settings.lossless === p.lossless
                  ? 'bg-blue border-blue text-white shadow-lg shadow-blue/20'
                  : 'bg-bg border-border text-text-3 hover:border-blue/30'
              }`}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <SliderField
        label="Quality"
        id={isGlobal ? "global-quality" : `item-quality-${itemId}`}
        min={1}
        max={100}
        value={settings.quality}
        onChange={(v) => update({ quality: v, lossless: false })}
        format={(v) => `${v}%`}
      />

      {/* Format */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-text-4">Output Format</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as CompressionFormat[]).map((fmt) => (
            <button
              key={fmt}
              disabled={!supportedFormats.includes(fmt)}
              onClick={() => update({ format: fmt })}
              className={`py-2 px-1 rounded-xl border text-[10px] font-black uppercase transition-all disabled:opacity-30 ${
                settings.format === fmt
                  ? 'bg-blue border-blue text-white shadow-lg shadow-blue/20'
                  : 'bg-bg border-border text-text-3 hover:border-blue/30'
              }`}
            >
              {fmt.split('/')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Resize */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-text-4">Resize</label>
          <button 
            onClick={() => update({ maintainAspectRatio: !settings.maintainAspectRatio })}
            className="text-text-4 hover:text-blue transition-colors"
          >
            {settings.maintainAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="number"
              placeholder="Width"
              value={settings.resizeWidth || ''}
              onChange={(e) => update({ resizeWidth: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-xs focus:ring-1 focus:ring-blue outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-4">PX</span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Height"
              value={settings.resizeHeight || ''}
              onChange={(e) => update({ resizeHeight: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-xs focus:ring-1 focus:ring-blue outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-4">PX</span>
          </div>
        </div>
      </div>

      {/* Lossless Toggle */}
      {settings.format === 'image/png' && (
        <label className="flex items-center gap-3 p-3 bg-bg border border-border rounded-xl cursor-pointer hover:border-blue/30 transition-all">
          <input
            type="checkbox"
            checked={settings.lossless}
            onChange={(e) => update({ lossless: e.target.checked, quality: e.target.checked ? 100 : settings.quality })}
            className="w-4 h-4 rounded border-border text-blue focus:ring-blue"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest">Lossless PNG</span>
            <span className="text-[8px] font-bold text-text-4 uppercase">Maximum quality, larger file</span>
          </div>
        </label>
      )}
    </div>
  );
};
