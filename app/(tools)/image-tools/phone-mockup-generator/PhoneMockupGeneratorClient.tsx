"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { Smartphone, Download, Image as ImageIcon } from "lucide-react";
import { useObjectUrlManager } from "@/src/lib/hooks";

interface DeviceProfile {
  id: string;
  name: string;
  /** Canvas width for the device body (px) */
  width: number;
  /** Canvas height for the device body (px) */
  height: number;
  /** Outer corner radius */
  corner: number;
  /** Screen-area inset from device edge */
  bezel: number;
  /** Inner (screen) corner radius */
  screenCorner: number;
  /** Draw a Dynamic Island pill */
  dynamicIsland?: { w: number; h: number };
  /** Draw a punch-hole camera (Pixel style) */
  punchHole?: { r: number };
  /** Draw a notch */
  notch?: { w: number; h: number };
  /** Side button positions (as fraction of height) */
  buttons?: {
    right: { y: number; h: number }[];
    left: { y: number; h: number }[];
  };
}

const DEVICES: DeviceProfile[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    width: 390,
    height: 844,
    corner: 54,
    bezel: 14,
    screenCorner: 44,
    dynamicIsland: { w: 120, h: 34 },
    buttons: {
      right: [{ y: 0.28, h: 0.10 }],
      left: [
        { y: 0.23, h: 0.05 },
        { y: 0.31, h: 0.08 },
        { y: 0.42, h: 0.08 },
      ],
    },
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    width: 380,
    height: 820,
    corner: 42,
    bezel: 14,
    screenCorner: 30,
    punchHole: { r: 18 },
    buttons: {
      right: [
        { y: 0.26, h: 0.06 },
        { y: 0.34, h: 0.12 },
      ],
      left: [],
    },
  },
  {
    id: "ipad-pro",
    name: "iPad Pro 12.9\"",
    width: 680,
    height: 900,
    corner: 18,
    bezel: 22,
    screenCorner: 10,
    punchHole: { r: 14 },
    buttons: {
      right: [
        { y: 0.12, h: 0.05 },
        { y: 0.20, h: 0.08 },
      ],
      left: [],
    },
  },
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
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
}

