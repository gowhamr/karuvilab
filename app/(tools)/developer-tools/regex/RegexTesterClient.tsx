"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "developer")!;

const EXAMPLE_PATTERNS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?://[^\\s/$.?#].[^\\s]*", flags: "gi" },
  { label: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b", flags: "g" },
  { label: "Phone (US)", pattern: "\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", flags: "g" },
  { label: "Hex color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: "g" },
  { label: "HTML tag", pattern: "<[^>]+>", flags: "g" },
  { label: "Whitespace (multi)", pattern: "\\s{2,}", flags: "g" },
];

interface Match {
  value: string;
  index: number;
  groups: string[];
}

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState("");

  const flagString = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const re = new RegExp(pattern, flagString);
      const matches: Match[] = [];
      if (flags.g) {
        let m;
        while ((m = re.exec(testString)) !== null) {
          matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
          if (!flags.g || re.lastIndex === m.index) break;
        }
      } else {
        const m = re.exec(testString);
        if (m) matches.push({ value: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flagString, testString, flags.g]);

  const highlighted = useMemo(() => {
    if (!result || result.error || result.matches.length === 0) return null;
    try {
      const re = new RegExp(pattern, flagString.includes("g") ? flagString : flagString + "g");
      const parts: { text: string; match: boolean }[] = [];
      let last = 0;
      testString.replace(re, (match, ...args) => {
        const offset = args[args.length - 2] as number;
        if (offset > last) parts.push({ text: testString.slice(last, offset), match: false });
        parts.push({ text: match, match: true });
        last = offset + match.length;
        return match;
      });
      if (last < testString.length) parts.push({ text: testString.slice(last), match: false });
      return parts;
    } catch { return null; }
  }, [pattern, flagString, testString, result]);

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Pattern</label>
          <div className="flex items-center bg-bg border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue transition-all">
            <span className="px-3 text-text-4 font-mono text-lg select-none">/</span>
            <input
              className="flex-1 py-3 bg-transparent font-mono text-sm outline-none text-text"
              placeholder="[a-z]+"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
            />
            <span className="px-3 text-text-4 font-mono text-lg select-none">/{flagString}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Flags</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(flags) as (keyof typeof flags)[]).map(f => (
              <button
                key={f}
                onClick={() => setFlags(prev => ({ ...prev, [f]: !prev[f] }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono font-bold border transition-all ${flags[f] ? "bg-blue text-white border-blue" : "bg-bg border-border text-text-2 hover:border-blue"}`}
              >
                {f}
              </button>
            ))}
            <span className="text-xs text-text-4 self-center ml-1">g=global i=case-insensitive m=multiline s=dotall u=unicode</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-2">Test String</label>
          <textarea
            className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
            rows={6}
            placeholder="Enter your test string here…"
            value={testString}
            onChange={e => setTestString(e.target.value)}
          />
        </div>
      </div>

      {result?.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500 font-mono">
          Invalid regex: {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="space-y-4">
          <div className="bg-surface border border-border p-4 rounded-xl flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-blue">{result.matches.length}</div>
              <div className="text-xs text-text-4 uppercase tracking-wider">Matches</div>
            </div>
            {result.matches[0]?.groups.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-black text-text">{result.matches[0].groups.length}</div>
                <div className="text-xs text-text-4 uppercase tracking-wider">Groups</div>
              </div>
            )}
          </div>

          {highlighted && (
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-text-2">Highlighted Matches</h3>
              <div className="font-mono text-sm text-text break-all leading-relaxed whitespace-pre-wrap bg-bg border border-border rounded-xl p-4">
                {highlighted.map((part, i) =>
                  part.match
                    ? <mark key={i} className="bg-blue/20 text-blue rounded px-0.5">{part.text}</mark>
                    : <span key={i}>{part.text}</span>
                )}
              </div>
            </div>
          )}

          {result.matches.length > 0 && (
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-text-2">Match Details</h3>
              <div className="space-y-2">
                {result.matches.slice(0, 50).map((m, i) => (
                  <div key={i} className="bg-bg border border-border rounded-xl p-3 text-sm">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold text-text-4">#{i + 1}</span>
                      <span className="font-mono text-blue">"{m.value}"</span>
                      <span className="text-xs text-text-4">at index {m.index}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {m.groups.map((g, gi) => (
                          <span key={gi} className="text-xs font-mono text-text-3">
                            Group {gi + 1}: <span className="text-text">"{g ?? "undefined"}"</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {result.matches.length > 50 && (
                  <p className="text-xs text-text-4 text-center">Showing 50 of {result.matches.length} matches</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-text-2">Example Patterns</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {EXAMPLE_PATTERNS.map(ex => (
            <button
              key={ex.label}
              onClick={() => {
                setPattern(ex.pattern);
                const newFlags = { g: false, i: false, m: false, s: false, u: false };
                for (const f of ex.flags) {
                  if (f in newFlags) (newFlags as Record<string, boolean>)[f] = true;
                }
                setFlags(newFlags);
              }}
              className="px-3 py-2 text-xs font-medium bg-bg border border-border rounded-xl hover:border-blue hover:text-blue transition-all text-left"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
