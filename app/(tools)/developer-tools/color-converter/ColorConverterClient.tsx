"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";
import { useColorStore } from "@/src/store/useColorStore";
import { Check, Copy, Hash, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

// Color Conversion & Analysis Utils
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1] ?? "0", 16),
    g: parseInt(result[2] ?? "0", 16),
    b: parseInt(result[3] ?? "0", 16)
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

function getContrastRatio(lum1: number, lum2: number) {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const FORMATS = ["HEX", "RGB", "HSL"] as const;

export default function ColorConverterClient() {
  const [hex, setHex] = useState("#4F46E5");
  const [invalid, setInvalid] = useState(false);
  const [activeFormat, setActiveFormat] = useState<typeof FORMATS[number]>("HEX");
  
  const history = useColorStore(s => s.history);
  const addColor = useColorStore(s => s.addColor);

  const rgb = useMemo(() => hexToRgb(hex) || { r: 0, g: 0, b: 0 }, [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const contrastWhite = useMemo(() => getContrastRatio(getLuminance(rgb.r, rgb.g, rgb.b), 1), [rgb]);
  const contrastBlack = useMemo(() => getContrastRatio(getLuminance(rgb.r, rgb.g, rgb.b), 0), [rgb]);

  const updateColor = useCallback((newHex: string, save = true) => {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(newHex)) {
      setHex(newHex.toUpperCase());
      setInvalid(false);
      if (save) addColor(newHex.toUpperCase());
    } else {
      setInvalid(true);
    }
  }, [addColor]);

  const handleInputChange = (val: string) => {
    setHex(val);
    if (val.startsWith("#") && (val.length === 4 || val.length === 7)) {
      updateColor(val, true);
    } else {
      setInvalid(true);
    }
  };

  const ContrastBadge = ({ ratio, label }: { ratio: number, label: string }) => {
    const aa = ratio >= 4.5;
    const aaa = ratio >= 7;
    return (
      <div className="space-y-2">
        <p className="text-[10px] font-black text-text-4 uppercase tracking-widest">{label}</p>
        <div className="flex gap-2">
          <div className={cn(
            "px-2 py-0.5 rounded text-[9px] font-black tracking-tighter border",
            aa ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
          )}>AA {aa ? "PASS" : "FAIL"}</div>
          <div className={cn(
            "px-2 py-0.5 rounded text-[9px] font-black tracking-tighter border",
            aaa ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
          )}>AAA {aaa ? "PASS" : "FAIL"}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Swatch & History */}
        <div className="space-y-8">
          <div className="flex items-start gap-8">
             <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdjZEADJgY0AAL///8HMRiZmYAsRgY0AAL///8HMRiZmYAsRgYQYAIWAgD8D2IAAAAA')] bg-repeat shadow-2xl border-4 border-surface ring-1 ring-white/10">
                   <m.div 
                     animate={{ backgroundColor: hex }}
                     className="w-full h-full shadow-inner" 
                   />
                </div>
                <input 
                  type="color" 
                  value={hex}
                  onChange={(e) => updateColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
             </div>
             
             <div className="flex-1 space-y-4 pt-1">
                <div className="flex flex-wrap gap-1 p-1 bg-surface border border-border rounded-xl w-fit">
                   {FORMATS.map(f => (
                     <button
                       key={f}
                       onClick={() => setActiveFormat(f)}
                       className={cn(
                         "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                         activeFormat === f ? "bg-blue text-white shadow-sm" : "text-text-4 hover:text-text"
                       )}
                     >
                       {f}
                     </button>
                   ))}
                </div>
                
                <m.div 
                  animate={invalid ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-center gap-3 bg-surface border p-4 rounded-xl shadow-sm transition-colors",
                    invalid ? "border-red-500/50" : "border-border"
                  )}
                >
                   <Hash className={cn("w-5 h-5", invalid ? "text-red-500" : "text-blue")} />
                   <input 
                     value={hex}
                     onChange={(e) => handleInputChange(e.target.value)}
                     className="bg-transparent outline-none font-mono font-bold text-xl w-full uppercase"
                     placeholder="#000000"
                   />
                   {invalid && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
                </m.div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 p-6 bg-surface/50 border border-border rounded-2xl shadow-inner">
             <ContrastBadge ratio={contrastWhite} label="On White Background" />
             <ContrastBadge ratio={contrastBlack} label="On Black Background" />
          </div>

          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-text-4 uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Recent Palettes
             </h4>
             <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="popLayout">
                  {history.map((c, i) => (
                    <m.button
                      key={`${c}-${i}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => updateColor(c, false)}
                      className="w-8 h-8 rounded-lg border-2 border-surface shadow-sm hover:scale-110 transition-transform active:scale-95"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Right: Conversion Pill Rows */}
        <div className="space-y-4">
           {[
             { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
             { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
             { label: "HEX-A", value: `${hex}FF` },
             { label: "GL-SL", value: `vec3(${(rgb.r/255).toFixed(2)}, ${(rgb.g/255).toFixed(2)}, ${(rgb.b/255).toFixed(2)})` }
           ].map((row) => (
             <div key={row.label} className="group flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-blue/30 transition-all shadow-sm">
                <div className="space-y-0.5">
                   <span className="text-[9px] font-black text-text-4 uppercase tracking-widest block">{row.label}</span>
                   <span className="font-mono text-sm font-bold text-text-2">{row.value}</span>
                </div>
                <CopyButton text={row.value} />
             </div>
           ))}
           
           <div className="pt-4">
              <div 
                className="w-full p-8 rounded-[32px] flex items-center justify-center transition-all duration-500 border border-white/5 shadow-2xl"
                style={{ backgroundColor: hex }}
              >
                 <span className={cn(
                   "text-4xl font-black font-mono tracking-tighter drop-shadow-sm",
                   contrastWhite > 4.5 ? "text-white" : "text-black"
                 )}>
                    {hex}
                 </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
