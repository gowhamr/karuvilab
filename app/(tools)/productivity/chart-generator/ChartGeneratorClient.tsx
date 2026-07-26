"use client";

import React, { useState, useRef } from "react";
import { Download, Copy, Check, Palette, LayoutGrid } from "lucide-react";
import { m } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { DataPoint, ChartType, PALETTES, ChartOptions } from "./types";
import ChartPreview from "./ChartPreview";
import ChartControls from "./ChartControls";

export default function ChartGeneratorClient() {
  const { toast } = useToast();
  const [data, setData] = useState<DataPoint[]>([
    { id: "1", label: "Q1", value: 450, color: PALETTES[4]!.colors[0]! },
    { id: "2", label: "Q2", value: 680, color: PALETTES[4]!.colors[1]! },
    { id: "3", label: "Q3", value: 520, color: PALETTES[4]!.colors[2]! },
    { id: "4", label: "Q4", value: 890, color: PALETTES[4]!.colors[3]! },
  ]);
  
  const [type, setType] = useState<ChartType>("bar");
  const [options, setOptions] = useState<ChartOptions>({
    showValues: true,
    smoothLines: true,
    showGrid: true,
    activePalette: 4,
    title: "Sales Performance 2026"
  });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);

  // Actions
  const addPoint = () => {
    const nextColor = PALETTES[options.activePalette]!.colors[data.length % PALETTES[options.activePalette]!.colors.length]!;
    setData([...data, { 
      id: Math.random().toString(36).substring(7), 
      label: `Point ${data.length + 1}`, 
      value: 100, 
      color: nextColor
    }]);
  };

  const updatePoint = (id: string, key: keyof DataPoint, val: any) => {
    setData(data.map(p => p.id === id ? { ...p, [key]: val } : p));
  };

  const removePoint = (id: string) => {
    if (data.length <= 1) {
      toast("Keep at least one data point", "error");
      return;
    }
    setData(data.filter(p => p.id !== id));
  };

  const applyPalette = (index: number) => {
    setOptions({ ...options, activePalette: index });
    const palette = PALETTES[index]!.colors;
    setData(data.map((p, i) => ({
      ...p,
      color: palette[i % palette.length]!
    })));
  };

  // Export logic
  const downloadPNG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = 1600;
    canvas.height = 1200;
    
    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 1600, 1200);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${options.title.toLowerCase().replace(/\s+/g, '-') || 'chart'}.png`;
      a.click();
      toast("Chart exported as PNG", "success");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copySVG = async () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    try {
      await navigator.clipboard.writeText(svgData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("SVG code copied to clipboard", "success");
    } catch (err) {
      toast("Failed to copy", "error");
    }
  };

  const copyImage = async () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = 1600;
    canvas.height = 1200;
    
    img.onload = async () => {
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 1600, 1200);
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          toast("Image copied to clipboard", "success");
        } catch (err) {
          toast("Failed to copy image", "error");
        }
      });
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="xl:col-span-4">
          <ChartControls 
            data={data}
            type={type}
            options={options}
            setData={setData}
            setType={setType}
            setOptions={setOptions}
            addPoint={addPoint}
            updatePoint={updatePoint}
            removePoint={removePoint}
            applyPalette={applyPalette}
          />
        </div>

        {/* Chart Preview */}
        <div className="xl:col-span-8 space-y-6">
          <div className="p-8 md:p-12 bg-surface border border-border rounded-6xl shadow-sm flex flex-col items-center justify-center min-h-full relative overflow-hidden group/canvas">
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-content w-full flex flex-col items-center gap-12">
              {options.title && (
                <m.h2 
                  key={options.title}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-black tracking-tight text-center max-w-lg"
                >
                  {options.title}
                </m.h2>
              )}

              <ChartPreview 
                data={data}
                type={type}
                options={options}
                svgRef={svgRef}
              />
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-6 max-w-xl">
                {data.map((d) => (
                  <div key={d.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-bold text-text-2">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Float Actions */}
            <div className="absolute top-6 right-6 flex items-center gap-3 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
              <button 
                onClick={copySVG}
                className="p-3 bg-surface border border-border rounded-2xl text-text-3 hover:text-blue hover:border-blue/30 transition-all active:scale-90 shadow-sm"
                title="Copy SVG Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={copyImage}
                className="p-3 bg-surface border border-border rounded-2xl text-text-3 hover:text-blue hover:border-blue/30 transition-all active:scale-90 shadow-sm"
                title="Copy Image"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={downloadPNG}
                className="flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" /> Export PNG
              </button>
            </div>
          </div>

          {/* Empty State / Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-surface border border-border rounded-4xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center text-blue flex-shrink-0">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Visual Palettes</h3>
                <p className="text-xs text-text-muted">Apply curated color schemes for consistent brand aesthetics.</p>
              </div>
            </div>
            <div className="p-6 bg-surface border border-border rounded-4xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center text-blue flex-shrink-0">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Vector Precision</h3>
                <p className="text-xs text-text-muted">Charts are rendered as high-fidelity SVGs for maximum crispness.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
