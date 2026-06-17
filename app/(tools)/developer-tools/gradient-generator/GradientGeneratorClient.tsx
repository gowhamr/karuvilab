'use client';

import React, { useState, useMemo, useEffect, useId } from 'react';
import { Palette, Copy, RefreshCw, Layers, SlidersHorizontal, Trash2, Plus, ArrowLeftRight } from 'lucide-react';
import { m } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

type GradientType = 'linear' | 'radial' | 'conic';
type ColorStop = { id: string; color: string; position: number };

interface GradientConfig {
  type: GradientType;
  angle: number;
  shape: 'circle' | 'ellipse';
  colorStops: ColorStop[];
}

const PRESETS = [
  { name: 'Ocean',    stops: [{ id: '1', color: '#667eea', position: 0 }, { id: '2', color: '#764ba2', position: 100 }] },
  { name: 'Sunset',  stops: [{ id: '1', color: '#f093fb', position: 0 }, { id: '2', color: '#f5576c', position: 100 }] },
  { name: 'Forest',  stops: [{ id: '1', color: '#11998e', position: 0 }, { id: '2', color: '#38ef7d', position: 100 }] },
  { name: 'Fire',    stops: [{ id: '1', color: '#f7971e', position: 0 }, { id: '2', color: '#ffd200', position: 100 }] },
  { name: 'Night',   stops: [{ id: '1', color: '#0f0c29', position: 0 }, { id: '2', color: '#302b63', position: 50 }, { id: '3', color: '#24243e', position: 100 }] },
  { name: 'Aurora',  stops: [{ id: '1', color: '#00c6ff', position: 0 }, { id: '2', color: '#0072ff', position: 100 }] },
  { name: 'Rose',    stops: [{ id: '1', color: '#f953c6', position: 0 }, { id: '2', color: '#b91d73', position: 100 }] },
  { name: 'Indigo',  stops: [{ id: '1', color: '#4F46E5', position: 0 }, { id: '2', color: '#3B82F6', position: 100 }] },
];

function generateCSS(config: GradientConfig): string {
  const stops = config.colorStops
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  if (config.type === 'linear') {
    return `linear-gradient(${config.angle}deg, ${stops})`;
  } else if (config.type === 'radial') {
    return `radial-gradient(${config.shape} at center, ${stops})`;
  } else {
    return `conic-gradient(from ${config.angle}deg at center, ${stops})`;
  }
}

function generateTailwind(config: GradientConfig): string {
  return `bg-[${generateCSS(config).replace(/ /g, '_')}]`;
}

