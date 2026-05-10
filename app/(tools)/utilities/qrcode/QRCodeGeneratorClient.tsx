"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const ECC_OPTIONS = [
  { value: "L", label: "L — Low (7%)" },
  { value: "M", label: "M — Medium (15%)" },
  { value: "Q", label: "Q — Quartile (25%)" },
  { value: "H", label: "H — High (30%)" },
];

export default function QRCodeGeneratorClient() {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(256);
  const [ecc, setEcc] = useState("M");
  const [downloading, setDownloading] = useState(false);

  const qrUrl = input
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}&ecc=${ecc}&margin=2&color=000000`
    : "";

  const handleDownload = async () => {
    if (!qrUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">URL or Text</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
            placeholder="https://example.com or any text…"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-2">Size</label>
              <span className="text-sm font-mono font-bold text-blue">{size}×{size}px</span>
            </div>
            <input
              type="range"
              min={128}
              max={512}
              step={32}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full accent-blue"
            />
            <div className="flex justify-between text-xs text-text-4">
              <span>128px</span><span>512px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2">Error Correction</label>
            <div className="grid grid-cols-2 gap-2">
              {ECC_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setEcc(opt.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${ecc === opt.value ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {qrUrl && (
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <img
              src={qrUrl}
              alt="QR Code"
              width={size}
              height={size}
              className="rounded-lg max-w-full h-auto"
            />
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full max-w-xs py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {downloading ? "Downloading…" : "Download PNG"}
          </button>
          <p className="text-xs text-text-4 text-center">
            QR codes are generated via api.qrserver.com and require an internet connection.
          </p>
        </div>
      )}
    </div>
  );
}
