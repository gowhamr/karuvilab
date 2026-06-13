"use client";

import React, { useState } from "react";
import { TextCursorInput, Binary, FileCode, Hash, Volume2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { MetricCard } from "@/components/ui/MetricCard";

interface SmartPanelProps {
  inputValue: string;
  bytes: Uint8Array;
  smartOutputs: any;
  utf8Validation: { isValid: boolean };
  caesarShiftVal: number;
  setCaesarShiftVal: (val: number) => void;
  encodeAllEntities: boolean;
  setEncodeAllEntities: (val: boolean) => void;
  unicodeEscapeStyle: string;
  setUnicodeEscapeStyle: (val: any) => void;
  playMorseAudio: (code: string) => void;
  charBreakdown: any[] | null;
}

export function SmartPanel({
  inputValue,
  bytes,
  smartOutputs,
  utf8Validation,
  caesarShiftVal,
  setCaesarShiftVal,
  encodeAllEntities,
  setEncodeAllEntities,
  unicodeEscapeStyle,
  setUnicodeEscapeStyle,
  playMorseAudio,
  charBreakdown
}: SmartPanelProps) {
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const toggleValueShow = (id: string) => setShowValues(prev => ({ ...prev, [id]: !prev[id] }));

  if (!inputValue) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Text Encodings */}
        <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
            <TextCursorInput size={14} className="text-blue" />
            Standard Text
          </h3>
          <div className="space-y-4">
            {[
              { id: "utf8", label: "UTF-8 Plain Text" },
              { id: "ascii", label: "ASCII" },
              { id: "latin1", label: "Latin-1" }
            ].map((row) => (
              <div key={row.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">{row.label}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleValueShow(row.id)}
                      className="p-1 text-text-4 hover:text-text rounded-md text-xs font-bold"
                    >
                      {showValues[row.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <CopyButton text={smartOutputs[row.id]?.error ? "" : (smartOutputs[row.id]?.value || "")} label="Copy" />
                  </div>
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex flex-col justify-center items-start gap-1">
                  {showValues[row.id] ? (
                    smartOutputs[row.id]?.error ? (
                      <span className="text-error font-sans font-bold text-tiny leading-tight">
                        {smartOutputs[row.id]?.error}
                      </span>
                    ) : (
                      <>
                        <span className="text-text-2">{smartOutputs[row.id]?.value || "—"}</span>
                        {row.id === "utf8" && !utf8Validation.isValid && (
                          <span className="text-xs text-warn font-sans font-bold flex items-center gap-1">
                            <AlertCircle size={10} />
                            Not valid UTF-8 text
                          </span>
                        )}
                      </>
                    )
                  ) : (
                    "••••••••••••••••"
                  )}
                </div>
              </div>
            ))}

            {showAdvanced && [
              { id: "utf16le", label: "UTF-16 LE" },
              { id: "utf16be", label: "UTF-16 BE" },
              { id: "utf32le", label: "UTF-32 LE" },
              { id: "utf32be", label: "UTF-32 BE" },
              { id: "win1252", label: "Windows-1252" }
            ].map((row) => (
              <div key={row.id} className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">{row.label}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleValueShow(row.id)}
                      className="p-1 text-text-4 hover:text-text rounded-md text-xs font-bold"
                    >
                      {showValues[row.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <CopyButton text={smartOutputs[row.id]?.error ? "" : (smartOutputs[row.id]?.value || "")} label="Copy" />
                  </div>
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex items-center">
                   {showValues[row.id] ? (smartOutputs[row.id]?.value || "—") : "••••••••••••••••"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Byte Layouts */}
        <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
            <Binary size={14} className="text-blue" />
            Byte Representations
          </h3>
          <div className="space-y-4">
            {[
              { id: "hex", label: "Hexadecimal" },
              { id: "bin", label: "Binary" },
              { id: "base64", label: "Base64" }
            ].map((row) => (
              <div key={row.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">{row.label}</span>
                  <CopyButton text={smartOutputs[row.id]?.error ? "" : (smartOutputs[row.id]?.value || "")} label="Copy" />
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all select-all min-h-10 flex items-center">
                  {smartOutputs[row.id]?.error ? (
                    <span className="text-error font-sans font-bold text-tiny leading-tight">
                      {smartOutputs[row.id]?.error}
                    </span>
                  ) : (
                    smartOutputs[row.id]?.value || "—"
                  )}
                </div>
              </div>
            ))}

            {showAdvanced && [
              { id: "decBytes", label: "Decimal Bytes" },
              { id: "oct", label: "Octal" },
              { id: "base32", label: "Base32" },
              { id: "base64url", label: "Base64 URL-Safe" }
            ].map((row) => (
              <div key={row.id} className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">{row.label}</span>
                  <CopyButton text={smartOutputs[row.id]?.value || ""} label="Copy" />
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex items-center">
                  {smartOutputs[row.id]?.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Toggle */}
        <div className="md:col-span-2 flex justify-center">
           <button 
             onClick={() => setShowAdvanced(!showAdvanced)}
             className="px-6 py-2 bg-bg border border-border rounded-full text-xs font-black uppercase tracking-widest text-text-3 hover:text-blue hover:border-blue/30 transition-all shadow-sm"
           >
             {showAdvanced ? "Hide Advanced Formats" : "Show All 20+ Formats"}
           </button>
        </div>

        {/* Web Formats - Only if advanced */}
        {showAdvanced && (
          <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm animate-in zoom-in-95 duration-500">
            <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
              <FileCode size={14} className="text-blue" />
              Web Encodings
            </h3>
            <div className="space-y-4">
              {[
                { id: "urlEncoded", label: "URL Percent Encoded" },
                { id: "htmlEntities", label: "HTML Entities" }
              ].map((row) => (
                <div key={row.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-2">{row.label}</span>
                    <div className="flex items-center gap-2">
                      {row.id === "htmlEntities" && (
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-bold text-text-4">
                          <input 
                            type="checkbox" 
                            checked={encodeAllEntities} 
                            onChange={(e) => setEncodeAllEntities(e.target.checked)} 
                            className="w-3.5 h-3.5 rounded border-border text-blue focus:ring-blue"
                          />
                          All
                        </label>
                      )}
                      <CopyButton text={smartOutputs[row.id]?.error ? "" : (smartOutputs[row.id]?.value || "")} label="Copy" />
                    </div>
                  </div>
                  <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex items-center">
                    {smartOutputs[row.id]?.value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Developer & Ciphers - Only if advanced */}
        {showAdvanced && (
          <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm animate-in zoom-in-95 duration-500">
            <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
              <Hash size={14} className="text-blue" />
              Developer & Ciphers
            </h3>
            <div className="space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">Unicode Escapes</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={unicodeEscapeStyle}
                      onChange={(e) => setUnicodeEscapeStyle(e.target.value as any)}
                      className="bg-bg border border-border rounded-lg px-2 py-0.5 text-xs font-bold text-text outline-none focus:ring-1 focus:ring-blue"
                    >
                      <option value="js">JavaScript (\uXXXX)</option>
                      <option value="python">Python (\xXX)</option>
                      <option value="css">CSS (\XXXXXX)</option>
                      <option value="rust">{"Rust (\\u{X})"}</option>
                      <option value="go">Go (\UXXXXXXXX)</option>
                    </select>
                    <CopyButton text={smartOutputs.unicodeEscape?.value || ""} label="Copy" />
                  </div>
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex items-center">
                  {smartOutputs.unicodeEscape?.value || "—"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <div className="space-y-1">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">ROT13</span>
                      <CopyButton text={smartOutputs.rot13?.value || ""} label="Copy" />
                   </div>
                   <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs truncate">
                      {smartOutputs.rot13?.value || "—"}
                   </div>
                 </div>
                 <div className="space-y-1">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">Atbash</span>
                      <CopyButton text={smartOutputs.atbash?.value || ""} label="Copy" />
                   </div>
                   <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs truncate">
                      {smartOutputs.atbash?.value || "—"}
                   </div>
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">Caesar Cipher</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-blue tabular-nums">+{caesarShiftVal}</span>
                    <input 
                      type="range" min="1" max="25" 
                      value={caesarShiftVal} 
                      onChange={(e) => setCaesarShiftVal(parseInt(e.target.value))} 
                      className="w-20 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-blue"
                    />
                    <CopyButton text={smartOutputs.caesar?.value || ""} label="Copy" />
                  </div>
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex items-center">
                  {smartOutputs.caesar?.value || "—"}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-2">Morse Code</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playMorseAudio(smartOutputs.morse?.value || "")}
                      className="p-1.5 hover:bg-blue/10 border border-blue/20 rounded-lg text-blue transition-colors"
                    >
                      <Volume2 size={13} />
                    </button>
                    <CopyButton text={smartOutputs.morse?.value || ""} label="Copy" />
                  </div>
                </div>
                <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-10 flex items-center">
                  {smartOutputs.morse?.value || "—"}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Characters" value={inputValue.length.toString()} icon={TextCursorInput} />
        <MetricCard label="UTF-8 Bytes" value={bytes.length.toString()} icon={Binary} />
        <MetricCard label="UTF-16 Bytes" value={(inputValue.length * 2).toString()} icon={Binary} />
        <MetricCard label="Word Count" value={inputValue.trim() ? inputValue.trim().split(/\s+/).length.toString() : "0"} icon={Hash} />
      </div>
    </div>
  );
}
