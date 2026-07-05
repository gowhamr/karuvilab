"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { beautify, Language } from "@/src/lib/formatter-utils";

const cat = CATEGORIES.find(c => c.id === "developer")!;

type Lang = Extract<Language, "json" | "html" | "css" | "sql" | "markdown" | "xml">;

const LANGS: Lang[] = ["json", "html", "xml", "css", "sql", "markdown"];

export default function CodeFormatterClient() {
  const [lang, setLang] = useState<Lang>("json");
  const [input, setInput] = useState("");
  const [fontSize, setFontSize] = useState(13);
  const [wordWrap, setWordWrap] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const formatted = beautify(input, lang);
      return { output: formatted, error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, lang]);

  const originalSize = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const formattedSize = useMemo(() => new TextEncoder().encode(output).length, [output]);

  const toolId = lang === "sql" ? "sql-formatter" : (lang === "css" || lang === "html" ? "css-formatter" : "code-formatter");
  const toolName = lang === "sql" ? "SQL Formatter" : (lang === "css" || lang === "html" ? "CSS/HTML Formatter" : "Code Formatter");

  useFocusModeIntegration({
    charCount: output.length,
    lineCount: output ? output.split('\n').length : 0,
    language: lang,
    onFontSizeChange: setFontSize,
    onWrapToggle: () => setWordWrap(v => !v)
  });

  return (
    <div className="w-full">
      <div className="space-y-6 w-full">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-wrap gap-2">
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setInput(""); }}
              className={`px-5 py-2 rounded-xl text-sm font-bold uppercase transition-all ${lang === l ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Input</label>
          <textarea
            className={`w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono focus:ring-2 focus:ring-blue outline-none transition-all resize-none ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
            style={{ fontSize: `${fontSize}px` }}
            rows={12}
            placeholder={`Paste your ${lang.toUpperCase()} here…`}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500">{error}</div>
        )}
      </div>

      {output && !error && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Original", value: `${originalSize} B` },
              { label: "Formatted", value: `${formattedSize} B` },
              { label: "Diff", value: `${formattedSize > originalSize ? "+" : ""}${formattedSize - originalSize} B` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface border border-border p-4 rounded-xl text-center">
                <div className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-lg font-black text-text">{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-2">Formatted Output</label>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              className={`w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-text resize-none outline-none ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
              style={{ fontSize: `${fontSize}px` }}
              rows={14}
              value={output}
            />
          </div>
        </div>
      )}
      </div>
    </div>
);
}
