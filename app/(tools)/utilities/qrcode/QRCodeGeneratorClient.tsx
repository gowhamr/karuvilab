"use client";
import { useState, useEffect, useCallback } from "react";
import { useWorkflowStore } from "@/src/store/workflowStore";
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

type TemplateType = "text" | "upi" | "wifi" | "vcard";

export default function QRCodeGeneratorClient() {
  const [template, setTemplate] = useState<TemplateType>("text");
  
  // Generic / Text state
  const [input, setInput] = useState("");
  
  // UPI State
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [amount, setAmount] = useState("");

  // Wi-Fi State
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard State
  const [vcardFirstName, setVcardFirstName] = useState("");
  const [vcardLastName, setVcardLastName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardCompany, setVcardCompany] = useState("");
  const [vcardWebsite, setVcardWebsite] = useState("");

  const [size, setSize] = useState(256);
  const [ecc, setEcc] = useState("M");
  const [downloading, setDownloading] = useState(false);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();

  useEffect(() => {
    const pendingData = useWorkflowStore.getState().consumePendingQrData();
    if (pendingData) {
      if (pendingData.startsWith("upi://pay")) {
        setTemplate("upi");
        try {
          const url = new URL(pendingData);
          setUpiId(url.searchParams.get("pa") || "");
          setPayeeName(url.searchParams.get("pn") || "");
          setAmount(url.searchParams.get("am") || "");
        } catch {
          // fallback to text if parsing fails
          setTemplate("text");
          setInput(pendingData);
        }
      } else if (pendingData.startsWith("WIFI:")) {
        setTemplate("wifi");
        const matchS = pendingData.match(/S:([^;]*)/);
        const matchT = pendingData.match(/T:([^;]*)/);
        const matchP = pendingData.match(/P:([^;]*)/);
        const matchH = pendingData.match(/H:(true|false)/i);
        setWifiSsid(matchS?.[1] || "");
        setWifiEncryption(matchT?.[1] || "WPA");
        setWifiPassword(matchP?.[1] || "");
        setWifiHidden(matchH?.[1]?.toLowerCase() === 'true');
      } else if (pendingData.startsWith("BEGIN:VCARD")) {
        setTemplate("vcard");
        const matchN = pendingData.match(/N:([^;]*);([^;]*)/);
        const matchOrg = pendingData.match(/ORG:([^\n]*)/);
        const matchTel = pendingData.match(/TEL[^:]*:([^\n]*)/);
        const matchEmail = pendingData.match(/EMAIL[^:]*:([^\n]*)/);
        const matchUrl = pendingData.match(/URL[^:]*:([^\n]*)/);
        
        if (matchN) {
          setVcardLastName(matchN[1] || "");
          setVcardFirstName(matchN[2] || "");
        }
        if (matchOrg?.[1]) setVcardCompany(matchOrg[1].trim());
        if (matchTel?.[1]) setVcardPhone(matchTel[1].trim());
        if (matchEmail?.[1]) setVcardEmail(matchEmail[1].trim());
        if (matchUrl?.[1]) setVcardWebsite(matchUrl[1].trim());
      } else {
        setTemplate("text");
        setInput(pendingData);
      }
    }
  }, []);

  const getFinalString = useCallback(() => {
    if (template === "upi") {
      if (!upiId) return "";
      let str = `upi://pay?pa=${encodeURIComponent(upiId)}`;
      if (payeeName) str += `&pn=${encodeURIComponent(payeeName)}`;
      if (amount) str += `&am=${encodeURIComponent(amount)}`;
      return str;
    }
    if (template === "wifi") {
      if (!wifiSsid) return "";
      return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
    }
    if (template === "vcard") {
      if (!vcardFirstName) return "";
      const fn = [vcardFirstName, vcardLastName].filter(Boolean).join(" ");
      let str = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName};${vcardFirstName};;;\nFN:${fn}\n`;
      if (vcardCompany) str += `ORG:${vcardCompany}\n`;
      if (vcardPhone) str += `TEL;TYPE=CELL:${vcardPhone}\n`;
      if (vcardEmail) str += `EMAIL;TYPE=INTERNET:${vcardEmail}\n`;
      if (vcardWebsite) str += `URL:${vcardWebsite}\n`;
      str += `END:VCARD`;
      return str;
    }
    return input;
  }, [
    template, upiId, payeeName, amount, wifiSsid, wifiEncryption, wifiPassword, wifiHidden,
    vcardFirstName, vcardLastName, vcardCompany, vcardPhone, vcardEmail, vcardWebsite, input
  ]);

  useEffect(() => {
    const finalInput = getFinalString();
    
    if (isLibLoaded && finalInput && (window as any).QRCode) {
      const generateLocalQr = async () => {
        try {
          const dataUrl = await (window as any).QRCode.toDataURL(finalInput, {
            width: size * 2,
            margin: 4,
            errorCorrectionLevel: ecc,
            color: { dark: "#000000", light: "#ffffff" }
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const url = createUrl(blob);
          
          setQrBlobUrl(prev => {
            if (prev) revokeUrl(prev);
            return url;
          });
        } catch (err) {
          console.error("QR Generation failed:", err);
        }
      };
      generateLocalQr();
    } else if (!finalInput) {
      setQrBlobUrl(prev => {
        if (prev) revokeUrl(prev);
        return null;
      });
    }
  }, [getFinalString, isLibLoaded, size, ecc, createUrl, revokeUrl]);

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
        
        {/* Template Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "text", label: "TEXT / URL" },
            { id: "upi", label: "UPI PAYMENT" },
            { id: "wifi", label: "WI-FI" },
            { id: "vcard", label: "VCARD" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as TemplateType)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${template === t.id ? "bg-brand-primary text-white shadow-md" : "bg-bg border border-border text-text-3 hover:text-text hover:border-brand-primary/50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {template === "text" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="qr-input" className="text-sm font-bold text-text-2">URL or Text</label>
            <textarea
              id="qr-input"
              rows={3}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
              placeholder="https://example.com or any text…"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
        )}

        {template === "upi" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label htmlFor="qr-upi" className="text-sm font-bold text-text-2">UPI ID (VPA) <span className="text-red-500">*</span></label>
              <input
                id="qr-upi"
                type="text"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                placeholder="merchant@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="qr-payee" className="text-sm font-bold text-text-2">Payee Name <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  id="qr-payee"
                  type="text"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="Business Name"
                  value={payeeName}
                  onChange={e => setPayeeName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="qr-amount" className="text-sm font-bold text-text-2">Amount (₹) <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  id="qr-amount"
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="Fixed amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {template === "wifi" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-2">Network Name (SSID) <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                placeholder="My WiFi Network"
                value={wifiSsid}
                onChange={e => setWifiSsid(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Password</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="Network password"
                  value={wifiPassword}
                  onChange={e => setWifiPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Encryption</label>
                <select
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all appearance-none"
                  value={wifiEncryption}
                  onChange={e => setWifiEncryption(e.target.value)}
                >
                  <option value="WPA">WPA/WPA2/WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${wifiHidden ? 'bg-blue border-blue text-white' : 'border-border bg-bg group-hover:border-blue'}`}>
                {wifiHidden && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-sm font-bold text-text-2">Hidden Network</span>
              <input type="checkbox" className="hidden" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} />
            </label>
          </div>
        )}

        {template === "vcard" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="Jane"
                  value={vcardFirstName}
                  onChange={e => setVcardFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Last Name <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="Doe"
                  value={vcardLastName}
                  onChange={e => setVcardLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Phone <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                  value={vcardPhone}
                  onChange={e => setVcardPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Email <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="jane@example.com"
                  value={vcardEmail}
                  onChange={e => setVcardEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Company <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="Acme Corp"
                  value={vcardCompany}
                  onChange={e => setVcardCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Website <span className="text-text-4 font-normal text-xs ml-1">(Optional)</span></label>
                <input
                  type="url"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
                  placeholder="https://acme.com"
                  value={vcardWebsite}
                  onChange={e => setVcardWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${ecc === opt.value ? "bg-brand-primary text-white" : "bg-bg border border-border text-text-2 hover:border-brand-primary/50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center gap-6">
        <div className="bg-white border border-border rounded-2xl p-6 min-w-64 min-h-64 flex items-center justify-center shadow-inner relative overflow-hidden">
          {!getFinalString() ? (
            <span className="text-sm font-medium text-text-4/60 text-center px-4 relative z-content">
              Enter data above<br/>to generate QR code
            </span>
          ) : !isLibLoaded ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
              <span className="text-xs font-bold text-text-3 tracking-widest uppercase">Loading Engine</span>
            </div>
          ) : qrBlobUrl ? (
            <img
              src={qrBlobUrl}
              alt="QR Code"
              width={size}
              height={size}
              className="max-w-full h-auto bg-white"
              style={{ padding: '8px' }}
            />
          ) : null}
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading || !qrBlobUrl}
          className="w-full max-w-xs py-4 bg-brand-primary text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-brand-primary/20"
        >
          {downloading ? "Downloading…" : "Download PNG"}
        </button>
        <p className="text-xs text-text-4 text-center font-medium">
          Zero-Upload: QR codes are generated instantly in your browser.
        </p>
      </div>
    </div>
  );
}
