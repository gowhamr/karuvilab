"use client";
import { useState, useMemo } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";
import { CopyButton } from "@/components/ui/CopyButton";

type SplitMethod = "equal" | "chars" | "delimiter" | "custom";

function splitText(text: string, method: SplitMethod, parts: number, chars: number, delimiter: string, custom: string): string[] {
  if (!text) return [];
  switch (method) {
    case "equal": {
      const size = Math.ceil(text.length / parts);
      return Array.from({ length: parts }, (_, i) => text.slice(i * size, (i + 1) * size)).filter(Boolean);
    }
    case "chars": {
      const chunks: string[] = [];
      for (let i = 0; i < text.length; i += chars) chunks.push(text.slice(i, i + chars));
      return chunks;
    }
    case "delimiter": {
      const parsedDelimiter = delimiter.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      const escaped = parsedDelimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return text.split(new RegExp(escaped)).filter(s => s.trim() !== "");
    }
    case "custom": {
      if (!custom) return [text];
      const lines = text.split("\n");
      const linesPerChunk = Math.max(1, Number(custom) || 10);
      const chunks: string[] = [];
      for (let i = 0; i < lines.length; i += linesPerChunk) {
        chunks.push(lines.slice(i, i + linesPerChunk).join("\n"));
      }
      return chunks.filter(Boolean);
    }
    default: return [text];
  }
}

export default function SplitCopyClient() {
  const [input, setInput] = useState("");
  const [method, setMethod] = useState<SplitMethod>("equal");
  const [parts, setParts] = useState("3");
  const [chars, setChars] = useState("500");
  const [delimiter, setDelimiter] = useState("\\n\\n");
  const [customLines, setCustomLines] = useState("10");

  const chunks = useMemo(
    () => splitText(input, method, Number(parts) || 2, Number(chars) || 100, delimiter, customLines),
    [input, method, parts, chars, delimiter, customLines]
  );

  const allAsNumbered = chunks.map((c, i) => `[${i + 1}/${chunks.length}]\n${c}`).join("\n\n---\n\n");

  const tabs = {
    options: [
      { id: "equal", label: "Equal Parts" },
      { id: "chars", label: "By Char Count" },
      { id: "delimiter", label: "By Delimiter" },
      { id: "custom", label: "By Line Count" },
    ] as { id: SplitMethod; label: string }[],
    activeId: method,
    onChange: (id: SplitMethod) => setMethod(id),
  };

  const inputPanel = (
    <ToolInput
      label="Input Text"
      description={`${input.length} characters`}
      value={input}
      onChange={setInput}
      rows={6}
      placeholder="Paste your long text here…"
      mono
    />
  );

  const optionsPanel = (
    <div className="space-y-4">
      {method === "equal" && (
        <ToolInput
          label="Number of parts"
          type="number"
          value={parts}
          onChange={setParts}
        />
      )}
      {method === "chars" && (
        <ToolInput
          label="Characters per chunk"
          type="number"
          value={chars}
          onChange={setChars}
        />
      )}
      {method === "delimiter" && (
        <ToolInput
          label="Delimiter"
          type="text"
          value={delimiter}
          onChange={setDelimiter}
          placeholder="\\n\\n or , or any string"
          mono
        />
      )}
      {method === "custom" && (
        <ToolInput
          label="Lines per chunk"
          type="number"
          value={customLines}
          onChange={setCustomLines}
        />
      )}
    </div>
  );

  const outputPanel = chunks.length > 0 ? (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-text-2">{chunks.length} chunks</p>
        <CopyButton text={allAsNumbered} label="Copy All (Numbered)" />
      </div>
      <div className="space-y-6">
        {chunks.map((chunk, i) => (
          <ToolResultArea
            key={i}
            label={`Chunk ${i + 1} / ${chunks.length}`}
            value={chunk}
            language={`${chunk.length} chars`}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full min-h-[200px] text-text-muted">
      Enter some text to see it split into chunks
    </div>
  );

  return (
    <ToolWorkspace
      tabs={tabs}
      input={inputPanel}
      optionsPanel={optionsPanel}
      output={outputPanel}
    />
  );
}
