"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { 
  Binary, Hash, TextCursorInput, List, FileCode, ShieldCheck, 
  AlertCircle, ArrowLeftRight, Copy, Check, RotateCcw, Upload, 
  Play, Volume2, HelpCircle, Eye, EyeOff
} from "lucide-react";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { MetricCard } from "@/components/ui/MetricCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { 
  detectFormat, decodeToBytes, encodeFromBytes, floatToIEEE754, 
  ieee754ToFloat, decodeJWT, caesarShift, atbash, MORSE_MAP 
} from "./helpers";
import { useToast } from "@/components/ui/Toast";

type TabMode = "smart" | "number" | "encode" | "text" | "jwt";

const INPUT_FORMATS = [
  { id: "auto", label: "Auto-Detect" },
  { id: "utf8", label: "Plain Text (UTF-8)" },
  { id: "ascii", label: "ASCII" },
  { id: "latin1", label: "Latin-1 (ISO-8859-1)" },
  { id: "win1252", label: "Windows-1252" },
  { id: "utf16le", label: "UTF-16 LE" },
  { id: "utf16be", label: "UTF-16 BE" },
  { id: "utf32le", label: "UTF-32 LE" },
  { id: "utf32be", label: "UTF-32 BE" },
  { id: "hex", label: "Hexadecimal" },
  { id: "bin", label: "Binary" },
  { id: "base32", label: "Base32" },
  { id: "base64", label: "Base64 Standard" },
  { id: "base64url", label: "Base64 URL-Safe" },
  { id: "url-encoded", label: "URL Encoded" },
  { id: "html-entities", label: "HTML Entities" },
  { id: "unicode-escape", label: "Unicode Escapes" },
  { id: "dec-bytes", label: "Decimal Bytes" },
  { id: "oct", label: "Octal Bytes" },
  { id: "morse", label: "Morse Code" },
  { id: "rot13", label: "ROT13" }
];

const ENCODE_DECODE_FORMATS = [
  { id: "utf8", label: "Plain Text (UTF-8)" },
  { id: "ascii", label: "ASCII" },
  { id: "latin1", label: "Latin-1 (ISO-8859-1)" },
  { id: "win1252", label: "Windows-1252" },
  { id: "utf16le", label: "UTF-16 LE" },
  { id: "utf16be", label: "UTF-16 BE" },
  { id: "utf32le", label: "UTF-32 LE" },
  { id: "utf32be", label: "UTF-32 BE" },
  { id: "hex", label: "Hexadecimal" },
  { id: "bin", label: "Binary (Base 2)" },
  { id: "oct", label: "Octal (Base 8)" },
  { id: "dec-bytes", label: "Decimal Bytes" },
  { id: "base64", label: "Base64 Standard" },
  { id: "base64url", label: "Base64 URL-Safe" },
  { id: "base32", label: "Base32" },
  { id: "url-encoded", label: "URL Encoded" },
  { id: "html-entities", label: "HTML Entities" },
  { id: "unicode-escape", label: "Unicode Escapes" },
  { id: "morse", label: "Morse Code" },
  { id: "rot13", label: "ROT13" },
  { id: "atbash", label: "Atbash Cipher" }
];

const SAMPLES = {
  text: "Hello World! 😀 Welcome to KaruviLab.",
  hex: "48 65 6C 6C 6F 20 57 6F 72 6C 64 21",
  bin: "01001000 01100101 01101100 01101100 01101111",
  base64: "U0dWc2JHOGcgVjI5eWJHUjU=",
  url: "Hello%20World%21%20%F0%9F%98%80",
  html: "&lt;div class=&quot;container&quot;&gt;Hello &amp; Welcome&lt;/div&gt;",
  escape: "\\u0048\\u0065\\u006C\\u006C\\u006F\\u{1F600}",
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjQ5NDQwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
} as const;

