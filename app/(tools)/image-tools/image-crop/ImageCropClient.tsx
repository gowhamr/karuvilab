"use client";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import dynamic from "next/dynamic";
import type { Crop, PixelCrop } from "react-image-crop";
const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });
import "react-image-crop/dist/ReactCrop.css";

import { DropZone } from "@/components/ui/DropZone";

const cat = CATEGORIES.find(c => c.id === "image")!;

const PRESETS = [
  { label: "Free", w: 0, h: 0 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "16:9", w: 16, h: 9 },
  { label: "3:4", w: 3, h: 4 },
  { label: "9:16", w: 9, h: 16 },
];

export default function ImageCropClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [fileName, setFileName] = useState("image");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [preset, setPreset] = useState("Free");
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const imgRef = useRef<HTMLImageElement>(null);

  const updateCrop = (field: 'x'|'y'|'width'|'height', valStr: string) => {
    if (!completedCrop || !imgRef.current) return;
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;
    
    const newCrop: Crop = { ...completedCrop, [field]: val, unit: 'px' as const };
    setCrop(newCrop);
    setCompletedCrop({ ...completedCrop, [field]: val, unit: 'px' as const });
  };

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const handleFile = (file: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    const url = createUrl(file);
    setOriginalUrl(url);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    if (croppedUrl) revokeUrl(croppedUrl);
    setCroppedUrl(null);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setOrigW(w);
      setOrigH(h);
      setCrop({
        unit: 'px',
        x: w * 0.1,
        y: h * 0.1,
        width: w * 0.8,
        height: h * 0.8
      });
      setCompletedCrop(null);
    };
    img.src = url;
  };

  const applyPreset = (label: string) => {
    setPreset(label);
    const p = PRESETS.find(x => x.label === label)!;
    if (p.w === 0) {
      setAspect(undefined);
    } else {
      setAspect(p.w / p.h);
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const ratio = p.w / p.h;
        let cW = width;
        let cH = width / ratio;
        if (cH > height) {
          cH = height;
          cW = height * ratio;
        }
        setCrop({
          unit: 'px',
          x: (width - cW) / 2,
          y: (height - cH) / 2,
          width: cW,
          height: cH
        });
      }
    }
  };


  const doCrop = () => {
    if (!originalUrl || !completedCrop || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    canvas.toBlob(blob => {
      if (blob) {
        if (croppedUrl) revokeUrl(croppedUrl);
        setCroppedUrl(createUrl(blob));
      }
    }, outputFormat, outputFormat === 'image/png' ? undefined : 0.92);
  };

  const download = () => {
    if (!croppedUrl) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
    const a = document.createElement("a");
    a.href = croppedUrl;
    a.download = `${fileName}-cropped.${ext}`;
    a.click();
  };

  // Preview overlay scale
  const previewMaxW = 400;
  const scale = origW > 0 ? Math.min(1, previewMaxW / origW) : 1;

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DropZone
            onFilesSelected={(files) => {
              const f = files instanceof FileList ? files[0] : files[0];
              if (f) handleFile(f);
            }}
            accept="image/*"
            title={originalUrl ? fileName : "Drop image or click to select"}
            description={originalUrl ? "Click to change image" : "Supports JPG, PNG, WebP"}
            icon={<div className="text-4xl">{originalUrl ? "🖼️" : "✂️"}</div>}
          />

          {/* Image preview with crop overlay */}
          {originalUrl && origW > 0 && (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden p-4 flex justify-center items-center">
                  <ReactCrop 
                    crop={crop}
                    onChange={(c: PixelCrop) => setCrop(c)}
                    onComplete={(c: PixelCrop) => setCompletedCrop(c)}
                    className="max-w-full"
                    {...(aspect !== undefined ? { aspect } : {})}
                  >
                    <img 
                      ref={imgRef} 
                      src={originalUrl} 
                      alt="Crop preview" 
                      className="max-w-full h-auto max-h-[60vh] object-contain rounded-lg"
                    />
                  </ReactCrop>
            </div>
          )}

          {/* Preset buttons */}
          {origW > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${preset === p.label ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-text-4 self-center font-bold uppercase tracking-widest">Output:</span>
                {(['image/jpeg', 'image/png', 'image/webp'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${outputFormat === fmt ? "bg-blue text-white" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                  >
                    {fmt === 'image/jpeg' ? 'JPEG' : fmt === 'image/png' ? 'PNG' : 'WebP'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          {origW > 0 && (
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Crop Parameters</h2>
              <p className="text-xs text-text-4">Original: {origW} × {origH}px</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">X (left)</label>
                  <input type="number" className={inputClass} value={completedCrop ? Math.round(completedCrop.x) : 0} onChange={(e) => updateCrop('x', e.target.value)} disabled={!completedCrop} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">Y (top)</label>
                  <input type="number" className={inputClass} value={completedCrop ? Math.round(completedCrop.y) : 0} onChange={(e) => updateCrop('y', e.target.value)} disabled={!completedCrop} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">Width</label>
                  <input type="number" className={inputClass} value={completedCrop ? Math.round(completedCrop.width) : 0} onChange={(e) => updateCrop('width', e.target.value)} disabled={!completedCrop} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-3">Height</label>
                  <input type="number" className={inputClass} value={completedCrop ? Math.round(completedCrop.height) : 0} onChange={(e) => updateCrop('height', e.target.value)} disabled={!completedCrop} />
                </div>
              </div>

              <button onClick={doCrop} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all">
                Crop Image
              </button>
            </div>
          )}

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Cropped Preview</h2>
            {croppedUrl ? (
              <>
                <img src={croppedUrl} alt="Cropped" className="mx-auto max-h-64 rounded-xl object-contain border border-border" />
                <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all">
                  Download Cropped Image
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-xl text-text-4 text-sm">
                Crop preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
}
