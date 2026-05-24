"use client";

import { useState, useMemo, useEffect } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolInput } from "@/components/ui/ToolInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { usePersistentState } from "@/src/lib/hooks";
import { Code, Network, Info, FileJson, Layers, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { workerManager } from "@/src/workers/manager";
import { StatusBadge } from "@/components/system/StatusBadge";
import { EmptyState } from "@/components/system/EmptyState";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";

type Indent = 2 | 4 | "tab";

interface TreeNodeProps {
  value: unknown;
  depth?: number;
  maxAutoExpandDepth?: number;
}

const MAX_ITEMS = 100;

function TreeNode({ value, depth = 0, maxAutoExpandDepth = 10 }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(depth >= maxAutoExpandDepth);
  const [showAll, setShowAll] = useState(false);
  const indent = depth * 16;

  if (value === null) return <span className="text-text-4">null</span>;
  if (typeof value === "boolean") return <span className="text-blue font-bold">{String(value)}</span>;
  if (typeof value === "number") return <span className="text-emerald-500 font-mono">{value}</span>;
  if (typeof value === "string") return <span className="text-amber-500">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-text-3">[]</span>;
    const items = showAll ? value : value.slice(0, MAX_ITEMS);
    const hasMore = value.length > MAX_ITEMS && !showAll;

    return (
      <span className="font-mono">
        <button 
          onClick={() => setCollapsed(c => !c)} 
          className="text-text-4 hover:text-blue transition-colors text-[10px] mr-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-blue/5"
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <span className="text-text-3">{"["}</span>
        {collapsed
          ? <span className="text-text-4 cursor-pointer hover:text-text transition-colors italic text-xs px-1" onClick={() => setCollapsed(false)}> {value.length} items </span>
          : (
            <div style={{ marginLeft: 16 }}>
              {items.map((item, i) => (
                <div key={i}><TreeNode value={item} depth={depth + 1} maxAutoExpandDepth={maxAutoExpandDepth} />{i < value.length - 1 ? <span className="text-text-4">,</span> : null}</div>
              ))}
              {hasMore && (
                <button 
                  onClick={() => setShowAll(true)}
                  className="text-blue hover:underline text-[10px] font-black uppercase tracking-widest mt-2 block"
                >
                  + Show all {value.length} items
                </button>
              )}
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
    
    const items = showAll ? entries : entries.slice(0, MAX_ITEMS);
    const hasMore = entries.length > MAX_ITEMS && !showAll;

    return (
      <span className="font-mono">
        <button 
          onClick={() => setCollapsed(c => !c)} 
          className="text-text-4 hover:text-blue transition-colors text-[10px] mr-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-blue/5"
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <span className="text-text-3">{"{"}</span>
        {collapsed
          ? <span className="text-text-4 cursor-pointer hover:text-text transition-colors italic text-xs px-1" onClick={() => setCollapsed(false)}> {entries.length} keys </span>
          : (
            <div style={{ marginLeft: 16 }}>
              {items.map(([k, v], i) => (
                <div key={k} className="flex items-start gap-1">
                  <span className="text-blue font-bold flex-shrink-0">"{k}"</span>
                  <span className="text-text-3 flex-shrink-0">: </span>
                  <TreeNode value={v} depth={depth + 1} maxAutoExpandDepth={maxAutoExpandDepth} />
                  {i < entries.length - 1 ? <span className="text-text-4">,</span> : null}
                </div>
              ))}
              {hasMore && (
                <button 
                  onClick={() => setShowAll(true)}
                  className="text-blue hover:underline text-[10px] font-black uppercase tracking-widest mt-2 block"
                >
                  + Show all {entries.length} keys
                </button>
              )}
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
    mode: "beautify" as "beautify" | "minify",
    input: "",
    indent: 2 as Indent,
    view: "raw" as "raw" | "tree"
  });

  const { mode, input, indent, view } = state;
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ output: string; error: any; parsed: any }>({ 
    output: "", error: null, parsed: null 
  });

  const setMode = (m: "beautify" | "minify") => setState(prev => ({ ...prev, mode: m, view: "raw" }));
  const setInput = (i: string) => setState(prev => ({ ...prev, input: i }));
  const setIndent = (v: Indent) => setState(prev => ({ ...prev, indent: v }));
  const setView = (v: "raw" | "tree") => setState(prev => ({ ...prev, view: v }));

  useEffect(() => {
    if (!input.trim()) {
      setResult({ output: "", error: null, parsed: null });
      setIsProcessing(false);
      return;
    }

    const abortController = new AbortController();

    const run = async () => {
      // Threshold: 500KB
      if (input.length < 500 * 1024) {
        setIsProcessing(false);
        try {
          const obj = JSON.parse(input);
          let out = "";
          if (mode === "minify") {
            out = JSON.stringify(obj);
          } else {
            const spaces = indent === "tab" ? "\t" : indent;
            out = JSON.stringify(obj, null, spaces);
          }
          setResult({ output: out, error: null, parsed: obj });
        } catch (e) {
          const msg = (e as Error).message;
          const lineMatch = msg.match(/position (\d+)/);
          let errorData: { message: string; line?: number } = { message: msg };
          if (lineMatch) {
            const pos = Number(lineMatch[1]);
            const line = input.slice(0, pos).split("\n").length;
            errorData = { message: msg, line };
          }
          setResult({ output: "", error: errorData, parsed: null });
        }
      } else {
        setIsProcessing(true);
        try {
          const res = await workerManager.processJson(input, mode, indent, abortController.signal);
          if (!abortController.signal.aborted) {
            // Re-calculate line error for worker result if needed (worker returns raw message)
            if (res.error) {
              const msg = res.error.message;
              const lineMatch = msg.match(/position (\d+)/);
              if (lineMatch) {
                const pos = Number(lineMatch[1]);
                res.error.line = input.slice(0, pos).split("\n").length;
              }
            }
            setResult(res);
            setIsProcessing(false);
          }
        } catch (err: any) {
          if (!abortController.signal.aborted) {
            setResult({ output: "", error: { message: formatError(err) }, parsed: null });
            setIsProcessing(false);
          }
        }      }
    };

    run();

    return () => abortController.abort();
  }, [input, mode, indent]);

  const { output, error, parsed } = result;

  if (!isLoaded) return <div className="animate-pulse h-[500px] bg-surface/50 rounded-[32px] border border-border" />;

  return (
    <div className="space-y-12">
      {/* Configuration & Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-border rounded-[32px] p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden">
            {isProcessing && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue/10 overflow-hidden">
                <div className="h-full bg-blue animate-progress w-full" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
                <FileJson className="w-4 h-4" />
                Source JSON
              </h2>
              
              <div className="flex items-center gap-4">
                 <SegmentedControl
                   options={[
                     { id: "beautify", label: "Beautify", icon: <Sparkles className="w-3 h-3" /> },
                     { id: "minify", label: "Minify", icon: <Layers className="w-3 h-3" /> }
                   ]}
                   activeId={mode}
                   onChange={setMode}
                 />
              </div>
            </div>

            <ToolInput
              label="Input Data"
              value={input}
              onChange={setInput}
              placeholder='Paste JSON here, e.g. {"name":"KaruviLab"}'
              rows={12}
              mono
              error={error?.message}
              description={error?.line ? `Error on line ${error.line}` : undefined}
              loading={isProcessing}
            />

            {!error && input && !isProcessing && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl w-fit">
                <span className="text-emerald-500 text-xs">✓</span>
                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Valid JSON Structure</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 px-2">Settings</h2>
          
          <div className="bg-surface border border-border rounded-[32px] p-6 space-y-6 shadow-sm">
            {mode === "beautify" && (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-3">Indentation</label>
                <div className="flex flex-wrap gap-2">
                  {([2, 4, "tab"] as Indent[]).map(v => (
                    <button
                      key={String(v)}
                      onClick={() => setIndent(v)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        indent === v 
                          ? "bg-blue border-blue text-white shadow-lg shadow-blue/20" 
                          : "bg-bg border-border text-text-2 hover:border-blue/30"
                      )}
                    >
                      {v === "tab" ? "Tab" : `${v} Spc`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue/5 border border-blue/10 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue">
                <Info className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-dark">Pro Tip</span>
              </div>
              <p className="text-[11px] text-text-3 leading-relaxed font-medium">
                Switch to <span className="text-blue font-bold">Tree View</span> in the results area to explore complex nested objects without losing context.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Output & Visualization Section */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
              <Code className="w-4 h-4" />
              Processed Output
            </h2>
            <StatusBadge status={isProcessing ? "processing" : error ? "error" : output ? "complete" : "idle"} />
            <PrivacyBadge message="Local processing" className="ml-2 hidden sm:inline-flex" />
          </div>
          <div className="flex items-center gap-3">
            <SegmentedControl
              options={[
                { id: "raw", label: "Raw", icon: <FileJson className="w-3 h-3" /> },
                { id: "tree", label: "Tree", icon: <Network className="w-3 h-3" /> }
              ]}
              activeId={view}
              onChange={setView}
              disabled={isProcessing}
            />
            <CopyButton text={output} disabled={isProcessing || !output} />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[32px] p-2 shadow-sm min-h-[400px] relative">
          {(!output && !isProcessing && !error) ? (
            <EmptyState 
              title="No Data"
              description="Enter JSON in the input field to see the formatted output here."
              icon={<Code className="w-6 h-6" />}
              workflow={["Paste your JSON payload", "Choose Beautify or Minify", "Explore in Tree View"]}
            />
          ) : isProcessing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-4 text-blue">
              <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center animate-pulse">
                <FileJson size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-text">Processing Data</p>
                <p className="text-xs text-text-4 font-bold uppercase tracking-wider">Formatting large JSON payload in background...</p>
              </div>
            </div>
          ) : view === "tree" && parsed !== null ? (
            <div className="p-6 space-y-6">
              {(input.length > 2 * 1024 * 1024 || JSON.stringify(parsed).length > 2 * 1024 * 1024) && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    <span className="font-black uppercase tracking-widest text-[10px] block mb-1">Performance Mode</span>
                    Large JSON structure detected. To maintain responsiveness, nested levels beyond depth 10 are collapsed and large collections are truncated to {MAX_ITEMS} items.
                  </p>
                </div>
              )}
              <div className="w-full px-6 py-4 bg-bg border border-border rounded-2xl overflow-auto max-h-[600px] custom-scrollbar">
                <TreeNode value={parsed} depth={0} maxAutoExpandDepth={10} />
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              className="w-full min-h-[400px] p-6 sm:p-8 bg-transparent font-mono text-sm text-text-2 resize-none outline-none custom-scrollbar"
              value={output}
              placeholder="Results will appear here..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
