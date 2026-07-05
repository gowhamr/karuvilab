"use client";

import { useState, useCallback } from "react";
import YAML from "yaml";
import { CopyButton } from "@/components/ui/CopyButton";
import { ArrowLeftRight, FileCode, AlertCircle } from "lucide-react";

export default function YamlJsonClient() {
  const [direction, setDirection] = useState<"yaml2json" | "json2yaml">("yaml2json");
  const [inputText, setInputText] = useState(`name: KaruviLab
version: 2.1.0
features:
  - fast
  - private
  - offline
settings:
  theme: dark
  autoSave: true`);
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    try {
      if (direction === "yaml2json") {
        const parsed = YAML.parse(inputText);
        setOutputText(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(inputText);
        setOutputText(YAML.stringify(parsed));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed due to invalid syntax.");
    }
  }, [inputText, direction]);

  const toggleDirection = () => {
    const nextDir = direction === "yaml2json" ? "json2yaml" : "yaml2json";
    setDirection(nextDir);
    setInputText(outputText || inputText);
    setOutputText("");
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Controls */}
      <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-sm text-text">
          <FileCode className="w-5 h-5 text-sky-400" />
          Mode: <span className="text-emerald-300 font-mono">{direction === "yaml2json" ? "YAML ➔ JSON" : "JSON ➔ YAML"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="yaml-swap-btn"
            onClick={toggleDirection}
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:border-sky-400 flex items-center gap-1.5 transition"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-400" />
            Switch Direction
          </button>

          <button
            id="yaml-convert-btn"
            onClick={handleConvert}
            className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition"
          >
            Convert Now
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text">
            Input {direction === "yaml2json" ? "YAML" : "JSON"}:
          </label>
          <textarea
            id="yaml-json-input"
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text">
              Output {direction === "yaml2json" ? "JSON" : "YAML"}:
            </label>
            <CopyButton text={outputText} />
          </div>
          <textarea
            id="yaml-json-output"
            rows={14}
            readOnly
            value={outputText}
            placeholder="Click 'Convert Now' to see output..."
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
