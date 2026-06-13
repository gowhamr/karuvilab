"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  inputFormat: string;
  setInputFormat: (val: string) => void;
  detectedFormat: string;
  confidence: "high" | "medium" | "low";
  activeTab: string;
  onLoadSample: () => void;
  formats: { id: string; label: string }[];
}

export function InputArea({
  value,
  onChange,
  inputFormat,
  setInputFormat,
  detectedFormat,
  confidence,
  activeTab,
  onLoadSample,
  formats
}: InputAreaProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast("File is too large. Max supported size is 1MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        onChange(result);
      } else if (result instanceof ArrayBuffer) {
        const u8 = new Uint8Array(result);
        const hex = Array.from(u8).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
        setInputFormat("hex");
        onChange(hex);
      }
    };
    
    if (file.type.startsWith("text/") || ["json", "xml", "html", "css", "js", "txt"].includes(file.name.split(".").pop() || "")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-2">Input Mode:</span>
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-black text-text outline-none focus:ring-2 focus:ring-blue"
          >
            {formats.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>

          {inputFormat === "auto" && (
            <span className={`text-xs font-black px-2 py-1 rounded-lg uppercase ${
              confidence === "high" 
                ? "bg-success/10 border border-success/20 text-success" 
                : "bg-warning/10 border border-warning/20 text-warning"
            }`}>
              {confidence === "high" 
                ? `Detected: ${formats.find(f => f.id === detectedFormat)?.label || detectedFormat}`
                : `Ambiguous — detected as ${formats.find(f => f.id === detectedFormat)?.label || detectedFormat} or Text.`
              }
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSample}
            className="text-xs font-bold text-blue hover:underline uppercase tracking-wider px-3 py-1.5"
          >
            Load Sample
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-bold text-text-3 hover:text-text border border-border bg-bg/50 hover:bg-bg rounded-xl px-3 py-1.5 transition-all"
          >
            <Upload size={14} />
            Upload File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button
            onClick={() => onChange("")}
            className="text-xs font-bold text-text-4 hover:text-red-400 uppercase tracking-wider px-3 py-1.5"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text..."
        className="w-full min-h-[140px] p-4 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue focus:border-transparent outline-none transition-all font-mono text-sm resize-y"
      />

      <p className="text-tiny text-text-4 uppercase tracking-wider font-semibold">
        Processing strictly locally in-browser · Max file import 1MB
      </p>
    </div>
  );
}
