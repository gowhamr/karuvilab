"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { 
  detectFormat, decodeToBytes, encodeFromBytes, decodeJWT 
} from "@/src/features/numeral-converter/utils/conversion-helpers";
import { TabNavigation } from "@/src/features/numeral-converter/components/TabNavigation";
import { useToast } from "@/components/ui/Toast";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { useDebounce } from "@/src/hooks/useDebounce";

// New modular components
import { InputArea } from "@/src/features/numeral-converter/components/InputArea";
import { SmartPanel } from "@/src/features/numeral-converter/components/SmartPanel";
import { NumberPanel } from "@/src/features/numeral-converter/components/NumberPanel";
import { EncodingPanel } from "@/src/features/numeral-converter/components/EncodingPanel";
import { TextPanel } from "@/src/features/numeral-converter/components/TextPanel";
import { JwtPanel } from "@/src/features/numeral-converter/components/JwtPanel";

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
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjQ5NDQwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
} as const;

export default function NumeralConverterClient() {
  const [activeTab, setActiveTab] = useState<TabMode>("smart");
  const { toast } = useToast();
  
  // Input states
  const [inputValue, setInputValue] = useState<string>(SAMPLES.text);
  const [inputFormat, setInputFormat] = useState("auto");
  
  // Parameters
  const [caesarShiftVal, setCaesarShiftVal] = useState(3);
  const [encodeAllEntities, setEncodeAllEntities] = useState(false);
  const [unicodeEscapeStyle, setUnicodeEscapeStyle] = useState<"js" | "python" | "c" | "css" | "rust" | "go">("js");
  
  // Encode/Decode states
  const [encodeFromFormat, setEncodeFromFormat] = useState("utf8");
  const [encodeToFormat, setEncodeToFormat] = useState("base64");

  // Auto-detection
  const { detectedFormat, confidence } = useMemo(() => {
    if (inputFormat !== "auto") return { detectedFormat: inputFormat, confidence: "high" as const };
    const det = detectFormat(inputValue);
    return { detectedFormat: det.format, confidence: det.confidence };
  }, [inputValue, inputFormat]);

  // Decode to raw bytes
  const bytes = useMemo(() => decodeToBytes(inputValue, detectedFormat), [inputValue, detectedFormat]);

  // Helper to safely get output value
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

  // Workerized Conversion
  const [asyncEncodeResult, setAsyncEncodeResult] = useState<{ output: string; error: string } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const debouncedInput = useDebounce(inputValue, 400);

  useEffect(() => {
    if (!debouncedInput) {
      setAsyncEncodeResult({ output: "", error: "" });
      return;
    }

    if (debouncedInput.length < 10000) {
      try {
        const decodedBytes = decodeToBytes(debouncedInput, encodeFromFormat);
        if (decodedBytes.length === 0) {
          setAsyncEncodeResult({ output: "", error: "No decodable input content." });
          return;
        }
        const output = encodeFromBytes(decodedBytes, encodeToFormat, { 
          shift: caesarShiftVal, encodeAll: encodeAllEntities, escapeStyle: unicodeEscapeStyle 
        });
        setAsyncEncodeResult({ output, error: "" });
      } catch (err: unknown) {
        setAsyncEncodeResult({ output: "", error: err instanceof Error ? err.message : "Conversion failed" });
      }
      return;
    }

    const task = async () => {
      setIsConverting(true);
      try {
        const res = await workerOrchestrator.run<{ value: string; error: string }>("convertNumeral", [
          debouncedInput, encodeFromFormat, encodeToFormat, 
          { shift: caesarShiftVal, encodeAll: encodeAllEntities, escapeStyle: unicodeEscapeStyle }
        ]);
        setAsyncEncodeResult({ output: res.value, error: res.error });
      } catch (e: any) {
        setAsyncEncodeResult({ output: "", error: "Worker failed: " + e.message });
      } finally { setIsConverting(false); }
    };
    task();
  }, [debouncedInput, encodeFromFormat, encodeToFormat, caesarShiftVal, encodeAllEntities, unicodeEscapeStyle]);

  const encodeDecodeResult = asyncEncodeResult || { output: "", error: "" };

  const jwtDecoded = useMemo(() => {
    if (activeTab !== "jwt" || !inputValue) return null;
    return decodeJWT(inputValue);
  }, [inputValue, activeTab]);

  const playMorseAudio = (morseCode: string) => {
    if (typeof window === "undefined" || !morseCode) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let time = ctx.currentTime;
      const unit = 0.08;
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
          osc.start(time); osc.stop(time + dur);
          time += dur + unit;
        } else if (char === " ") { time += unit * 2; } else if (char === "/") { time += unit * 4; }
      });
    } catch (e) { console.error("Audio Context Failed", e); }
  };

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
        return { char: c, dec: code, hex: `0x${code.toString(16).toUpperCase()}`, bin: code.toString(2).padStart(8, "0").replace(/(.{4})/g, "$1 ").trim(), unicode: `U+${code.toString(16).padStart(4, "0").toUpperCase()}`, utf8: utf8BytesHex };
      });
    } catch { return null; }
  }, [bytes]);

  return (
    <div className="space-y-8">
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={(id) => {
          setActiveTab(id as TabMode);
          if (id === "jwt") setInputValue(SAMPLES.jwt);
          else if (!inputValue || inputValue === SAMPLES.jwt) setInputValue(SAMPLES.text);
        }} 
      />

      {activeTab !== "number" && (
        <InputArea 
          value={inputValue} onChange={setInputValue}
          inputFormat={inputFormat} setInputFormat={setInputFormat}
          detectedFormat={detectedFormat} confidence={confidence}
          activeTab={activeTab} formats={INPUT_FORMATS}
          onLoadSample={() => setInputValue(activeTab === "jwt" ? SAMPLES.jwt : SAMPLES.text)}
        />
      )}

      {activeTab === "smart" && (
        <SmartPanel 
          inputValue={inputValue} bytes={bytes} smartOutputs={smartOutputs}
          utf8Validation={utf8Validation} caesarShiftVal={caesarShiftVal} setCaesarShiftVal={setCaesarShiftVal}
          encodeAllEntities={encodeAllEntities} setEncodeAllEntities={setEncodeAllEntities}
          unicodeEscapeStyle={unicodeEscapeStyle} setUnicodeEscapeStyle={setUnicodeEscapeStyle}
          playMorseAudio={playMorseAudio} charBreakdown={charBreakdown}
        />
      )}

      {activeTab === "number" && <NumberPanel initialDec={bytes.length === 1 && bytes[0] !== undefined ? bytes[0].toString() : "42"} />}

      {activeTab === "encode" && (
        <EncodingPanel 
          inputValue={inputValue} setInputValue={setInputValue}
          encodeFromFormat={encodeFromFormat} setEncodeFromFormat={setEncodeFromFormat}
          encodeToFormat={encodeToFormat} setEncodeToFormat={setEncodeToFormat}
          encodeDecodeResult={encodeDecodeResult} isConverting={isConverting}
          formats={ENCODE_DECODE_FORMATS}
        />
      )}

      {activeTab === "text" && <TextPanel charBreakdown={charBreakdown} bytes={bytes} />}

      {activeTab === "jwt" && <JwtPanel jwtDecoded={jwtDecoded} />}
    </div>
  );
}
