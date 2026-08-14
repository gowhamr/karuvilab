'use client';

import React, { useState, useMemo, useId } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { KV_BLUE } from '@/src/theme/constants';

interface ShadowLayer {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const PRESETS = [
  { name: 'Soft',      layers: [{ id: '1', offsetX: 0, offsetY: 4,  blur: 6,  spread: -1, color: '#000000', opacity: 10, inset: false }] },
  { name: 'Medium',    layers: [{ id: '1', offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false }] },
  { name: 'Hard',      layers: [{ id: '1', offsetX: 4, offsetY: 4,  blur: 0,  spread: 0,  color: '#000000', opacity: 25, inset: false }] },
  { name: 'Glow Blue', layers: [{ id: '1', offsetX: 0, offsetY: 0,  blur: 20, spread: 0,  color: KV_BLUE, opacity: 40, inset: false }] },
  { name: 'Inner',     layers: [{ id: '1', offsetX: 0, offsetY: 4,  blur: 6,  spread: 0,  color: '#000000', opacity: 20, inset: true  }] },
  { name: 'Layered',   layers: [
    { id: '1', offsetX: 0, offsetY: 1,  blur: 2,  spread: 0, color: '#000000', opacity: 8,  inset: false },
    { id: '2', offsetX: 0, offsetY: 4,  blur: 8,  spread: 0, color: '#000000', opacity: 8,  inset: false },
    { id: '3', offsetX: 0, offsetY: 16, blur: 24, spread: 0, color: '#000000', opacity: 8,  inset: false },
  ]},
];

function hexToRgba(hex: string, opacity: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function generateCSS(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none';
  return layers.map(l => {
    const inset = l.inset ? 'inset ' : '';
    const color = hexToRgba(l.color, l.opacity);
    return `${inset}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${color}`;
  }).join(', ');
}

function generateTailwind(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'shadow-none';
  return `shadow-[${generateCSS(layers).replace(/ /g, '_')}]`;
}

export default function BoxShadowGeneratorClient() {
  const baseId = useId();
  const [layers, setLayers] = useState<ShadowLayer[]>(PRESETS[5]!.layers);
  const [bgColor, setBgColor] = useState<string>('#F8FAFC');
  const [boxColor, setBoxColor] = useState<string>('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState<number>(24);
  const [outputTab, setOutputTab] = useState<'css' | 'tailwind'>('css');

  const cssValue = useMemo(() => generateCSS(layers), [layers]);
  const tailwindValue = useMemo(() => generateTailwind(layers), [layers]);

  const addLayer = () => {
    if (layers.length >= 6) return;
    setLayers([...layers, { id: Math.random().toString(), offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false }]);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter(l => l.id !== id));
  };

  const updateLayer = (id: string, field: keyof ShadowLayer, value: any) => {
    setLayers(layers.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  return (
    <ToolWorkspace
      tabs={{
        options: [
          { id: 'css', label: 'CSS' },
          { id: 'tailwind', label: 'Tailwind' }
        ],
        activeId: outputTab,
        onChange: (id) => setOutputTab(id as 'css' | 'tailwind')
      }}
      input={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Shadow Layers ({layers.length}/6)
            </h3>
            <button 
              onClick={addLayer} 
              disabled={layers.length >= 6}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue/10 text-blue rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue/20 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Layer
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {layers.map((layer, i) => (
                <m.div 
                  key={layer.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-bg border border-border p-5 rounded-3xl space-y-4 relative group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-text-3">Layer {i + 1}</span>
                    <button onClick={() => removeLayer(layer.id)} disabled={layers.length <= 1} className="text-text-muted hover:text-red-500 disabled:opacity-30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between">X <span>{layer.offsetX}px</span></label>
                      <input type="range" min="-100" max="100" value={layer.offsetX} onChange={e => updateLayer(layer.id, 'offsetX', Number(e.target.value))} className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between">Y <span>{layer.offsetY}px</span></label>
                      <input type="range" min="-100" max="100" value={layer.offsetY} onChange={e => updateLayer(layer.id, 'offsetY', Number(e.target.value))} className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between">Blur <span>{layer.blur}px</span></label>
                      <input type="range" min="0" max="100" value={layer.blur} onChange={e => updateLayer(layer.id, 'blur', Number(e.target.value))} className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between">Spread <span>{layer.spread}px</span></label>
                      <input type="range" min="-50" max="50" value={layer.spread} onChange={e => updateLayer(layer.id, 'spread', Number(e.target.value))} className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border">
                        <input type="color" value={layer.color} onChange={e => updateLayer(layer.id, 'color', e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
                      </div>
                      <span className="text-xs font-mono font-bold text-text-3 uppercase">{layer.color}</span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between">Opacity <span>{layer.opacity}%</span></label>
                      <input type="range" min="0" max="100" value={layer.opacity} onChange={e => updateLayer(layer.id, 'opacity', Number(e.target.value))} className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={layer.inset} onChange={e => updateLayer(layer.id, 'inset', e.target.checked)} className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border" />
                      <span className="text-xs font-bold text-text-3">Inset</span>
                    </label>
                  </div>
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      }
      optionsPanel={
        <div className="space-y-8">
          <div className="space-y-4">
             <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-muted">Box Properties</h3>
             <div className="space-y-2">
                <label htmlFor={`${baseId}-radius`} className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between">Border Radius <span>{borderRadius}px</span></label>
                <input id={`${baseId}-radius`} type="range" min="0" max="100" value={borderRadius} onChange={e => setBorderRadius(Number(e.target.value))} className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-blue" />
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-muted">Presets</h3>
             <div className="grid grid-cols-2 gap-3">
               {PRESETS.map((p, i) => (
                 <button
                   key={i}
                   onClick={() => setLayers(JSON.parse(JSON.stringify(p.layers)))} // deep copy
                   className="px-4 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-3 hover:text-blue hover:border-blue/30 transition-all text-left"
                 >
                   {p.name}
                 </button>
               ))}
             </div>
          </div>
        </div>
      }
      output={
        <div className="flex flex-col space-y-6 h-full">
          {/* Preview Area */}
          <div 
            className="w-full h-64 sm:h-80 rounded-3xl border border-border/50 shadow-inner transition-all duration-300 flex items-center justify-center relative overflow-hidden shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {/* Colors controls floating */}
            <div className="absolute top-4 left-4 flex gap-4 bg-surface/80 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-sm z-content">
               <div className="flex items-center gap-2">
                 <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0" />
                 <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">BG</span>
               </div>
               <div className="flex items-center gap-2 border-l border-border/50 pl-4">
                 <input type="color" value={boxColor} onChange={e => setBoxColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0" />
                 <span className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Box</span>
               </div>
            </div>

            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 transition-all duration-300 ease-out"
              style={{ 
                backgroundColor: boxColor,
                borderRadius: `${borderRadius}px`,
                boxShadow: cssValue 
              }}
            />
          </div>

          <div className="flex-1 min-h-[160px]">
            <ToolResultArea
              label="Export Code"
              value={outputTab === 'css' ? `box-shadow: ${cssValue};` : tailwindValue}
              language={outputTab}
            />
          </div>
        </div>
      }
    />
  );
}

