"use client";

import { useState, useCallback, useEffect } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { RefreshCw, Key, ShieldCheck } from "lucide-react";

export const DEFAULT_ALPHABET = "A-Za-z0-9_-";

export function generateNanoId(size: number = 21, alphabetStr: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-"): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < size; i++) {
    id += alphabetStr[bytes[i]! % alphabetStr.length];
  }
  return id;
}

export default function NanoIdClient() {
  const [size, setSize] = useState(21);
  const [count, setCount] = useState(5);
  const [alphabetPreset, setAlphabetPreset] = useState("default");
  const [customAlphabet, setCustomAlphabet] = useState("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-");
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const ids: string[] = [];
    const alph = customAlphabet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
    for (let i = 0; i < count; i++) {
      ids.push(generateNanoId(size, alph));
    }
    setGeneratedIds(ids);
  }, [size, count, customAlphabet]);

  useEffect(() => {
    if (alphabetPreset === "default") {
      setCustomAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-");
    } else if (alphabetPreset === "alphanumeric") {
      setCustomAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    } else if (alphabetPreset === "numbers") {
      setCustomAlphabet("0123456789");
    } else if (alphabetPreset === "hex") {
      setCustomAlphabet("0123456789abcdef");
    }
  }, [alphabetPreset]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Config Panel */}
      <div className="p-5 rounded-xl bg-surface-2 border border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted">ID Length (Characters):</label>
          <input
            id="nanoid-size-input"
            type="number"
            min={5}
            max={128}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted">Quantity:</label>
          <input
            id="nanoid-count-input"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-muted">Alphabet Preset:</label>
          <select
            id="nanoid-preset-select"
            value={alphabetPreset}
            onChange={(e) => setAlphabetPreset(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
          >
            <option value="default">Default URL-Safe (A-Za-z0-9_-)</option>
            <option value="alphanumeric">Alphanumeric (A-Za-z0-9)</option>
            <option value="hex">Lowercase Hex (0-9a-f)</option>
            <option value="numbers">Numeric Only (0-9)</option>
          </select>
        </div>
      </div>

      <button
        id="nanoid-generate-btn"
        onClick={handleGenerate}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <RefreshCw className="w-5 h-5" />
        Generate NanoIDs
      </button>

      {/* Generated IDs Output */}
      {generatedIds.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text">Generated NanoIDs</h3>
            <CopyButton text={generatedIds.join("\n")} />
          </div>

          <div className="space-y-2">
            {generatedIds.map((id, index) => (
              <div key={index} className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between font-mono text-sm">
                <span className="text-emerald-300 font-bold">{id}</span>
                <CopyButton text={id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
