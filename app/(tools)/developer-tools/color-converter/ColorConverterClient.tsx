"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/src/lib/utils";

// Color Conversion Utils
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

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));

  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  
  c = Math.round((c - k) / (1 - k) * 100);
  m = Math.round((m - k) / (1 - k) * 100);
  y = Math.round((y - k) / (1 - k) * 100);
  k = Math.round(k * 100);

  return { c, m, y, k };
}

export default function ColorConverterClient() {
  const [hex, setHex] = useState("#4F46E5");
  const [rgb, setRgb] = useState("rgb(79, 70, 229)");
  const [hsl, setHsl] = useState("hsl(243, 75%, 59%)");
  const [hsv, setHsv] = useState("hsv(243, 69%, 90%)");
  const [cmyk, setCmyk] = useState("cmyk(66%, 69%, 0%, 10%)");

  const updateAllFromHex = useCallback((newHex: string) => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(newHex)) return;
    
    const rgbObj = hexToRgb(newHex);
    if (!rgbObj) return;

    const { r, g, b } = rgbObj;
    setHex(newHex.toUpperCase());
    setRgb(`rgb(${r}, ${g}, ${b})`);
    
    const hslObj = rgbToHsl(r, g, b);
    setHsl(`hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`);
    
    const hsvObj = rgbToHsv(r, g, b);
    setHsv(`hsv(${hsvObj.h}, ${hsvObj.s}%, ${hsvObj.v}%)`);
    
    const cmykObj = rgbToCmyk(r, g, b);
    setCmyk(`cmyk(${cmykObj.c}%, ${cmykObj.m}%, ${cmykObj.y}%, ${cmykObj.k}%)`);
  }, []);

  const handleHexChange = (val: string) => {
    setHex(val);
    if (val.startsWith("#") && (val.length === 4 || val.length === 7)) {
      updateAllFromHex(val);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-text-4">Pick a Color</label>
            <div className="flex gap-4 items-center">
              <input 
                type="color" 
                value={hex} 
                onChange={(e) => updateAllFromHex(e.target.value)}
                className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-surface shadow-xl"
              />
              <div className="flex-1">
                <ToolInput
                  value={hex}
                  onChange={handleHexChange}
                  placeholder="#000000"
                  className="font-mono uppercase text-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-text-4">RGB Format</label>
            <div className="flex gap-2">
              <ToolInput value={rgb} readOnly className="font-mono flex-1" />
              <CopyButton text={rgb} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-text-4">HSL Format</label>
            <div className="flex gap-2">
              <ToolInput value={hsl} readOnly className="font-mono flex-1" />
              <CopyButton text={hsl} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-text-4">HSV Format</label>
            <div className="flex gap-2">
              <ToolInput value={hsv} readOnly className="font-mono flex-1" />
              <CopyButton text={hsv} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-widest text-text-4">CMYK Format</label>
            <div className="flex gap-2">
              <ToolInput value={cmyk} readOnly className="font-mono flex-1" />
              <CopyButton text={cmyk} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-sm font-black uppercase tracking-widest text-text-4">Live Preview</label>
          <div 
            className="w-full aspect-square rounded-[32px] shadow-2xl border-8 border-surface flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: hex }}
          >
             <span className={cn(
               "text-3xl font-black font-mono drop-shadow-sm",
               hexToRgb(hex) && (hexToRgb(hex)!.r * 0.299 + hexToRgb(hex)!.g * 0.587 + hexToRgb(hex)!.b * 0.114) > 186 ? "text-black" : "text-white"
             )}>
               {hex}
             </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#8B5CF6', '#6366F1', '#111827', '#F3F4F6'].map(c => (
              <button 
                key={c}
                onClick={() => updateAllFromHex(c)}
                className="aspect-square rounded-lg border border-border shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
