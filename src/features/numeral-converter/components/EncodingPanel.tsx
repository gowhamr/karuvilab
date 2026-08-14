"use client";

import React from "react";
import { ArrowLeftRight, AlertCircle } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/src/lib/utils";

interface EncodingPanelProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  encodeFromFormat: string;
  setEncodeFromFormat: (val: string) => void;
  encodeToFormat: string;
  setEncodeToFormat: (val: string) => void;
  encodeDecodeResult: { output: string; error: string };
  isConverting: boolean;
  formats: { id: string; label: string }[];
}

export function EncodingPanel({
  inputValue,
  setInputValue,
  encodeFromFormat,
  setEncodeFromFormat,
  encodeToFormat,
  setEncodeToFormat,
  encodeDecodeResult,
  isConverting,
  formats
}: EncodingPanelProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-2">
        <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5">
          <ArrowLeftRight size={14} className="text-blue" />
          Encode / Decode Mode
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        
        {/* Source */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-2">Source Format</label>
            <select
              value={encodeFromFormat}
              onChange={(e) => setEncodeFromFormat(e.target.value)}
              className="bg-bg border border-border rounded-xl px-2.5 py-1 text-xs font-black text-text outline-none focus:ring-2 focus:ring-blue"
            >
              {formats.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter input here..."
            className="w-full min-h-40 p-4 bg-bg border border-border rounded-2xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none resize-none"
          />
        </div>

        {/* Swap */}
        <button
          onClick={() => {
            const temp = encodeFromFormat;
            setEncodeFromFormat(encodeToFormat);
            setEncodeToFormat(temp);
            if (encodeDecodeResult.output) setInputValue(encodeDecodeResult.output);
          }}
          className="p-3 bg-bg border border-border hover:bg-bg/80 rounded-2xl flex items-center justify-center hover:scale-105 transition-all text-blue mt-6 md:mt-0 shadow-sm"
        >
          <ArrowLeftRight className="rotate-90 md:rotate-0" />
        </button>

        {/* Target */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-2">Target Format</label>
            <select
              value={encodeToFormat}
              onChange={(e) => setEncodeToFormat(e.target.value)}
              className="bg-bg border border-border rounded-xl px-2.5 py-1 text-xs font-black text-text outline-none focus:ring-2 focus:ring-blue"
            >
              {formats.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <textarea
              readOnly
              value={isConverting ? "Converting..." : encodeDecodeResult.output}
              placeholder="Output will display here..."
              className={cn(
                "w-full min-h-40 p-4 bg-bg/50 border border-border rounded-2xl font-mono text-sm outline-none resize-none text-text-2",
                isConverting && "opacity-50 animate-pulse"
              )}
            />
            {encodeDecodeResult.output && !isConverting && (
              <div className="absolute bottom-4 right-4">
                <CopyButton text={encodeDecodeResult.output} label="Copy result" />
              </div>
            )}
          </div>
        </div>
      </div>

      {encodeDecodeResult.error && (
        <div className="p-4 bg-error/5 border border-error/20 text-error rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={15} />
          {encodeDecodeResult.error}
        </div>
      )}
    </div>
  );
}