export default function GradientGeneratorClient() {
  const baseId = useId();
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    shape: 'circle',
    colorStops: [...PRESETS[7]!.stops]
  });

  const [outputTab, setOutputTab] = useState<'css' | 'tailwind'>('css');

  const cssValue = useMemo(() => generateCSS(config), [config]);
  const tailwindValue = useMemo(() => generateTailwind(config), [config]);

  const addStop = () => {
    if (config.colorStops.length >= 8) return;
    const newStops = [...config.colorStops];
    // Add in middle of largest gap
    newStops.sort((a, b) => a.position - b.position);
    let maxGap = 0;
    let insertPos = 50;
    for (let i = 0; i < newStops.length - 1; i++) {
      const gap = newStops[i + 1]!.position - newStops[i]!.position;
      if (gap > maxGap) {
        maxGap = gap;
        insertPos = newStops[i]!.position + gap / 2;
      }
    }
    newStops.push({ id: Math.random().toString(), color: '#ffffff', position: Math.round(insertPos) });
    newStops.sort((a, b) => a.position - b.position);
    setConfig({ ...config, colorStops: newStops });
  };

  const removeStop = (id: string) => {
    if (config.colorStops.length <= 2) return;
    setConfig({ ...config, colorStops: config.colorStops.filter(s => s.id !== id) });
  };

  const updateStop = (id: string, field: 'color' | 'position', value: any) => {
    setConfig({
      ...config,
      colorStops: config.colorStops.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const reverseStops = () => {
    const newStops = config.colorStops.map(s => ({ ...s, position: 100 - s.position })).reverse();
    setConfig({ ...config, colorStops: newStops });
  };

  const randomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setConfig({
      ...config,
      colorStops: [
        { id: '1', color: randomHex(), position: 0 },
        { id: '2', color: randomHex(), position: 100 }
      ]
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. Preview Area */}
      <div 
        className="w-full h-48 sm:h-64 rounded-4xl border border-border/50 shadow-inner transition-all duration-300"
        style={{ background: cssValue }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Controls */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex bg-bg border border-border p-1 rounded-2xl w-full sm:w-auto">
              {(['linear', 'radial', 'conic'] as GradientType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setConfig({ ...config, type: t })}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all capitalize",
                    config.type === t ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
               <button onClick={reverseStops} className="flex-1 sm:flex-none p-2.5 bg-bg border border-border rounded-xl text-text-3 hover:text-text hover:border-blue transition-all" title="Reverse Gradient"><ArrowLeftRight className="w-4 h-4 mx-auto" /></button>
               <button onClick={randomize} className="flex-1 sm:flex-none p-2.5 bg-bg border border-border rounded-xl text-text-3 hover:text-text hover:border-blue transition-all" title="Randomize Colors"><RefreshCw className="w-4 h-4 mx-auto" /></button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Adjustments
            </h3>
            
            {(config.type === 'linear' || config.type === 'conic') && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-text-3">Angle</label>
                  <span className="text-xs font-bold text-text-4">{config.angle}°</span>
                </div>
                <input
                  type="range"
                  min={0} max={360}
                  value={config.angle}
                  onChange={(e) => setConfig({ ...config, angle: Number(e.target.value) })}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue"
                />
              </div>
            )}

            {config.type === 'radial' && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-text-3 block">Shape</label>
                <select
                  value={config.shape}
                  onChange={(e) => setConfig({ ...config, shape: e.target.value as any })}
                  className="w-full bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text focus:ring-2 focus:ring-blue/20 outline-none"
                >
                  <option value="circle">Circle</option>
                  <option value="ellipse">Ellipse</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4 border-t border-border/50 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" /> Color Stops ({config.colorStops.length}/8)
              </h3>
              <button 
                onClick={addStop} 
                disabled={config.colorStops.length >= 8}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue/10 text-blue rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue/20 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Stop
              </button>
            </div>

            <div className="space-y-3">
              {config.colorStops.sort((a,b) => a.position - b.position).map((stop, i) => (
                <div key={stop.id} className="flex items-center gap-3 p-3 bg-bg border border-border rounded-2xl group transition-all hover:border-blue/30">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 border border-border/50">
                    <input
                      id={`${baseId}-stop-color-${stop.id}`}
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                      aria-label={`Color for stop ${i + 1}`}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor={`${baseId}-stop-pos-${stop.id}`} className="text-xs font-mono font-bold text-text">{stop.color.toUpperCase()}</label>
                      <span className="text-xs font-bold text-text-4">{stop.position}%</span>
                    </div>
                    <input
                      id={`${baseId}-stop-pos-${stop.id}`}
                      type="range"
                      min={0} max={100}
                      value={stop.position}
                      onChange={(e) => updateStop(stop.id, 'position', Number(e.target.value))}
                      className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-blue"
                      aria-label={`Position for stop ${i + 1}`}
                    />
                  </div>

                  <button
                    onClick={() => removeStop(stop.id)}
                    disabled={config.colorStops.length <= 2}
                    className="p-2 text-text-4 hover:text-red-500 disabled:opacity-20 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Output & Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4">Export Code</h3>
                <CopyButton text={outputTab === 'css' ? `background: ${cssValue};` : tailwindValue} />
             </div>

             <div className="flex bg-bg border border-border p-1 rounded-xl">
                <button onClick={() => setOutputTab('css')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", outputTab === 'css' ? "bg-surface text-text shadow-sm" : "text-text-4")}>CSS</button>
                <button onClick={() => setOutputTab('tailwind')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", outputTab === 'tailwind' ? "bg-surface text-text shadow-sm" : "text-text-4")}>Tailwind</button>
             </div>

             <textarea
               readOnly
               value={outputTab === 'css' ? `background: ${cssValue};` : tailwindValue}
               className="w-full h-32 bg-bg border border-border rounded-2xl p-4 font-mono text-xs text-text-3 outline-none resize-none leading-relaxed"
             />
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 shadow-sm space-y-4">
             <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4">Preset Gallery</h3>
             <div className="grid grid-cols-4 gap-3">
               {PRESETS.map((p, i) => (
                 <button
                   key={i}
                   onClick={() => setConfig({ type: 'linear', angle: 90, shape: 'circle', colorStops: [...p.stops] })}
                   aria-label={`Apply ${p.name} preset`}
                   className="group relative aspect-square rounded-2xl border border-border overflow-hidden shadow-sm hover:ring-2 hover:ring-blue hover:border-transparent transition-all"
                   title={p.name}
                 >
                   <div className="absolute inset-0 transition-transform group-hover:scale-110" style={{ background: generateCSS({ type: 'linear', angle: 135, shape: 'circle', colorStops: p.stops }) }} />
                 </button>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
