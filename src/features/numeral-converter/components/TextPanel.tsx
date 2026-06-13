"use client";

import React from "react";
import { TextCursorInput } from "lucide-react";

interface TextPanelProps {
  charBreakdown: any[] | null;
  bytes: Uint8Array;
}

export function TextPanel({ charBreakdown, bytes }: TextPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-6">
        <h3 className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/50 pb-2">
          <TextCursorInput size={14} className="text-blue" />
          Raw Multi-Byte Breakdown
        </h3>

        {charBreakdown ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin">
              {charBreakdown.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between bg-bg border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-lg text-blue">
                      {row.char === " " ? "␣" : row.char}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-text">{row.unicode}</span>
                      <span className="text-micro text-text-4 font-bold uppercase tracking-wider">UTF-8: {row.utf8}</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right font-mono text-xs text-text-3">
                    <span>Dec: {row.dec}</span>
                    <span className="text-micro text-text-4">Bin: {row.bin}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-bg border border-border p-4 rounded-2xl font-mono text-xs space-y-3">
              <span className="text-xs font-black text-text-3 uppercase tracking-wider block border-b border-border pb-1">Hexadecimal Dump</span>
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
  );
}