function drawDevice(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  device: DeviceProfile,
  bgColor: string,
  colorScheme: "dark" | "silver",
  padding: number
) {
  const { width: dw, height: dh, corner, bezel, screenCorner } = device;
  const canvasW = dw + padding * 2;
  const canvasH = dh + padding * 2;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasW, canvasH);

  const dx = padding;
  const dy = padding;

  // ── Device body shadow ──────────────────────────────────────────────
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  const bodyColor = colorScheme === "silver"
    ? { body: "#D1D5DB", highlight: "#F9FAFB", shadow: "#9CA3AF", button: "#E5E7EB" }
    : { body: "#0F172A", highlight: "#1E293B", shadow: "#020617", button: "#1E293B" };

  ctx.fillStyle = bodyColor.body;
  roundRect(ctx, dx, dy, dw, dh, corner);
  ctx.fill();
  ctx.restore();

  // ── Metallic rim / highlight ────────────────────────────────────────
  ctx.save();
  const grad = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh);
  grad.addColorStop(0, colorScheme === "silver" ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)");
  grad.addColorStop(0.5, "rgba(0,0,0,0)");
  grad.addColorStop(1, colorScheme === "silver" ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.35)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  roundRect(ctx, dx, dy, dw, dh, corner);
  ctx.stroke();
  ctx.restore();

  // ── Side buttons ────────────────────────────────────────────────────
  if (device.buttons) {
    const btnColor = bodyColor.button;
    const btnWidth = 4;

    // Right buttons
    for (const btn of device.buttons.right) {
      const bY = dy + btn.y * dh;
      const bH = btn.h * dh;
      ctx.fillStyle = btnColor;
      roundRect(ctx, dx + dw - 1, bY, btnWidth, bH, 2);
      ctx.fill();
      ctx.strokeStyle = colorScheme === "silver" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)";
      ctx.lineWidth = 0.5;
      roundRect(ctx, dx + dw - 1, bY, btnWidth, bH, 2);
      ctx.stroke();
    }

    // Left buttons
    for (const btn of device.buttons.left) {
      const bY = dy + btn.y * dh;
      const bH = btn.h * dh;
      ctx.fillStyle = btnColor;
      roundRect(ctx, dx - btnWidth + 1, bY, btnWidth, bH, 2);
      ctx.fill();
      ctx.strokeStyle = colorScheme === "silver" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)";
      ctx.lineWidth = 0.5;
      roundRect(ctx, dx - btnWidth + 1, bY, btnWidth, bH, 2);
      ctx.stroke();
    }
  }

  // ── Screen area ─────────────────────────────────────────────────────
  const sx = dx + bezel;
  const sy = dy + bezel;
  const sw = dw - bezel * 2;
  const sh = dh - bezel * 2;

  // Screen clip
  ctx.save();
  roundRect(ctx, sx, sy, sw, sh, screenCorner);
  ctx.clip();

  // Screen background (in case image doesn't fill)
  ctx.fillStyle = "#000";
  ctx.fillRect(sx, sy, sw, sh);

  // User image
  ctx.drawImage(img, sx, sy, sw, sh);
  ctx.restore();

  // ── Screen inner border / glow ──────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 1;
  roundRect(ctx, sx, sy, sw, sh, screenCorner);
  ctx.stroke();
  ctx.restore();

  // ── Dynamic Island (iPhone 15 Pro) ──────────────────────────────────
  if (device.dynamicIsland) {
    const { w: diW, h: diH } = device.dynamicIsland;
    const diX = dx + dw / 2 - diW / 2;
    const diY = dy + bezel - 4;
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 6;
    roundRect(ctx, diX, diY, diW, diH, diH / 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Punch-hole camera (Pixel 8, iPad Pro) ───────────────────────────
  if (device.punchHole) {
    const phR = device.punchHole.r;
    const phX = dx + dw / 2;
    const phY = dy + bezel + phR + 4;
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(phX, phY, phR, 0, Math.PI * 2);
    ctx.fill();
    // Lens highlight
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(phX - phR * 0.2, phY - phR * 0.2, phR * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Notch (legacy) ──────────────────────────────────────────────────
  if (device.notch) {
    const { w: nW, h: nH } = device.notch;
    const nX = dx + dw / 2 - nW / 2;
    const nY = dy + bezel - 2;
    ctx.save();
    ctx.fillStyle = bodyColor.body;
    ctx.fillRect(nX, nY, nW, nH);
    ctx.restore();
  }
}

export default function PhoneMockupGeneratorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]!);
  const [bgColor, setBgColor] = useState("#4F46E5");
  const [colorScheme, setColorScheme] = useState<"dark" | "silver">("dark");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  const onFilesSelected = useCallback(async (files: FileList | File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = image;
      img.onload = () => {
        if (!active) return;
        const padding = 80;
        canvas.width = selectedDevice.width + padding * 2;
        canvas.height = selectedDevice.height + padding * 2;
        drawDevice(ctx, img, selectedDevice, bgColor, colorScheme, padding);
      };
    }
    const canvas = canvasRef.current;
    return () => {
      active = false;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [image, selectedDevice, bgColor, colorScheme]);

  const download = useCallback(() => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `mockup-${selectedDevice.id}.png`;
      a.click();
    }
  }, [selectedDevice.id]);

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
          <div className="lg:col-span-1 space-y-6 p-4 sm:p-8 bg-surface border border-border rounded-4xl">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue" aria-hidden="true" />
              Customization
            </h2>

            {/* Device selector */}
            <div className="space-y-3">
              <label id="device-select-label" className="text-sm font-bold text-text-2">Select Device</label>
              <div role="group" aria-labelledby="device-select-label" className="grid grid-cols-1 gap-2">
                {DEVICES.map(dev => (
                  <button
                    key={dev.id}
                    id={`device-${dev.id}`}
                    onClick={() => setSelectedDevice(dev)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedDevice.id === dev.id
                        ? "bg-blue/10 border-blue text-blue font-bold"
                        : "bg-bg border-border text-text-3"
                    }`}
                  >
                    {dev.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color scheme */}
            <div className="space-y-3">
              <label id="device-color-label" className="text-sm font-bold text-text-2">Device Color</label>
              <div role="group" aria-labelledby="device-color-label" className="flex gap-2">
                <button
                  id="device-color-dark"
                  onClick={() => setColorScheme("dark")}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    colorScheme === "dark"
                      ? "bg-slate-900 text-white border-blue"
                      : "bg-bg border-border text-text-3"
                  }`}
                >
                  Space Black
                </button>
                <button
                  id="device-color-silver"
                  onClick={() => setColorScheme("silver")}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    colorScheme === "silver"
                      ? "bg-gray-100 text-gray-800 border-blue"
                      : "bg-bg border-border text-text-3"
                  }`}
                >
                  Silver
                </button>
              </div>
            </div>

            {/* Background color */}
            <div className="space-y-3">
              <label id="bg-color-label" className="text-sm font-bold text-text-2">Background Color</label>
              <div role="group" aria-labelledby="bg-color-label" className="flex flex-wrap gap-2">
                {["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#FFFFFF", "#000000"].map(c => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    aria-label={`Select background color ${c}`}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${bgColor === c ? "border-blue scale-110" : "border-transparent"}`}
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
                id="mockup-reset-btn"
                onClick={() => setImage(null)}
                className="flex-1 py-4 bg-bg border border-border text-text-2 rounded-2xl font-bold hover:border-error hover:text-error transition-all"
              >
                Reset
              </button>
              <button
                id="mockup-download-btn"
                onClick={download}
                className="flex-[2] py-4 bg-blue text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" aria-hidden="true" /> Download
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 sm:p-8 bg-bg border border-border rounded-4xl overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
