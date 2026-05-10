"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

import { usePersistentState } from "@/src/lib/hooks";

const cat = CATEGORIES.find(c => c.id === "developer")!;

type Indent = 2 | 4 | "tab";

interface TreeNodeProps {
  value: unknown;
  depth?: number;
}

function TreeNode({ value, depth = 0 }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const indent = depth * 16;

  if (value === null) return <span className="text-text-4">null</span>;
  if (typeof value === "boolean") return <span className="text-blue">{String(value)}</span>;
  if (typeof value === "number") return <span className="text-green-500">{value}</span>;
  if (typeof value === "string") return <span className="text-yellow-500">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-text-3">[]</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} className="text-text-4 hover:text-blue font-mono text-xs mr-1">
          {collapsed ? "▶" : "▼"}
        </button>
        <span className="text-text-3">{"["}</span>
        {collapsed
          ? <span className="text-text-4 cursor-pointer" onClick={() => setCollapsed(false)}> {value.length} items </span>
          : (
            <div style={{ marginLeft: indent + 16 }}>
              {value.map((item, i) => (
                <div key={i}><TreeNode value={item} depth={depth + 1} />{i < value.length - 1 ? <span className="text-text-4">,</span> : null}</div>
              ))}
            </div>
          )
        }
        <span className="text-text-3">{"]"}</span>
      </span>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-text-3">{"{}"}</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} className="text-text-4 hover:text-blue font-mono text-xs mr-1">
          {collapsed ? "▶" : "▼"}
        </button>
        <span className="text-text-3">{"{"}</span>
        {collapsed
          ? <span className="text-text-4 cursor-pointer" onClick={() => setCollapsed(false)}> {entries.length} keys </span>
          : (
            <div style={{ marginLeft: indent + 16 }}>
              {entries.map(([k, v], i) => (
                <div key={k}>
                  <span className="text-blue">"{k}"</span>
                  <span className="text-text-3">: </span>
                  <TreeNode value={v} depth={depth + 1} />
                  {i < entries.length - 1 ? <span className="text-text-4">,</span> : null}
                </div>
              ))}
            </div>
          )
        }
        <span className="text-text-3">{"}"}</span>
      </span>
    );
  }

  return <span>{String(value)}</span>;
}

export default function JSONFormatterClient() {
  const [state, setState, isLoaded] = usePersistentState('json-formatter', {
    tab: "beautify" as "beautify" | "minify",
    input: "",
    indent: 2 as Indent,
    treeView: false
  });

  const { tab, input, indent, treeView } = state;

  const setTab = (t: "beautify" | "minify") => setState(prev => ({ ...prev, tab: t, treeView: false }));
  const setInput = (i: string) => setState(prev => ({ ...prev, input: i }));
  const setIndent = (v: Indent) => setState(prev => ({ ...prev, indent: v }));
  const setTreeView = (v: boolean) => setState(prev => ({ ...prev, treeView: v }));

  const { output, error, parsed } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null, parsed: null };
    try {
      const obj = JSON.parse(input);
      let out = "";
      if (tab === "minify") {
        out = JSON.stringify(obj);
      } else {
        const spaces = indent === "tab" ? "\t" : indent;
        out = JSON.stringify(obj, null, spaces);
      }
      return { output: out, error: null, parsed: obj };
    } catch (e) {
      const msg = (e as Error).message;
      const lineMatch = msg.match(/position (\d+)/);
      let errorData: { message: string; line?: number } = { message: msg };
      if (lineMatch) {
        const pos = Number(lineMatch[1]);
        const line = input.slice(0, pos).split("\n").length;
        errorData = { message: msg, line };
      }
      return { output: "", error: errorData, parsed: null };
    }
  }, [input, tab, indent]);

  if (!isLoaded) return <div className="animate-pulse h-[400px] bg-surface/50 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            {(["beautify", "minify"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setTreeView(false); }}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
              >
                {t === "beautify" ? "Beautify" : "Minify"}
              </button>
            ))}
          </div>

          {tab === "beautify" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-4">Indent:</span>
              {([2, 4, "tab"] as Indent[]).map(v => (
                <button
                  key={String(v)}
                  onClick={() => setIndent(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${indent === v ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
                >
                  {v === "tab" ? "Tab" : `${v} spaces`}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={10}
          placeholder='Paste JSON here, e.g. {"name":"KaruviLab"}'
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500 font-mono">
            {error.line ? <span className="font-bold">Line {error.line}: </span> : null}
            {error.message}
          </div>
        )}

        {!error && input && (
          <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
            <span>✓</span><span>Valid JSON</span>
          </div>
        )}
      </div>

      {output && !error && (
        <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setTreeView(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!treeView ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
              >
                Raw
              </button>
              <button
                onClick={() => setTreeView(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${treeView ? "bg-blue text-white" : "bg-bg border border-border text-text-2 hover:border-blue"}`}
              >
                Tree
              </button>
            </div>
            <CopyButton text={output} />
          </div>

          {treeView && parsed !== null ? (
            <div className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text overflow-auto max-h-[400px]">
              <TreeNode value={parsed} depth={0} />
            </div>
          ) : (
            <textarea
              readOnly
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text resize-none outline-none"
              rows={12}
              value={output}
            />
          )}
        </div>
      )}
    </div>
  );
}
