"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find(c => c.id === "seo")!;

const STOP_WORDS = new Set([
  "a","an","the","in","on","at","of","and","or","but","for","to","with","from",
  "by","as","is","it","its","this","that","these","those","was","are","be","been",
  "has","have","had","will","would","could","should","may","might","do","did","does",
]);

function slugify(text: string, opts: { sep: string; lower: boolean; removeStop: boolean; maxLen: number }): string {
  let s = opts.lower ? text.toLowerCase() : text;
  s = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();

  if (opts.removeStop) {
    s = s.split(/\s+/).filter(w => !STOP_WORDS.has(w.toLowerCase())).join(" ");
  }

  let slug = s.trim().split(/\s+/).join(opts.sep);
  if (opts.maxLen > 0) slug = slug.slice(0, opts.maxLen).replace(new RegExp(`${opts.sep}+$`), "");
  return slug;
}

export default function SlugGeneratorClient() {
  const [input, setInput] = useState("");
  const [sep, setSep] = useState("-");
  const [lower, setLower] = useState(true);
  const [removeStop, setRemoveStop] = useState(false);
  const [maxLen, setMaxLen] = useState(60);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState("");

  const opts = useMemo(() => ({ sep, lower, removeStop, maxLen }), [sep, lower, removeStop, maxLen]);

  const kebab = useMemo(() => slugify(input, { ...opts, sep: "-", lower: true }), [input, opts]);
  const snake = useMemo(() => slugify(input, { ...opts, sep: "_", lower: true }), [input, opts]);
  const noStop = useMemo(() => slugify(input, { ...opts, removeStop: true }), [input, opts]);
  const custom = useMemo(() => slugify(input, opts), [input, opts]);

  const bulkSlugs = useMemo(() => {
    if (!bulkInput.trim()) return [];
    return bulkInput.split("\n").map(line => ({
      original: line.trim(),
      slug: slugify(line.trim(), opts),
    })).filter(x => x.original);
  }, [bulkInput, opts]);

  const selectClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl text-base font-bold focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all cursor-pointer appearance-none";

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Input</h2>
              <div className="flex bg-bg p-1 rounded-xl border border-border">
                <button 
                  onClick={() => setBulkMode(false)} 
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${!bulkMode ? "bg-blue text-white shadow-md shadow-blue/10" : "text-text-4 hover:text-text-2"}`}
                >
                  Single
                </button>
                <button 
                  onClick={() => setBulkMode(true)} 
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${bulkMode ? "bg-blue text-white shadow-md shadow-blue/10" : "text-text-4 hover:text-text-2"}`}
                >
                  Bulk
                </button>
              </div>
            </div>

            {!bulkMode ? (
              <ToolInput
                label="Single Text"
                placeholder="My Amazing Blog Post Title!"
                value={input}
                onChange={setInput}
              />
            ) : (
              <ToolInput
                label="Multiple Titles (one per line)"
                rows={6}
                placeholder="My First Blog Post&#10;Another Great Article"
                value={bulkInput}
                onChange={setBulkInput}
                mono
              />
            )}
          </div>

          <div className="bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6">
            <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Options</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Separator</label>
                <div className="relative">
                  <select className={selectClass} value={sep} onChange={e => setSep(e.target.value)}>
                    <option value="-">Hyphen (-)</option>
                    <option value="_">Underscore (_)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-4">▼</div>
                </div>
              </div>
              <ToolInput
                label="Max Length"
                type="number"
                value={String(maxLen)}
                onChange={v => setMaxLen(Number(v))}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Checkbox
                label="Lowercase output"
                checked={lower}
                onChange={e => setLower(e.target.checked)}
              />
              <Checkbox
                label="Remove stop words"
                checked={removeStop}
                onChange={e => setRemoveStop(e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {!bulkMode ? (
            <div className="bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6 h-full">
              <h2 className="font-black text-text-2 text-sm uppercase tracking-widest border-b border-border pb-4">Slug Variants</h2>

              <div className="space-y-4">
                {[
                  { label: "Kebab-case", value: kebab },
                  { label: "Snake_case", value: snake },
                  { label: "Custom (your options)", value: custom },
                  ...(removeStop ? [] : [{ label: "Without stop words", value: noStop }]),
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-4">{label}</span>
                      {value && <CopyButton text={value} />}
                    </div>
                    <div className="bg-bg border border-border rounded-xl px-4 py-3 font-mono text-sm text-text-2 break-all min-h-[48px] flex items-center shadow-inner group-hover:border-blue/30 transition-colors">
                      {value || <span className="text-text-4 italic opacity-50">Enter text to generate</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6 h-full">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Bulk Slugs ({bulkSlugs.length})</h2>
                {bulkSlugs.length > 0 && (
                  <CopyButton text={bulkSlugs.map(x => x.slug).join("\n")} label="Copy All" className="bg-bg border border-border" />
                )}
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {bulkSlugs.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-bg border border-border rounded-2xl px-5 py-4 hover:border-blue/30 transition-all shadow-sm group">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-text-4 uppercase tracking-widest mb-1 group-hover:text-blue transition-colors truncate">{item.original}</p>
                      <p className="font-mono text-sm text-text-2 break-all font-bold tracking-tight">{item.slug}</p>
                    </div>
                    <CopyButton text={item.slug} />
                  </div>
                ))}
                {bulkSlugs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-text-4 border-2 border-dashed border-border rounded-2xl">
                    <span className="text-4xl mb-3 opacity-20">📝</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Enter titles to generate slugs</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
}
