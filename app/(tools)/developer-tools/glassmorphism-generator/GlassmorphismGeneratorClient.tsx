'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Copy } from 'lucide-react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

interface GlassConfig {
  blur: number;
  transparency: number;
  borderOpacity: number;
  borderWidth: number;
  borderRadius: number;
  shadowIntensity: number;
  tintColor: string;
  textColor: string;
  bgColors: string[];
}

const PRESETS = [
  { name: 'Light Glass', config: { blur: 16, transparency: 70, borderOpacity: 20, borderWidth: 1, borderRadius: 24, shadowIntensity: 10, tintColor: '#ffffff', textColor: '#0f172a', bgColors: ['#a18cd1', '#fbc2eb'] } },
  { name: 'Dark Frosted', config: { blur: 24, transparency: 80, borderOpacity: 10, borderWidth: 1, borderRadius: 32, shadowIntensity: 25, tintColor: '#0f172a', textColor: '#ffffff', bgColors: ['#0f2027', '#203a43', '#2c5364'] } },
  { name: 'Colored Tint', config: { blur: 12, transparency: 60, borderOpacity: 30, borderWidth: 2, borderRadius: 16, shadowIntensity: 5, tintColor: '#3b82f6', textColor: '#ffffff', bgColors: ['#11998e', '#38ef7d'] } },
];

function hexToRgba(hex: string, opacity: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export default function GlassmorphismGeneratorClient() {
  const [config, setConfig] = useState<GlassConfig>(PRESETS[0]!.config);
  const [outputTab, setOutputTab] = useState<'css' | 'tailwind'>('css');

  const cssValue = useMemo(() => {
    return `background: ${hexToRgba(config.tintColor, 100 - config.transparency)};
backdrop-filter: blur(${config.blur}px);
-webkit-backdrop-filter: blur(${config.blur}px);
border: ${config.borderWidth}px solid ${hexToRgba(config.tintColor === '#ffffff' ? '#ffffff' : '#000000', config.borderOpacity)};
border-radius: ${config.borderRadius}px;
box-shadow: 0 4px 30px ${hexToRgba('#000000', config.shadowIntensity)};`;
  }, [config]);

  const tailwindValue = useMemo(() => {
    // Tailwind approximations
    const opacityMap: Record<number, string> = { 10: '10', 20: '20', 30: '30', 40: '40', 50: '50', 60: '60', 70: '70', 80: '80', 90: '90' };
    const op = opacityMap[Math.round((100 - config.transparency) / 10) * 10] || '10';
    const blurMap: Record<number, string> = { 0: 'none', 4: 'sm', 8: 'md', 12: 'md', 16: 'lg', 24: 'xl', 40: '2xl' };
    const closestBlur = Object.keys(blurMap).reduce((prev, curr) => Math.abs(Number(curr) - config.blur) < Math.abs(Number(prev) - config.blur) ? curr : prev);
    const bl = blurMap[Number(closestBlur)] || 'md';

    return `bg-[${config.tintColor}]/${op} backdrop-blur-${bl} border-[${config.borderWidth}px] border-[${config.tintColor === '#ffffff' ? '#ffffff' : '#000'}]/${config.borderOpacity} rounded-[${config.borderRadius}px] shadow-[0_4px_30px_rgba(0,0,0,${config.shadowIntensity/100})]`;
  }, [config]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* 1. Preview Area */}
      <div 
        className="w-full h-80 sm:h-96 rounded-4xl border border-border/50 shadow-inner flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${config.bgColors.join(', ')})` }}
      >
        <div 
          className="w-80 p-8 flex flex-col gap-4 transition-all duration-300"
          style={{
            background: hexToRgba(config.tintColor, 100 - config.transparency),
            backdropFilter: `blur(${config.blur}px)`,
            WebkitBackdropFilter: `blur(${config.blur}px)`,
            border: `${config.borderWidth}px solid ${hexToRgba(config.tintColor === '#ffffff' ? '#ffffff' : '#000000', config.borderOpacity)}`,
            borderRadius: `${config.borderRadius}px`,
            boxShadow: `0 4px 30px ${hexToRgba('#000000', config.shadowIntensity)}`,
            color: config.textColor
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-current opacity-20" />
          <h2 className="text-2xl font-black tracking-tight">Glassmorphism</h2>
          <p className="text-sm font-medium opacity-80 leading-relaxed">
            This is a preview of your frosted glass effect. Adjust the parameters below to fine-tune the blur, transparency, and borders.
          </p>
          <div className="mt-2 py-3 px-6 rounded-xl font-bold text-center border border-current opacity-80">
            Action Button
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Controls */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Glass Properties
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-4 flex justify-between">Blur Radius (backdrop-filter) <span>{config.blur}px</span></label>
              <input type="range" min="0" max="40" value={config.blur} onChange={e => setConfig({ ...config, blur: Number(e.target.value) })} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-4 flex justify-between">Transparency <span>{config.transparency}%</span></label>
              <input type="range" min="0" max="100" value={config.transparency} onChange={e => setConfig({ ...config, transparency: Number(e.target.value) })} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-4 flex justify-between">Border Width <span>{config.borderWidth}px</span></label>
                <input type="range" min="0" max="4" step="1" value={config.borderWidth} onChange={e => setConfig({ ...config, borderWidth: Number(e.target.value) })} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-4 flex justify-between">Border Opacity <span>{config.borderOpacity}%</span></label>
                <input type="range" min="0" max="100" value={config.borderOpacity} onChange={e => setConfig({ ...config, borderOpacity: Number(e.target.value) })} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-4 flex justify-between">Border Radius <span>{config.borderRadius}px</span></label>
                <input type="range" min="0" max="64" value={config.borderRadius} onChange={e => setConfig({ ...config, borderRadius: Number(e.target.value) })} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-4 flex justify-between">Shadow Intensity <span>{config.shadowIntensity}%</span></label>
                <input type="range" min="0" max="100" value={config.shadowIntensity} onChange={e => setConfig({ ...config, shadowIntensity: Number(e.target.value) })} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-border/50">
               <div className="flex items-center gap-2">
                 <input type="color" value={config.tintColor} onChange={e => setConfig({ ...config, tintColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-border p-0" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-4">Tint Color</span>
               </div>
               <div className="flex items-center gap-2">
                 <input type="color" value={config.textColor} onChange={e => setConfig({ ...config, textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-border p-0" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-4">Text Color</span>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Output & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Export Code</h3>
                <CopyButton text={outputTab === 'css' ? cssValue : tailwindValue} />
             </div>

             <div className="flex bg-bg border border-border p-1 rounded-xl">
                <button onClick={() => setOutputTab('css')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", outputTab === 'css' ? "bg-surface text-text shadow-sm" : "text-text-4")}>CSS</button>
                <button onClick={() => setOutputTab('tailwind')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", outputTab === 'tailwind' ? "bg-surface text-text shadow-sm" : "text-text-4")}>Tailwind</button>
             </div>

             <textarea
               readOnly
               value={outputTab === 'css' ? cssValue : tailwindValue}
               className="w-full h-40 bg-bg border border-border rounded-2xl p-4 font-mono text-xs text-text-3 outline-none resize-none leading-relaxed whitespace-pre"
             />
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 shadow-sm space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">Presets</h3>
             <div className="grid grid-cols-2 gap-3">
               {PRESETS.map((p, i) => (
                 <button
                   key={i}
                   onClick={() => setConfig(JSON.parse(JSON.stringify(p.config)))}
                   className="px-4 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-3 hover:text-blue hover:border-blue/30 transition-all text-left"
                 >
                   {p.name}
                 </button>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
