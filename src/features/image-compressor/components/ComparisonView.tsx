"use client";

import React from 'react';
import { ImageItem } from '../types';
import { formatSize, getReduction } from '../utils';
import { Download, MoveHorizontal, Maximize2 } from 'lucide-react';

export const ComparisonView: React.FC<{ item: ImageItem }> = ({ item }) => {
  const [sliderPos, setSliderPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = React.useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseMove = React.useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);
  const onTouchMove = React.useCallback((e: React.TouchEvent) => handleMove(e.touches[0]!.clientX), [handleMove]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setSliderPos(prev => Math.max(0, prev - 5));
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setSliderPos(prev => Math.min(100, prev + 5));
        break;
      case 'Home':
        e.preventDefault();
        setSliderPos(0);
        break;
      case 'End':
        e.preventDefault();
        setSliderPos(100);
        break;
    }
  };

  const download = () => {
    if (!item.compressedUrl) return;
    const a = document.createElement('a');
    a.href = item.compressedUrl;
    a.download = `compressed-${item.file.name}`;
    a.click();
  };

  if (!item.compressedUrl) {
    return (
      <div className="relative aspect-[4/3] sm:aspect-video bg-bg border border-border rounded-[32px] overflow-hidden flex items-center justify-center">
        <img src={item.previewUrl} alt="Original" className="max-h-full object-contain" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
          Original • {formatSize(item.originalSize)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Image comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPos)}
        aria-valuetext={`${Math.round(sliderPos)}% original visible`}
        onKeyDown={onKeyDown}
        className="relative aspect-[4/3] sm:aspect-video bg-bg border border-border rounded-[32px] overflow-hidden cursor-col-resize select-none outline-none focus:ring-4 focus:ring-blue/20 transition-all group"
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
      >
        {/* Compressed (Background) */}
        <img src={item.compressedUrl} alt="Compressed" className="absolute inset-0 w-full h-full object-contain" />
        
        {/* Original (Foreground, Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={item.previewUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute inset-y-0 w-1 bg-white/50 backdrop-blur-sm pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-blue rounded-full shadow-xl flex items-center justify-center">
            <MoveHorizontal size={18} />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-black text-[10px] font-black uppercase rounded-full shadow-sm">
          Original • {formatSize(item.originalSize)}
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue/90 text-white text-[10px] font-black uppercase rounded-full shadow-sm">
          Compressed • {formatSize(item.compressedSize || 0)}
        </div>

        {/* Metrics Badge */}
        <div 
          aria-live="polite" 
          aria-atomic="true"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl animate-in zoom-in duration-500"
        >
          {getReduction(item.originalSize, item.compressedSize || 0)} Reduction
        </div>
      </div>

      <button 
        onClick={download}
        className="w-full flex items-center justify-center gap-2 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue/20"
      >
        <Download size={18} />
        Download Compressed
      </button>
    </div>
  );
};
