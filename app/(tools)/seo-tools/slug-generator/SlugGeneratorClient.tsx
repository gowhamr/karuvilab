"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

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

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

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

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Input</h2>
              <div className="flex gap-2">
                <button onClick={() => setBulkMode(false)} className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${!bulkMode ? "bg-blue text-white" : "border border-border text-text-3 hover:border-blue hover:text-blue"}`}>
                  Single
                </button>
                <button onClick={() => setBulkMode(true)} className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${bulkMode ? "bg-blue text-white" : "border border-border text-text-3 hover:border-blue hover:text-blue"}`}>
                  Bulk
                </button>
              </div>
            </div>

            {!bulkMode ? (
              <input
                type="text"
                className={inputClass}
                placeholder="My Amazing Blog Post Title!"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            ) : (
              <textarea
                className={`${inputClass} font-mono text-sm resize-none`}
                rows={6}
                placeholder="One title per line&#10;My First Blog Post&#10;Another Great Article&#10;..."
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
              />
            )}
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Options</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Separator</label>
                <select className={inputClass} value={sep} onChange={e => setSep(e.target.value)}>
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Length</label>
                <input type="number" className={inputClass} value={maxLen} min={0} max={200} onChange={e => setMaxLen(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} className="rounded" />
                Lowercase output
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={removeStop} onChange={e => setRemoveStop(e.target.checked)} className="rounded" />
                Remove stop words (a, the, in, of, etc.)
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {!bulkMode ? (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Slug Variants</h2>

              {[
                { label: "Kebab-case", value: kebab },
                { label: "Snake_case", value: snake },
                { label: "Custom (your options)", value: custom },
                ...(removeStop ? [] : [{ label: "Without stop words", value: noStop }]),
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-3">{label}</span>
                    {value && <CopyButton text={value} />}
                  </div>
                  <div className="bg-bg border border-border rounded-xl px-4 py-3 font-mono text-sm text-text-2 break-all min-h-[44px]">
                    {value || <span className="text-text-4 italic">Enter text to generate</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Bulk Slugs ({bulkSlugs.length})</h2>
                {bulkSlugs.length > 0 && (
                  <CopyButton text={bulkSlugs.map(x => x.slug).join("\n")} label="Copy All" />
                )}
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {bulkSlugs.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-bg border border-border rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-4 truncate">{item.original}</p>
                      <p className="font-mono text-sm text-text-2 break-all">{item.slug}</p>
                    </div>
                    <CopyButton text={item.slug} />
                  </div>
                ))}
                {bulkSlugs.length === 0 && (
                  <div className="text-center text-text-4 text-sm py-8">Enter titles in the left panel</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
}
