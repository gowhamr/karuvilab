"use client";
import { useState, useEffect } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";
import { QRCodeLoader } from "@/components/ui/QRCodeLoader";
import { Loader2 } from "lucide-react";

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
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  useEffect(() => {
    if (isLibLoaded && input && (window as any).QRCode) {
      const generateLocalQr = async () => {
        try {
          const dataUrl = await (window as any).QRCode.toDataURL(input, {
            width: size * 2,
            margin: 2,
            errorCorrectionLevel: ecc,
            color: { dark: "#000000", light: "#ffffff" }
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const url = createUrl(blob);
          if (qrBlobUrl) revokeUrl(qrBlobUrl);
          setQrBlobUrl(url);
        } catch (err) {
          console.error("QR Generation failed:", err);
        }
      };
      generateLocalQr();
    } else {
      if (qrBlobUrl) revokeUrl(qrBlobUrl);
      setQrBlobUrl(null);
    }
  }, [input, size, ecc, isLibLoaded, createUrl, revokeUrl]);

  const handleDownload = async () => {
    if (!qrBlobUrl) return;
    setDownloading(true);
    try {
      const a = document.createElement("a");
      a.href = qrBlobUrl;
      a.download = `qrcode-${Date.now()}.png`;
      a.click();
    } catch {
      // silently fail
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      <QRCodeLoader onLoad={() => setIsLibLoaded(true)} />
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
          <SliderField
            label="Size"
            id="qr-size"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={setSize}
            format={(v) => `${v}×${v}px`}
          />

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

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center gap-6">
        <div className="bg-bg border-2 border-dashed border-border rounded-2xl p-4 min-w-[256px] min-h-[256px] flex items-center justify-center">
          {!input ? (
            <span className="text-sm font-medium text-text-4 text-center px-4">
              Enter text or URL<br/>to generate QR code
            </span>
          ) : !isLibLoaded || !qrBlobUrl ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue" />
              <span className="text-xs font-bold text-text-3 tracking-widest uppercase">Generating</span>
            </div>
          ) : (
            <img
              src={qrBlobUrl}
              alt="QR Code"
              width={size}
              height={size}
              className="rounded-xl max-w-full h-auto bg-white p-2"
            />
          )}
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading || !qrBlobUrl}
          className="w-full max-w-xs py-4 bg-brand-primary text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
        >
          {downloading ? "Downloading…" : "Download PNG"}
        </button>
        <p className="text-xs text-text-4 text-center font-medium">
          Zero-Upload: QR codes are generated entirely in your browser.
        </p>
      </div>
    </div>
  );
}
