"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "developer")!;

type Lang = "json" | "html" | "css" | "sql" | "markdown";

function formatJSON(code: string): string {
  return JSON.stringify(JSON.parse(code), null, 2);
}

function formatHTML(html: string): string {
  let indent = 0;
  const voids = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  return html
    .replace(/>\s+</g, "><")
    .replace(/(<\/?[^>]+>)/g, "\n$1\n")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      if (/^<\//.test(line)) { indent = Math.max(0, indent - 1); }
      const out = "  ".repeat(indent) + line;
      const tag = line.match(/^<([a-zA-Z]+)/)?.[1]?.toLowerCase() ?? "";
      if (/^<[^/]/.test(line) && !/\/>$/.test(line) && !voids.has(tag)) { indent++; }
      return out;
    })
    .join("\n");
}

function formatCSS(css: string): string {
  return css
    .replace(/\s*\{\s*/g, " {\n  ")
    .replace(/\s*;\s*/g, ";\n  ")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/  \n}/g, "\n}")
    .replace(/,\s*/g, ",\n")
    .split("\n")
    .map(l => l.trimEnd())
    .filter(l => l.trim() !== "")
    .join("\n");
}

function formatSQL(sql: string): string {
  const keywords = ["SELECT","FROM","WHERE","AND","OR","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES","UPDATE","SET","DELETE","CREATE TABLE","DROP TABLE","ALTER TABLE","ON","AS"];
  let result = sql.replace(/\s+/g, " ").trim();
  keywords.forEach(kw => {
    result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n${kw}`);
  });
  return result.trim().split("\n").map(l => l.trim()).filter(Boolean).join("\n");
}

function formatMarkdown(md: string): string {
  return md
    .split("\n")
    .map(l => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^(#{1,6})\s*/gm, (_, h) => `${h} `)
    .trim();
}

const FORMATTERS: Record<Lang, (code: string) => string> = {
  json: formatJSON,
  html: formatHTML,
  css: formatCSS,
  sql: formatSQL,
  markdown: formatMarkdown,
};

export default function CodeFormatter() {
  const [lang, setLang] = useState<Lang>("json");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      return { output: FORMATTERS[lang](input), error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, lang]);

  const originalSize = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const formattedSize = useMemo(() => new TextEncoder().encode(output).length, [output]);

  return (
    <ToolShell title="Code Formatter" description="Format JSON, HTML, CSS, SQL, and Markdown. Note: for production-quality formatting, consider Prettier locally." category={cat}>
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-wrap gap-2">
          {(["json", "html", "css", "sql", "markdown"] as Lang[]).map(l => (
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
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
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
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text resize-none outline-none"
              rows={14}
              value={output}
            />
          </div>
        </div>
      )}
    </ToolShell>
  );
}
