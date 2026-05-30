"use client";

import React, { useState, useMemo } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { SortAsc, SortDesc, Copy, Trash2, Shuffle, ArrowUpDown, ListFilter, Trash } from "lucide-react";

export default function TextSorterDeduperClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const lines = useMemo(() => input.split("\n").filter(l => l.trim() !== ""), [input]);
  const stats = useMemo(() => {
    const unique = new Set(lines).size;
    return {
      total: lines.length,
      unique,
      duplicates: lines.length - unique
    };
  }, [lines]);

  const process = (fn: (arr: string[]) => string[]) => {
    const processed = fn([...lines]);
    const result = processed.join("\n");
    setInput(result);
    setOutput(result);
  };

  const sortAZ = () => process(arr => arr.sort((a, b) => a.localeCompare(b)));
  const sortZA = () => process(arr => arr.sort((a, b) => b.localeCompare(a)));
  const sortLength = () => process(arr => arr.sort((a, b) => a.length - b.length));
  const dedupe = () => process(arr => Array.from(new Set(arr)));
  const reverse = () => process(arr => arr.reverse());
  const shuffle = () => process(arr => arr.sort(() => Math.random() - 0.5));
  const trim = () => setInput(input.split("\n").map(l => l.trim()).join("\n"));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ToolInput
            label="Input Text (One item per line)"
            rows={12}
            value={input}
            onChange={setInput}
            placeholder="Paste your list here..."
            mono
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button onClick={sortAZ} className="flex items-center justify-center gap-2 p-3 bg-surface border border-border rounded-xl hover:border-blue transition-all text-sm font-bold">
              <SortAsc className="w-4 h-4" /> A-Z
            </button>
            <button onClick={sortZA} className="flex items-center justify-center gap-2 p-3 bg-surface border border-border rounded-xl hover:border-blue transition-all text-sm font-bold">
              <SortDesc className="w-4 h-4" /> Z-A
            </button>
            <button onClick={dedupe} className="flex items-center justify-center gap-2 p-3 bg-blue/10 border border-blue/30 text-blue rounded-xl hover:bg-blue/20 transition-all text-sm font-bold">
              <ListFilter className="w-4 h-4" /> Dedupe
            </button>
            <button onClick={shuffle} className="flex items-center justify-center gap-2 p-3 bg-surface border border-border rounded-xl hover:border-blue transition-all text-sm font-bold">
              <Shuffle className="w-4 h-4" /> Shuffle
            </button>
            <button onClick={sortLength} className="flex items-center justify-center gap-2 p-3 bg-surface border border-border rounded-xl hover:border-blue transition-all text-sm font-bold">
              <ArrowUpDown className="w-4 h-4" /> Length
            </button>
            <button onClick={reverse} className="flex items-center justify-center gap-2 p-3 bg-surface border border-border rounded-xl hover:border-blue transition-all text-sm font-bold">
              <ArrowUpDown className="w-4 h-4" /> Reverse
            </button>
            <button onClick={trim} className="flex items-center justify-center gap-2 p-3 bg-surface border border-border rounded-xl hover:border-blue transition-all text-sm font-bold">
              <Trash2 className="w-4 h-4" /> Trim
            </button>
            <button onClick={() => { setInput(""); setOutput(""); }} className="flex items-center justify-center gap-2 p-3 bg-error/10 border border-error/30 text-error rounded-xl hover:bg-error/20 transition-all text-sm font-bold">
              <Trash className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <ToolResultArea
            value={output}
            label="Processed Output"
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-surface border border-border rounded-2xl">
              <div className="text-[10px] font-black text-text-4 uppercase tracking-widest">Total</div>
              <div className="text-xl font-black">{stats.total}</div>
            </div>
            <div className="p-4 bg-surface border border-border rounded-2xl">
              <div className="text-[10px] font-black text-text-4 uppercase tracking-widest">Unique</div>
              <div className="text-xl font-black text-blue">{stats.unique}</div>
            </div>
            <div className="p-4 bg-surface border border-border rounded-2xl">
              <div className="text-[10px] font-black text-text-4 uppercase tracking-widest">Duplicates</div>
              <div className="text-xl font-black text-error">{stats.duplicates}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