export default function NumeralConverterClient() {
  const [activeTab, setActiveTab] = useState<TabMode>("smart");
  const { toast } = useToast();
  
  // Input states
  const [inputValue, setInputValue] = useState<string>(SAMPLES.text || "");
  const [inputFormat, setInputFormat] = useState("auto");
  
  // Parameters
  const [caesarShiftVal, setCaesarShiftVal] = useState(3);
  const [encodeAllEntities, setEncodeAllEntities] = useState(false);
  const [unicodeEscapeStyle, setUnicodeEscapeStyle] = useState<"js" | "python" | "c" | "css" | "rust" | "go">("js");
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  
  // Encode/Decode states
  const [encodeFromFormat, setEncodeFromFormat] = useState("utf8");
  const [encodeToFormat, setEncodeToFormat] = useState("base64");
  
  // Number mode states
  const [numberDec, setNumberDec] = useState("42");
  const [numberBin, setNumberBin] = useState("101010");
  const [numberOct, setNumberOct] = useState("52");
  const [numberHex, setNumberHex] = useState("2A");
  const [numberText, setNumberText] = useState("B");
  const [numberBaseN, setNumberBaseN] = useState("1A");
  const [customBase, setCustomBase] = useState(12);
  const [floatValue, setFloatValue] = useState("3.14159");
  const [floatPrecision, setFloatPrecision] = useState<"single" | "double">("single");

  // File Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success tooltips for copying
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  // Auto-detection
  const { detectedFormat, confidence } = useMemo(() => {
    if (inputFormat !== "auto") {
      return { detectedFormat: inputFormat, confidence: "high" as const };
    }
    const det = detectFormat(inputValue);
    return { detectedFormat: det.format, confidence: det.confidence };
  }, [inputValue, inputFormat]);

  // Decode to raw bytes
  const bytes = useMemo(() => {
    return decodeToBytes(inputValue, detectedFormat);
  }, [inputValue, detectedFormat]);

  // Handle format toggle visibility
  const toggleValueShow = (rowId: string) => {
    setShowValues(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  // Safe audio playback for Morse Code
  const playMorseAudio = (morseCode: string) => {
    if (typeof window === "undefined" || !morseCode) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let time = ctx.currentTime;
      const unit = 0.08; // Duration of a dot in seconds

      morseCode.split("").forEach((char) => {
        if (char === "." || char === "-") {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, time);
          
          const dur = char === "." ? unit : unit * 3;
          gainNode.gain.setValueAtTime(0.2, time);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.01);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(time);
          osc.stop(time + dur);
          time += dur + unit;
        } else if (char === " ") {
          time += unit * 2;
        } else if (char === "/") {
          time += unit * 4;
        }
      });
    } catch (e) {
      console.error("Audio Context Failed", e);
    }
  };

  // Custom clipboard handler
  const copyToClipboard = (text: string, rowId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRow(rowId);
      setTimeout(() => setCopiedRow(null), 1500);
    });
  };

  // File loading
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
        setInputValue(result);
      } else if (result instanceof ArrayBuffer) {
        // Fallback to converting raw bytes to hex representation
        const u8 = new Uint8Array(result);
        const hex = Array.from(u8).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
        setInputFormat("hex");
        setInputValue(hex);
      }
    };
    
    // Choose reading method based on type
    if (file.type.startsWith("text/") || ["json", "xml", "html", "css", "js", "txt"].includes(file.name.split(".").pop() || "")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Helper to safely get output value or return error message
  const getOutput = useCallback((targetBytes: Uint8Array, format: string, options?: any) => {
    try {
      return { value: encodeFromBytes(targetBytes, format, options), error: "" };
    } catch (err: any) {
      return { value: "", error: err.message || "Encoding failed" };
    }
  }, []);

  const utf8Validation = useMemo(() => {
    if (bytes.length === 0) return { isValid: true };
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return { isValid: true };
    } catch {
      return { isValid: false };
    }
  }, [bytes]);

  // Smart Outputs
  const smartOutputs = useMemo(() => {
    if (bytes.length === 0) return {};
    return {
      utf8: getOutput(bytes, "utf8"),
      ascii: getOutput(bytes, "ascii"),
      utf16le: getOutput(bytes, "utf16le"),
      utf16be: getOutput(bytes, "utf16be"),
      utf32le: getOutput(bytes, "utf32le"),
      utf32be: getOutput(bytes, "utf32be"),
      latin1: getOutput(bytes, "latin1"),
      win1252: getOutput(bytes, "win1252"),
      bin: getOutput(bytes, "bin"),
      oct: getOutput(bytes, "oct"),
      decBytes: getOutput(bytes, "dec-bytes"),
      hex: getOutput(bytes, "hex"),
      base64: getOutput(bytes, "base64"),
      base64url: getOutput(bytes, "base64url"),
      base32: getOutput(bytes, "base32"),
      urlEncoded: getOutput(bytes, "url-encoded"),
      htmlEntities: getOutput(bytes, "html-entities", { encodeAll: encodeAllEntities }),
      unicodeEscape: getOutput(bytes, "unicode-escape", { escapeStyle: unicodeEscapeStyle }),
      unicodeCodepoints: getOutput(bytes, "unicode-codepoints"),
      rot13: getOutput(bytes, "rot13"),
      caesar: getOutput(bytes, "caesar", { shift: caesarShiftVal }),
      atbash: getOutput(bytes, "atbash"),
      morse: getOutput(bytes, "morse")
    };
  }, [bytes, caesarShiftVal, encodeAllEntities, unicodeEscapeStyle, getOutput]);

  // Decode/Encode Mode Target Output
  const encodeDecodeResult = useMemo(() => {
    if (!inputValue) return { output: "", error: "" };
    try {
      const decodedBytes = decodeToBytes(inputValue, encodeFromFormat);
      if (decodedBytes.length === 0) return { output: "", error: "No decodable input content." };
      const output = encodeFromBytes(decodedBytes, encodeToFormat, { 
        shift: caesarShiftVal, 
        encodeAll: encodeAllEntities, 
        escapeStyle: unicodeEscapeStyle 
      });
      return { output, error: "" };
    } catch (err: any) {
      return { output: "", error: err.message || "Conversion failed" };
    }
  }, [inputValue, encodeFromFormat, encodeToFormat, caesarShiftVal, encodeAllEntities, unicodeEscapeStyle]);

  // JWT Decoding
  const jwtDecoded = useMemo(() => {
    if (activeTab !== "jwt" || !inputValue) return null;
    return decodeJWT(inputValue);
  }, [inputValue, activeTab]);

  // Number Mode Handlers
  const handleNumberChange = useCallback((id: string, value: string) => {
    try {
      let decVal = BigInt(0);
      if (id === "dec") {
        if (!value) return;
        decVal = BigInt(value);
      } else if (id === "bin") {
        const clean = value.replace(/[^01]/g, "");
        if (!clean) return;
        decVal = BigInt("0b" + clean);
      } else if (id === "oct") {
        const clean = value.replace(/[^0-7]/g, "");
        if (!clean) return;
        decVal = BigInt("0o" + clean);
      } else if (id === "hex") {
        const clean = value.replace(/[^0-9a-fA-F]/g, "");
        if (!clean) return;
        decVal = BigInt("0x" + clean);
      } else if (id === "text") {
        if (!value) return;
        decVal = BigInt(value.codePointAt(0) || 0);
      }

      setNumberDec(decVal.toString(10));
      setNumberBin(decVal.toString(2));
      setNumberOct(decVal.toString(8));
      setNumberHex(decVal.toString(16).toUpperCase());
      setNumberText(decVal < 1114112n ? String.fromCodePoint(Number(decVal)) : "");
      setNumberBaseN(decVal.toString(customBase).toUpperCase());
    } catch {
      // Ignored parsing error
    }
  }, [customBase]);

  // Custom Base shift
  useEffect(() => {
    try {
      if (numberDec) {
        setNumberBaseN(BigInt(numberDec).toString(customBase).toUpperCase());
      }
    } catch {}
  }, [customBase, numberDec]);

  // Single number roman converter
  const romanVal = useMemo(() => {
    try {
      const num = parseInt(numberDec, 10);
      if (isNaN(num) || num < 1 || num > 3999) return "N/A";
      const roman: Record<string, number> = {
        M: 1000, CM: 900, D: 500, CD: 400,
        C: 100, XC: 90, L: 50, XL: 40,
        X: 10, IX: 9, V: 5, IV: 4, I: 1
      };
      let str = "";
      let n = num;
      for (const i of Object.keys(roman)) {
        const val = roman[i]!;
        const q = Math.floor(n / val);
        n -= q * val;
        str += i.repeat(q);
      }
      return str;
    } catch {
      return "N/A";
    }
  }, [numberDec]);

  // IEEE 754 Float structure
  const ieeeFloat = useMemo(() => {
    const parsed = parseFloat(floatValue);
    if (isNaN(parsed)) return null;
    return floatToIEEE754(parsed, floatPrecision === "double");
  }, [floatValue, floatPrecision]);

  const toggleFloatBit = (bitIndex: number) => {
    if (!ieeeFloat) return;
    const isDouble = floatPrecision === "double";
    const signBit = bitIndex === 0 ? (ieeeFloat.sign === 1 ? 0 : 1) : ieeeFloat.sign;
    
    let expBits = ieeeFloat.exponent;
    let mantBits = ieeeFloat.mantissa;
    
    if (bitIndex > 0 && bitIndex <= (isDouble ? 11 : 8)) {
      const idx = bitIndex - 1;
      const arr = expBits.split("");
      arr[idx] = arr[idx] === "1" ? "0" : "1";
      expBits = arr.join("");
    } else if (bitIndex > (isDouble ? 11 : 8)) {
      const idx = bitIndex - 1 - (isDouble ? 11 : 8);
      const arr = mantBits.split("");
      arr[idx] = arr[idx] === "1" ? "0" : "1";
      mantBits = arr.join("");
    }

    const newVal = ieee754ToFloat({ sign: signBit, exponent: expBits, mantissa: mantBits }, isDouble);
    setFloatValue(newVal.toString());
  };

  // Character breakdown calculation
  const charBreakdown = useMemo(() => {
    if (bytes.length === 0 || bytes.length > 200) return null;
    try {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      return Array.from(text).map((c) => {
        const code = c.codePointAt(0) || 0;
        let utf8BytesHex = "";
        try {
          const u8 = new TextEncoder().encode(c);
          utf8BytesHex = Array.from(u8).map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
        } catch {}
        
        return {
          char: c,
          dec: code,
          hex: `0x${code.toString(16).toUpperCase()}`,
          bin: code.toString(2).padStart(8, "0").replace(/(.{4})/g, "$1 ").trim(),
          unicode: `U+${code.toString(16).padStart(4, "0").toUpperCase()}`,
          utf8: utf8BytesHex
        };
      });
    } catch {
      return null;
    }
  }, [bytes]);

  return (
    <div className="space-y-8">
      {/* 5-Tab Navigation bar */}
      <div className="flex overflow-x-auto p-1 bg-bg border border-border rounded-2xl w-full scrollbar-none">
        {[
          { id: "smart", label: "Smart Converter", icon: ArrowLeftRight },
          { id: "number", label: "Single Number", icon: Hash },
          { id: "encode", label: "Encode ⇄ Decode", icon: ArrowLeftRight },
          { id: "text", label: "Text / Bytes", icon: TextCursorInput },
          { id: "jwt", label: "JWT Decoder", icon: ShieldCheck }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as TabMode);
                // Load JWT sample or other sample if empty
                if (t.id === "jwt") {
                  setInputValue(SAMPLES.jwt);
                } else if (!inputValue || inputValue === SAMPLES.jwt) {
                  setInputValue(SAMPLES.text);
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
                activeTab === t.id 
                  ? "bg-blue text-white shadow-lg shadow-blue/20" 
                  : "text-text-3 hover:text-text hover:bg-bg/50"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab !== "number" && (
        <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-6">
          {/* Input Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-2">Input Mode:</span>
              <select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-black text-text outline-none focus:ring-2 focus:ring-blue"
              >
                {INPUT_FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>

              {inputFormat === "auto" && (
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                  confidence === "high" 
                    ? "bg-success/10 border border-success/20 text-success" 
                    : "bg-warning/10 border border-warning/20 text-warning"
                }`}>
                  {confidence === "high" 
                    ? `Detected: ${INPUT_FORMATS.find(f => f.id === detectedFormat)?.label || detectedFormat}`
                    : `Ambiguous — detected as ${INPUT_FORMATS.find(f => f.id === detectedFormat)?.label || detectedFormat} or Text. Select format to override.`
                  }
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeTab === "jwt") setInputValue(SAMPLES.jwt);
                  else setInputValue(SAMPLES.text);
                }}
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
                onClick={() => setInputValue("")}
                className="text-xs font-bold text-text-4 hover:text-red-400 uppercase tracking-wider px-3 py-1.5"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Main Input Textarea */}
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text..."
            className="w-full min-h-[140px] p-4 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue focus:border-transparent outline-none transition-all font-mono text-sm resize-y"
          />

          <p className="text-[11px] text-text-4 uppercase tracking-wider font-semibold">
            Processing strictly locally in-browser · Max file import 1MB
          </p>
        </div>
      )}

      {/* --- SMART CONVERTER MODE --- */}
      {activeTab === "smart" && inputValue && (
        <div className="space-y-8">
          {/* Outputs grouped by category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section A: Text Output */}
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
                <TextCursorInput size={14} className="text-blue" />
                Text Encodings
              </h3>
              <div className="space-y-4">
                {[
                  { id: "utf8", label: "UTF-8 Plain Text" },
                  { id: "ascii", label: "ASCII" },
                  { id: "utf16le", label: "UTF-16 LE" },
                  { id: "utf16be", label: "UTF-16 BE" },
                  { id: "utf32le", label: "UTF-32 LE" },
                  { id: "utf32be", label: "UTF-32 BE" },
                  { id: "latin1", label: "Latin-1 (ISO-8859-1)" },
                  { id: "win1252", label: "Windows-1252" }
                ].map((row) => (
                  <div key={row.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">{row.label}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleValueShow(row.id)}
                          className="p-1 text-text-4 hover:text-text rounded-md text-[10px] font-bold"
                          title="Toggle visibility"
                        >
                          {showValues[row.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <CopyButton text={smartOutputs[row.id as keyof typeof smartOutputs]?.error ? "" : (smartOutputs[row.id as keyof typeof smartOutputs]?.value || "")} />
                      </div>
                    </div>
                    <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex flex-col justify-center items-start gap-1">
                      {showValues[row.id] ? (
                        smartOutputs[row.id as keyof typeof smartOutputs]?.error ? (
                          <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">
                            {smartOutputs[row.id as keyof typeof smartOutputs]?.error}
                          </span>
                        ) : (
                          <>
                            <span className="text-text-2">{smartOutputs[row.id as keyof typeof smartOutputs]?.value || "—"}</span>
                            {row.id === "utf8" && !utf8Validation.isValid && (
                              <span className="text-[10px] text-warning font-sans font-bold flex items-center gap-1">
                                <AlertCircle size={10} />
                                Not valid UTF-8 text — showing raw bytes
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
              </div>
            </div>

            {/* Section B: Byte Outputs */}
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
                <Binary size={14} className="text-blue" />
                Byte Layouts
              </h3>
              <div className="space-y-4">
                {[
                  { id: "hex", label: "Hexadecimal (Base-16)" },
                  { id: "bin", label: "Binary (Base-2)" },
                  { id: "decBytes", label: "Decimal Bytes" },
                  { id: "oct", label: "Octal (Base-8)" }
                ].map((row) => (
                  <div key={row.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">{row.label}</span>
                      <CopyButton text={smartOutputs[row.id as keyof typeof smartOutputs]?.error ? "" : (smartOutputs[row.id as keyof typeof smartOutputs]?.value || "")} />
                    </div>
                    <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all select-all min-h-[38px] flex items-center">
                      {smartOutputs[row.id as keyof typeof smartOutputs]?.error ? (
                        <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">
                          {smartOutputs[row.id as keyof typeof smartOutputs]?.error}
                        </span>
                      ) : (
                        smartOutputs[row.id as keyof typeof smartOutputs]?.value || "—"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Web Encodings */}
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
                <FileCode size={14} className="text-blue" />
                Web Formats
              </h3>
              <div className="space-y-4">
                {[
                  { id: "base64", label: "Base64 Standard" },
                  { id: "base64url", label: "Base64 URL-Safe" },
                  { id: "base32", label: "Base32" },
                  { id: "urlEncoded", label: "URL Percent Encoded" },
                  { id: "htmlEntities", label: "HTML Entities" }
                ].map((row) => (
                  <div key={row.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">{row.label}</span>
                      <div className="flex items-center gap-2">
                        {row.id === "htmlEntities" && (
                          <label className="flex items-center gap-1 cursor-pointer select-none text-[10px] font-bold text-text-3">
                            <input 
                              type="checkbox" 
                              checked={encodeAllEntities} 
                              onChange={(e) => setEncodeAllEntities(e.target.checked)} 
                              className="rounded border-border text-blue focus:ring-blue"
                            />
                            Encode All
                          </label>
                        )}
                        <CopyButton text={smartOutputs[row.id as keyof typeof smartOutputs]?.error ? "" : (smartOutputs[row.id as keyof typeof smartOutputs]?.value || "")} />
                      </div>
                    </div>
                    <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                      {smartOutputs[row.id as keyof typeof smartOutputs]?.error ? (
                        <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">
                          {smartOutputs[row.id as keyof typeof smartOutputs]?.error}
                        </span>
                      ) : (
                        smartOutputs[row.id as keyof typeof smartOutputs]?.value || "—"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section D: Developer & Cipher Group */}
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2 mb-2">
                <Hash size={14} className="text-blue" />
                Developer & Ciphers
              </h3>
              <div className="space-y-4">
                
                {/* Unicode Escapes */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-2">Developer Escape Sequences</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={unicodeEscapeStyle}
                        onChange={(e) => setUnicodeEscapeStyle(e.target.value as any)}
                        className="bg-bg border border-border rounded-lg px-2 py-0.5 text-[10px] font-bold text-text outline-none focus:ring-1 focus:ring-blue"
                      >
                        <option value="js">JavaScript (\uXXXX)</option>
                        <option value="python">Python (\xXX)</option>
                        <option value="css">CSS (\XXXXXX)</option>
                        <option value="rust">{"Rust (\\u{X})"}</option>
                        <option value="go">Go (\UXXXXXXXX)</option>
                      </select>
                      <CopyButton text={smartOutputs.unicodeEscape?.error ? "" : (smartOutputs.unicodeEscape?.value || "")} />
                    </div>
                  </div>
                  <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                    {smartOutputs.unicodeEscape?.error ? (
                      <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">{smartOutputs.unicodeEscape?.error}</span>
                    ) : (
                      smartOutputs.unicodeEscape?.value || "—"
                    )}
                  </div>
                </div>

                {/* Unicode Codepoints */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-2">Unicode Code Points (U+XXXX)</span>
                    <CopyButton text={smartOutputs.unicodeCodepoints?.error ? "" : (smartOutputs.unicodeCodepoints?.value || "")} />
                  </div>
                  <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                    {smartOutputs.unicodeCodepoints?.error ? (
                      <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">{smartOutputs.unicodeCodepoints?.error}</span>
                    ) : (
                      smartOutputs.unicodeCodepoints?.value || "—"
                    )}
                  </div>
                </div>

                {/* ROT13 & Atbash */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">ROT13</span>
                      <CopyButton text={smartOutputs.rot13?.error ? "" : (smartOutputs.rot13?.value || "")} />
                    </div>
                    <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                      {smartOutputs.rot13?.error ? (
                        <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">{smartOutputs.rot13?.error}</span>
                      ) : (
                        smartOutputs.rot13?.value || "—"
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-2">Atbash</span>
                      <CopyButton text={smartOutputs.atbash?.error ? "" : (smartOutputs.atbash?.value || "")} />
                    </div>
                    <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                      {smartOutputs.atbash?.error ? (
                        <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">{smartOutputs.atbash?.error}</span>
                      ) : (
                        smartOutputs.atbash?.value || "—"
                      )}
                    </div>
                  </div>
                </div>

                {/* Caesar Cipher & Morse */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-2">Caesar Cipher</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-text-4">Shift: {caesarShiftVal}</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="25" 
                        value={caesarShiftVal} 
                        onChange={(e) => setCaesarShiftVal(parseInt(e.target.value))} 
                        className="w-16 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-blue"
                      />
                      <CopyButton text={smartOutputs.caesar?.error ? "" : (smartOutputs.caesar?.value || "")} />
                    </div>
                  </div>
                  <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                    {smartOutputs.caesar?.error ? (
                      <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">{smartOutputs.caesar?.error}</span>
                    ) : (
                      smartOutputs.caesar?.value || "—"
                    )}
                  </div>
                </div>

                {/* Morse Code */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-2">Morse Code</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playMorseAudio(smartOutputs.morse?.value || "")}
                        className="p-1 hover:bg-bg border border-border rounded-lg text-blue"
                        title="Play Audio"
                      >
                        <Volume2 size={13} />
                      </button>
                      <CopyButton text={smartOutputs.morse?.error ? "" : (smartOutputs.morse?.value || "")} />
                    </div>
                  </div>
                  <div className="bg-bg border border-border px-3 py-2.5 rounded-xl font-mono text-xs break-all min-h-[38px] flex items-center">
                    {smartOutputs.morse?.error ? (
                      <span className="text-red-400 font-sans font-bold text-[11px] leading-tight">{smartOutputs.morse?.error}</span>
                    ) : (
                      smartOutputs.morse?.value || "—"
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Section F: Metadata Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Character Count" value={inputValue.length.toString()} icon={TextCursorInput} />
            <MetricCard label="UTF-8 Byte Count" value={bytes.length.toString()} icon={List} />
            <MetricCard label="UTF-16 Byte Count" value={(inputValue.length * 2).toString()} icon={List} />
            <MetricCard label="Word Count" value={inputValue.trim() ? inputValue.trim().split(/\s+/).length.toString() : "0"} icon={Hash} />
          </div>

          {/* Character breakdown grid */}
          {charBreakdown && (
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm overflow-hidden">
              <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2">
                <List size={14} className="text-blue" />
                Character-by-Character Breakdown
              </h3>
              <div className="overflow-x-auto max-h-[300px] scrollbar-thin">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-3">
                      <th className="py-2 px-3">Char</th>
                      <th className="py-2 px-3">Unicode</th>
                      <th className="py-2 px-3">Decimal</th>
                      <th className="py-2 px-3">Hex</th>
                      <th className="py-2 px-3">UTF-8 Bytes</th>
                      <th className="py-2 px-3">Binary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charBreakdown.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-bg/40">
                        <td className="py-2.5 px-3 font-sans font-bold text-text-2 bg-bg/20 text-center rounded-lg">{row.char === " " ? "␣" : row.char}</td>
                        <td className="py-2.5 px-3 text-blue font-bold">{row.unicode}</td>
                        <td className="py-2.5 px-3 text-text-3">{row.dec}</td>
                        <td className="py-2.5 px-3 text-text-3">{row.hex}</td>
                        <td className="py-2.5 px-3 text-success font-semibold">{row.utf8}</td>
                        <td className="py-2.5 px-3 text-text-4">{row.bin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SINGLE NUMBER MODE --- */}
      {activeTab === "number" && (
        <div className="space-y-8">
          <div className="bg-surface border border-border p-6 rounded-4xl space-y-6 shadow-sm">
            <h3 className="text-xs font-black text-text-3 uppercase tracking-widest border-b border-border/50 pb-2 flex items-center gap-1.5">
              <Hash size={14} className="text-blue" />
              Base-N Base Conversion
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                {/* Inputs for major bases */}
                {[
                  { id: "dec", label: "Decimal (Base-10)", val: numberDec },
                  { id: "bin", label: "Binary (Base-2)", val: numberBin },
                  { id: "oct", label: "Octal (Base-8)", val: numberOct },
                  { id: "hex", label: "Hexadecimal (Base-16)", val: numberHex },
                  { id: "text", label: "ASCII Text Symbol", val: numberText }
                ].map((row) => (
                  <div key={row.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`num-${row.id}`} className="text-xs font-bold text-text-2">{row.label}</label>
                      {row.val && <CopyButton text={row.val} />}
                    </div>
                    <input
                      id={`num-${row.id}`}
                      value={row.val}
                      onChange={(e) => handleNumberChange(row.id, e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Custom Base and Metrics */}
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5 bg-bg/30 border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-text-3 uppercase tracking-wider">Custom Base Conversion</span>
                    <span className="text-xs font-black text-blue">Base {customBase}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="range" 
                      min="2" 
                      max="36" 
                      value={customBase} 
                      onChange={(e) => setCustomBase(parseInt(e.target.value))} 
                      className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-blue"
                    />
                    <input
                      type="number"
                      min="2"
                      max="36"
                      value={customBase}
                      onChange={(e) => setCustomBase(Math.min(36, Math.max(2, parseInt(e.target.value) || 2)))}
                      className="w-14 bg-bg border border-border rounded-lg px-2 py-1 text-center font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-text-3">Result:</span>
                    {numberBaseN && <CopyButton text={numberBaseN} />}
                  </div>
                  <input
                    value={numberBaseN}
                    onChange={(e) => {
                      setNumberBaseN(e.target.value.toUpperCase());
                      try {
                        const parsed = BigInt(parseInt(e.target.value, customBase));
                        setNumberDec(parsed.toString(10));
                        setNumberBin(parsed.toString(2));
                        setNumberOct(parsed.toString(8));
                        setNumberHex(parsed.toString(16).toUpperCase());
                        setNumberText(parsed < 1114112n ? String.fromCodePoint(Number(parsed)) : "");
                      } catch {}
                    }}
                    className="w-full bg-bg border border-border rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue outline-none mt-1"
                  />
                </div>

                {/* Single Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Roman Numeral" value={romanVal} icon={Hash} />
                  <MetricCard 
                    label="Two's Complement (8-bit)" 
                    value={numberDec ? (() => {
                      const val = parseInt(numberDec, 10);
                      if (isNaN(val) || val < -128 || val > 127) return "Out of range";
                      const byte = val < 0 ? (256 + val) : val;
                      return byte.toString(2).padStart(8, "0");
                    })() : "—"} 
                    icon={Binary} 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* IEEE 754 Floating Point Visualizer */}
          <div className="bg-surface border border-border p-6 rounded-4xl space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between border-b border-border/50 pb-2 gap-4">
              <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5">
                <Binary size={14} className="text-blue" />
                IEEE 754 Floating Point Visualizer
              </h3>
              
              <div className="flex items-center gap-2">
                {(["single", "double"] as const).map((prec) => (
                  <button
                    key={prec}
                    onClick={() => setFloatPrecision(prec)}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                      floatPrecision === prec 
                        ? "bg-blue text-white shadow-sm" 
                        : "bg-bg border border-border text-text-3 hover:text-text"
                    }`}
                  >
                    {prec === "single" ? "Single (32-bit)" : "Double (64-bit)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="float-input" className="text-xs font-bold text-text-2">Float Number:</label>
                <input 
                  id="float-input"
                  type="text" 
                  value={floatValue} 
                  onChange={(e) => setFloatValue(e.target.value)}
                  className="bg-bg border border-border rounded-xl px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue outline-none w-44"
                />
              </div>

              {ieeeFloat && (
                <div className="space-y-4">
                  {/* Bit legend info */}
                  <div className="flex flex-wrap gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-red-400 inline-block"></span> Sign bit</span>
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block"></span> Exponent ({floatPrecision === "single" ? "8" : "11"} bits)</span>
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-blue-400 inline-block"></span> Mantissa ({floatPrecision === "single" ? "23" : "52"} bits)</span>
                  </div>

                  {/* Interactive Bits Grid */}
                  <div className="flex flex-wrap gap-1.5 bg-bg/50 border border-border p-4 rounded-2xl justify-center sm:justify-start">
                    {/* Render sign bit */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => toggleFloatBit(0)}
                        className="w-8 h-8 rounded-lg bg-red-400 text-white flex items-center justify-center font-mono font-black text-sm hover:scale-105 transition-all shadow-sm"
                      >
                        {ieeeFloat.sign}
                      </button>
                      <span className="text-[8px] font-bold text-text-4">S</span>
                    </div>

                    {/* Render exponent bits */}
                    {ieeeFloat.exponent.split("").map((bit, idx) => {
                      const bitIdx = idx + 1;
                      return (
                        <div key={`exp-${idx}`} className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => toggleFloatBit(bitIdx)}
                            className="w-8 h-8 rounded-lg bg-amber-400 text-white flex items-center justify-center font-mono font-black text-sm hover:scale-105 transition-all shadow-sm"
                          >
                            {bit}
                          </button>
                          <span className="text-[8px] font-bold text-text-4">E{idx}</span>
                        </div>
                      );
                    })}

                    {/* Render mantissa bits */}
                    {ieeeFloat.mantissa.split("").map((bit, idx) => {
                      const bitIdx = idx + 1 + ieeeFloat.exponent.length;
                      // Display subset on double precision to avoid clogging viewport
                      if (floatPrecision === "double" && idx > 20 && idx < 48) {
                        if (idx === 21) {
                          return (
                            <div key="dots" className="flex items-center justify-center w-8 h-8 text-text-4 font-black">
                              ...
                            </div>
                          );
                        }
                        return null;
                      }
                      return (
                        <div key={`mant-${idx}`} className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => toggleFloatBit(bitIdx)}
                            className="w-8 h-8 rounded-lg bg-blue-400 text-white flex items-center justify-center font-mono font-black text-sm hover:scale-105 transition-all shadow-sm"
                          >
                            {bit}
                          </button>
                          <span className="text-[8px] font-bold text-text-4">M{idx}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                    <div className="bg-bg/40 border border-border p-3 rounded-xl">
                      <span className="font-bold text-text-3">Sign:</span> {ieeeFloat.sign === 1 ? "-" : "+"} (negative bit set)
                    </div>
                    <div className="bg-bg/40 border border-border p-3 rounded-xl">
                      <span className="font-bold text-text-3">Exponent:</span> {ieeeFloat.exponentVal} (offset adjusted)
                    </div>
                    <div className="bg-bg/40 border border-border p-3 rounded-xl">
                      <span className="font-bold text-text-3">Mantissa value:</span> {ieeeFloat.mantissaVal.toFixed(6)} (1 + fraction)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ENCODE / DECODE MODE --- */}
      {activeTab === "encode" && (
        <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-2">
            <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowLeftRight size={14} className="text-blue" />
              Encode / Decode Mode
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            
            {/* Source Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-2">Source Format</label>
                <select
                  value={encodeFromFormat}
                  onChange={(e) => setEncodeFromFormat(e.target.value)}
                  className="bg-bg border border-border rounded-xl px-2.5 py-1 text-xs font-black text-text outline-none focus:ring-2 focus:ring-blue"
                >
                  {ENCODE_DECODE_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter input here..."
                className="w-full min-h-[160px] p-4 bg-bg border border-border rounded-2xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none resize-none"
              />
            </div>

            {/* Middle Action */}
            <button
              onClick={() => {
                const temp = encodeFromFormat;
                setEncodeFromFormat(encodeToFormat);
                setEncodeToFormat(temp);
                if (encodeDecodeResult.output) {
                  setInputValue(encodeDecodeResult.output);
                }
              }}
              className="p-3 bg-bg border border-border hover:bg-bg-hover rounded-2xl flex items-center justify-center hover:scale-105 transition-all text-blue self-center justify-self-center mt-6 md:mt-0 shadow-sm"
              title="Swap encoding formats"
            >
              <ArrowLeftRight className="rotate-90 md:rotate-0" />
            </button>

            {/* Target Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-2">Target Format</label>
                <select
                  value={encodeToFormat}
                  onChange={(e) => setEncodeToFormat(e.target.value)}
                  className="bg-bg border border-border rounded-xl px-2.5 py-1 text-xs font-black text-text outline-none focus:ring-2 focus:ring-blue"
                >
                  {ENCODE_DECODE_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <textarea
                  readOnly
                  value={encodeDecodeResult.output}
                  placeholder="Output will display here..."
                  className="w-full min-h-[160px] p-4 bg-bg/50 border border-border rounded-2xl font-mono text-sm outline-none resize-none text-text-2"
                />
                
                {encodeDecodeResult.output && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <CopyButton text={encodeDecodeResult.output} />
                  </div>
                )}
              </div>
            </div>

          </div>

          {encodeDecodeResult.error && (
            <div className="p-3.5 bg-red-400/10 border border-red-400/20 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} />
              {encodeDecodeResult.error}
            </div>
          )}
        </div>
      )}

      {/* --- TEXT / BYTES MODE --- */}
      {activeTab === "text" && (
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-6">
            <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2">
              <TextCursorInput size={14} className="text-blue" />
              Raw Multi-Byte String Breakdown
            </h3>

            {charBreakdown ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Character list cards */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin">
                  {charBreakdown.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-bg border border-border rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg text-blue">
                          {row.char === " " ? "␣" : row.char}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-text">{row.unicode}</span>
                          <span className="text-[10px] text-text-4 font-bold uppercase tracking-wider">UTF-8 Hex: {row.utf8}</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right font-mono text-xs text-text-3">
                        <span>Dec: {row.dec}</span>
                        <span className="text-[10px] text-text-4">Bin: {row.bin}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hex dump view */}
                <div className="bg-bg border border-border p-4 rounded-2xl font-mono text-xs space-y-3">
                  <span className="text-[10px] font-black text-text-3 uppercase tracking-wider block border-b border-border pb-1">Hex Hexadecimal Dump</span>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
                    {Array.from({ length: Math.ceil(bytes.length / 8) }).map((_, lineIdx) => {
                      const offset = (lineIdx * 8).toString(16).padStart(4, "0").toUpperCase();
                      const slice = bytes.slice(lineIdx * 8, (lineIdx + 1) * 8);
                      const hexPart = Array.from(slice).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
                      const textPart = Array.from(slice).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : ".").join("");
                      
                      return (
                        <div key={lineIdx} className="contents hover:bg-surface/50">
                          <span className="text-blue font-bold">{offset}:</span>
                          <div className="flex items-center justify-between">
                            <span className="text-text-2">{hexPart.padEnd(23, " ")}</span>
                            <span className="text-text-4">| {textPart}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-text-4 font-bold">
                Enter text inside the input field to see raw multi-byte breakdowns.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- JWT DECODER MODE --- */}
      {activeTab === "jwt" && jwtDecoded && (
        <div className="space-y-6">
          {jwtDecoded.error ? (
            <div className="p-4 bg-red-400/10 border border-red-400/20 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>JWT Decoding Error: {jwtDecoded.error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Decoded segments */}
              <div className="space-y-6">
                
                {/* Header card */}
                <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-xs font-black text-text-3 uppercase tracking-widest">JWT Header</span>
                    <CopyButton text={JSON.stringify(jwtDecoded.header, null, 2)} />
                  </div>
                  <pre className="bg-bg border border-border p-4 rounded-xl font-mono text-xs text-red-400 overflow-x-auto">
                    {JSON.stringify(jwtDecoded.header, null, 2)}
                  </pre>
                </div>

                {/* Signature status */}
                <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-xs font-black text-text-3 uppercase tracking-widest">JWT Signature (Unverified)</span>
                    <CopyButton text={jwtDecoded.signature} />
                  </div>
                  <div className="bg-bg border border-border p-4 rounded-xl font-mono text-xs break-all text-text-4">
                    {jwtDecoded.signature || "No signature segment present."}
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning/20 text-warning rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                    <AlertCircle size={13} />
                    Signature signature verification requires private keys, which cannot be securely performed locally.
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                {/* Payload card */}
                <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-xs font-black text-text-3 uppercase tracking-widest">JWT Payload</span>
                    <CopyButton text={JSON.stringify(jwtDecoded.payload, null, 2)} />
                  </div>
                  <pre className="bg-bg border border-border p-4 rounded-xl font-mono text-xs text-blue overflow-x-auto">
                    {JSON.stringify(jwtDecoded.payload, null, 2)}
                  </pre>
                </div>

                {/* Expiry and Dates */}
                <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
                  <span className="text-xs font-black text-text-3 uppercase tracking-widest block border-b border-border/50 pb-2">JWT Expiration Status</span>
                  
                  {jwtDecoded.expiryStatus && (
                    <div className="space-y-3 text-xs">
                      
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-text-2">Status:</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                          jwtDecoded.expiryStatus === "valid"
                            ? "bg-success/10 border border-success/20 text-success"
                            : "bg-red-400/10 border border-red-400/20 text-red-500"
                        }`}>
                          {jwtDecoded.expiryStatus}
                        </span>
                      </div>

                      {jwtDecoded.expDate && (
                        <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                          <span className="font-bold text-text-3">Expiry Date:</span>
                          <span className="font-mono text-text-2">{jwtDecoded.expDate.toLocaleString()}</span>
                        </div>
                      )}

                      {jwtDecoded.iatDate && (
                        <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                          <span className="font-bold text-text-3">Issued At:</span>
                          <span className="font-mono text-text-2">{jwtDecoded.iatDate.toLocaleString()}</span>
                        </div>
                      )}

                      {jwtDecoded.nbfDate && (
                        <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                          <span className="font-bold text-text-3">Not Before Date:</span>
                          <span className="font-mono text-text-2">{jwtDecoded.nbfDate.toLocaleString()}</span>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
