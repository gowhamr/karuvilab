"use client";

import React, { useState, useEffect } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Wifi, Lock, Eye, EyeOff, Download, Loader2 } from "lucide-react";
import { QRCodeLoader } from "@/components/ui/QRCodeLoader";

export default function WifiQrCodeClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);

  const wifiData = ssid ? `WIFI:S:${ssid};T:${type};P:${password};${hidden ? 'H:true' : ''};;` : "";

  useEffect(() => {
    if (isLibLoaded && wifiData && (window as any).QRCode) {
      const generateLocalQr = async () => {
        try {
          const dataUrl = await (window as any).QRCode.toDataURL(wifiData, {
            width: 600,
            margin: 2,
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
  }, [wifiData, isLibLoaded, createUrl, revokeUrl]);

  const downloadQr = async () => {
    if (!qrBlobUrl) return;
    const a = document.createElement("a");
    a.href = qrBlobUrl;
    a.download = `wifi-qr-${ssid || 'network'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 p-8 bg-surface border border-border rounded-4xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue" aria-hidden="true" />
            Network Details
          </h2>

          <ToolInput
            label="SSID (Network Name)"
            value={ssid}
            onChange={setSsid}
            placeholder="e.g. My Home WiFi"
          />

          <div className="relative">
            <ToolInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Leave empty for open networks"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-10 p-2 text-text-4 hover:text-text-2 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-text-2">Security Type</label>
            <div className="grid grid-cols-3 gap-2">
              {["WPA", "WEP", "nopass"].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${type === t ? 'bg-blue/10 border-blue text-blue' : 'bg-bg border-border text-text-3'}`}
                >
                  {t === "nopass" ? "None" : t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="hidden-wifi"
              label="Hidden Network"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-4xl space-y-6 min-h-[400px] relative">
          <QRCodeLoader onLoad={() => setIsLibLoaded(true)} />
          
          {ssid ? (
            <>
              <div className="p-6 bg-white rounded-3xl shadow-xl relative min-w-[200px] min-h-[200px] flex items-center justify-center">
                {!isLibLoaded || !qrBlobUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue/30" />
                    <span className="text-xs font-bold text-text-4">INITIALIZING...</span>
                  </div>
                ) : (
                  <img src={qrBlobUrl} alt="WiFi QR Code" className="w-64 h-64" />
                )}
              </div>
              <button
                onClick={downloadQr}
                disabled={!qrBlobUrl}
                className="flex items-center gap-2 px-8 py-4 bg-blue text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download QR Code
              </button>
              <p className="text-xs text-text-4 uppercase font-black tracking-widest text-center">
                Scan with your phone's camera to connect
              </p>
            </>
          ) : (
            <div className="text-center space-y-4 text-text-4">
              <div className="w-20 h-20 bg-bg border border-border rounded-full flex items-center justify-center mx-auto">
                <Wifi className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-sm font-medium">Enter SSID to generate QR</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
