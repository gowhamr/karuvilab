"use client";

import React, { useState } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Wifi, Lock, Eye, EyeOff, Download } from "lucide-react";

export default function WifiQrCodeClient() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const wifiData = ssid ? `WIFI:S:${ssid};T:${type};P:${password};${hidden ? 'H:true' : ''};;` : "";
  const qrUrl = wifiData ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(wifiData)}` : "";

  const downloadQr = async () => {
    if (!qrUrl) return;
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wifi-qr-${ssid || 'network'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 p-8 bg-surface border border-border rounded-[32px]">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue" />
            Network Details
          </h3>

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
              className="absolute right-3 top-10 p-2 text-text-4 hover:text-text-2 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        <div className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-[32px] space-y-6 min-h-[400px]">
          {ssid ? (
            <>
              <div className="p-6 bg-white rounded-3xl shadow-xl">
                <img src={qrUrl} alt="WiFi QR Code" className="w-64 h-64" />
              </div>
              <button
                onClick={downloadQr}
                className="flex items-center gap-2 px-8 py-4 bg-blue text-white rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                <Download className="w-5 h-5" /> Download QR Code
              </button>
              <p className="text-[10px] text-text-4 uppercase font-black tracking-widest text-center">
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
