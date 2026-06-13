'use client';

import React, { useState, useMemo } from 'react';
import { Eye, ArrowLeftRight, Download, Check, AlertTriangle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

// Utility: hex to relative luminance
function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgbLinear(hex);
  return 0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!;
}

function hexToRgbLinear(hex: string): number[] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  
  return [0, 2, 4].map(i => {
    let val = parseInt(c.substring(i, i + 2), 16) / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
}

function getContrastRatio(fg: string, bg: string) {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio,
    ratioDisplay: ratio.toFixed(2) + ':1',
    aa: {
      normal: ratio >= 4.5,
      large: ratio >= 3.0,
      ui: ratio >= 3.0,
    },
    aaa: {
      normal: ratio >= 7.0,
      large: ratio >= 4.5,
    },
    level: ratio >= 7 ? 'aaa' : ratio >= 4.5 ? 'aa' : 'fail'
  };
}

export default function ContrastCheckerClient() {
  const [fg, setFg] = useState<string>('#4F46E5');
  const [bg, setBg] = useState<string>('#F8FAFC');

  const result = useMemo(() => getContrastRatio(fg, bg), [fg, bg]);

  const swapColors = () => {
    setFg(bg);
    setBg(fg);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls */}
        <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" /> Color Selection
            </h3>
          </div>

          <div className="space-y-6 relative">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-3 block">Foreground (Text) Color</label>
              <div className="flex gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-border">
                  <input
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={fg.toUpperCase()}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 px-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all uppercase"
                />
              </div>
            </div>

            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
              <button 
                onClick={swapColors}
                className="w-8 h-8 bg-surface border border-border rounded-full flex items-center justify-center text-text-3 hover:text-blue hover:border-blue shadow-sm transition-all"
                title="Swap Colors"
              >
                <ArrowLeftRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-text-3 block">Background Color</label>
              <div className="flex gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-border">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={bg.toUpperCase()}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-full bg-bg border border-border rounded-2xl py-3.5 px-4 font-mono text-lg text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-text-4">Contrast Ratio</span>
              <span className={cn(
                "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest",
                result.level === 'aaa' ? "bg-emerald-500/10 text-emerald-500" :
                result.level === 'aa' ? "bg-blue/10 text-blue" : "bg-red-500/10 text-red-500"
              )}>
                {result.level === 'fail' ? 'FAIL' : `Pass ${result.level.toUpperCase()}`}
              </span>
            </div>
            
            <div className="text-center bg-bg border border-border p-6 rounded-3xl">
              <span className={cn(
                "text-6xl font-black tracking-tighter block",
                result.level === 'fail' ? "text-red-500" : "text-text"
              )}>
                {result.ratioDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Previews */}
        <div className="space-y-6">
          <div 
            className="rounded-4xl p-8 border border-border/50 shadow-sm space-y-6 transition-colors duration-300"
            style={{ backgroundColor: bg }}
          >
            <div style={{ color: fg }} className="space-y-6 transition-colors duration-300">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-2">Normal Text (16px)</h4>
                <p className="text-base">
                  The quick brown fox jumps over the lazy dog. A good contrast ratio ensures that users with visual impairments can read the text comfortably.
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-2">Large Text (24px Bold)</h4>
                <p className="text-2xl font-bold tracking-tight">
                  Design for Accessibility
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-2">UI Component</h4>
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold border transition-colors duration-300" style={{ borderColor: fg }}>
                  Interactive Button
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-4">WCAG Compliance</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'AA Normal Text', pass: result.aa.normal, req: '4.5:1' },
                { label: 'AA Large Text', pass: result.aa.large, req: '3.0:1' },
                { label: 'AA UI Components', pass: result.aa.ui, req: '3.0:1' },
                { label: 'AAA Normal Text', pass: result.aaa.normal, req: '7.0:1' },
                { label: 'AAA Large Text', pass: result.aaa.large, req: '4.5:1' },
              ].map((item, i) => (
                <div key={i} className="bg-bg border border-border p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-text-3 block">{item.label}</span>
                    <span className="text-tiny font-medium text-text-4 uppercase tracking-widest">Req: {item.req}</span>
                  </div>
                  {item.pass ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-500" /></div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-red-500" /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
