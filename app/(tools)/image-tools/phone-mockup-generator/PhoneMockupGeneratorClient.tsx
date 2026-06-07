"use client";

import React, { useState, useRef, useEffect } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { Smartphone, Download, Image as ImageIcon, RotateCw, Palette } from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";

const DEVICES = [
  { id: "iphone-15", name: "iPhone 15 Pro", width: 400, height: 800, corner: 60, bezel: 15 },
  { id: "pixel-8", name: "Pixel 8", width: 400, height: 800, corner: 40, bezel: 12 },
  { id: "ipad-pro", name: "iPad Pro", width: 700, height: 950, corner: 30, bezel: 20 },
];

export default function PhoneMockupGeneratorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]!);
  const [bgColor, setBgColor] = useState("#4F46E5");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const onFilesSelected = async (files: FileList | File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = image;
      img.onload = () => {
        const padding = 100;
        canvas.width = selectedDevice.width + padding * 2;
        canvas.height = selectedDevice.height + padding * 2;

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Device Shadow
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 20;

        // Device Frame
        ctx.fillStyle = "#0F172A";
        const x = padding;
        const y = padding;
        const w = selectedDevice.width;
        const h = selectedDevice.height;
        const r = selectedDevice.corner;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        // Screen Area (clipping)
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        const b = selectedDevice.bezel;
        ctx.save();
        ctx.beginPath();
        const sr = r - b;
        ctx.moveTo(x + b + sr, y + b);
        ctx.lineTo(x + w - b - sr, y + b);
        ctx.quadraticCurveTo(x + w - b, y + b, x + w - b, y + b + sr);
        ctx.lineTo(x + w - b, y + h - b - sr);
        ctx.quadraticCurveTo(x + w - b, y + h - b, x + w - b - sr, y + h - b);
        ctx.lineTo(x + b + sr, y + h - b);
        ctx.quadraticCurveTo(x + b, y + h - b, x + b, y + h - b - sr);
        ctx.lineTo(x + b, y + b + sr);
        ctx.quadraticCurveTo(x + b, y + b, x + b + sr, y + b);
        ctx.clip();

        // Draw Image
        ctx.drawImage(img, x + b, y + b, w - b * 2, h - b * 2);
        ctx.restore();
      };
    }
  }, [image, selectedDevice, bgColor]);

  const download = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `mockup-${selectedDevice.id}.png`;
      a.click();
    }
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <DropZone
          onFilesSelected={onFilesSelected}
          accept="image/*"
          title="Upload Screenshot"
          description="Drag and drop your app screenshot here"
          icon={<ImageIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6 p-8 bg-surface border border-border rounded-4xl">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue" aria-hidden="true" />
              Customization
            </h2>

            <div className="space-y-3">
              <label className="text-sm font-bold text-text-2">Select Device</label>
              <div className="grid grid-cols-1 gap-2">
                {DEVICES.map(dev => (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDevice(dev)}
                    className={`p-4 rounded-2xl border text-left transition-all ${selectedDevice.id === dev.id ? 'bg-blue/10 border-blue text-blue font-bold' : 'bg-bg border-border text-text-3'}`}
                  >
                    {dev.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-text-2">Background Color</label>
              <div className="flex gap-2">
                {["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#FFFFFF", "#000000"].map(c => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    aria-label={`Select background color ${c}`}
                    className={`w-10 h-10 rounded-full border-2 ${bgColor === c ? 'border-blue scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  aria-label="Custom background color"
                  className="w-10 h-10 rounded-full border-none cursor-pointer overflow-hidden"
                />
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <button
                onClick={() => setImage(null)}
                className="flex-1 py-4 bg-bg border border-border text-text-2 rounded-2xl font-bold hover:border-error hover:text-error transition-all"
              >
                Reset
              </button>
              <button
                onClick={download}
                className="flex-[2] py-4 bg-blue text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" aria-hidden="true" /> Download
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-8 bg-bg border border-border rounded-4xl overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
