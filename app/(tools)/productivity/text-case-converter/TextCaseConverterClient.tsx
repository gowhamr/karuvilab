"use client";

import React, { useState, useCallback } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/src/lib/utils";

type CaseType = 
  | "upper" 
  | "lower" 
  | "sentence" 
  | "title" 
  | "camel" 
  | "pascal" 
  | "snake" 
  | "kebab" 
  | "alternating";

const CASE_OPTIONS: { label: string; value: CaseType }[] = [
  { label: "UPPERCASE", value: "upper" },
  { label: "lowercase", value: "lower" },
  { label: "Sentence case", value: "sentence" },
  { label: "Title Case", value: "title" },
  { label: "camelCase", value: "camel" },
  { label: "PascalCase", value: "pascal" },
  { label: "snake_case", value: "snake" },
  { label: "kebab-case", value: "kebab" },
  { label: "aLtErNaTiNg cAsE", value: "alternating" },
];

export default function TextCaseConverterClient() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("upper");

  const convertText = useCallback((text: string, type: CaseType) => {
    if (!text) return "";

    switch (type) {
      case "upper":
        return text.toUpperCase();
      case "lower":
        return text.toLowerCase();
      case "sentence":
        return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
      case "title":
        return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      case "camel":
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      case "pascal":
        const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        return camel.charAt(0).toUpperCase() + camel.slice(1);
      case "snake":
        return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || "";
      case "kebab":
        return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('-') || "";
      case "alternating":
        return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
      default:
        return text;
    }
  }, []);

  const output = convertText(input, activeCase);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-sm font-black uppercase tracking-widest text-text-4">Input Text</label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Paste or type your text here..."
          rows={8}
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-black uppercase tracking-widest text-text-4">Choose Case</label>
        <ToggleGroup.Root
          type="single"
          value={activeCase}
          onValueChange={(val) => val && setActiveCase(val as CaseType)}
          className="flex flex-wrap gap-2"
        >
          {CASE_OPTIONS.map((opt) => (
            <ToggleGroup.Item
              key={opt.value}
              value={opt.value}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                activeCase === opt.value
                  ? "bg-blue border-blue text-white shadow-md shadow-blue/10"
                  : "bg-surface border-border text-text-4 hover:border-blue/30 hover:text-blue"
              )}
            >
              {opt.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-black uppercase tracking-widest text-text-4">Output</label>
          <CopyButton text={output} label="Copy Result" />
        </div>
        <div className="min-h-[150px] p-6 bg-surface border border-border rounded-2xl text-text whitespace-pre-wrap break-words font-medium">
          {output || <span className="text-text-4 italic">The converted text will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
