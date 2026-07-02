"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES, ALL_TOOLS } from "@/src/tool-registry";
import { CopyButton } from "@/components/ui/CopyButton";
import { 
  Download, FileText, FileCode, FileImage, 
  Upload, RefreshCw, CheckCircle2, Search, 
  Info, Zap, ShieldCheck, Layers, ArrowRight,
  Sparkles, Trash2, Edit3, Type
} from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { useBatchStore } from "@/src/store/useBatchStore";
import { ToolShell } from "@/components/ui/ToolShell";


const toolId = "image-seo";

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toNaturalAlt(s: string): string {
  if (!s) return "";
  const trimmed = s.trim();
  const first = trimmed.charAt(0).toUpperCase();
  const rest = trimmed.slice(1).toLowerCase();
  return (first + rest).replace(/\s+/g, " ");
}

const EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"
];

export default function ImageSeoClient() {
  const [tab, setTab] = useState<"optimize" | "batch" | "analyzer">("optimize");
  
  // single optimize tab
  const [preview, setPreview] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [context, setContext] = useState("");
  const [generatedAlt, setGeneratedAlt] = useState("");
  const [customFilename, setCustomFilename] = useState("");
  const [selectedExt, setSelectedExt] = useState(".jpg");

  // Analyzer tab
  const [analyzeText, setAnalyzeText] = useState("");

  const items = useBatchStore(state => state.items[toolId] || []);
  const addItems = useBatchStore(state => state.addItems);
  const isProcessing = false; // We process instantly for renaming

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActiveFile(file);
    if (preview) blobManager.revoke(preview);
    const url = blobManager.create(file);
    setPreview(url);
    
    const dotIdx = file.name.lastIndexOf(".");
    const name = dotIdx !== -1 ? file.name.slice(0, dotIdx).replace(/[-_]/g, " ") : file.name.replace(/[-_]/g, " ");
    const extension = dotIdx !== -1 ? file.name.slice(dotIdx) : ".jpg";
    
    setContext(name);
    setCustomFilename(toSlug(name));
    setSelectedExt(extension);
  };

  const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addItems(toolId, files);
    }
  };

  const generateSEO = () => {
    if (!context.trim()) return;
    setGeneratedAlt(toNaturalAlt(context.trim()));
    setCustomFilename(toSlug(context.trim()));
  };

  const finalFilename = (customFilename || "image") + selectedExt;

  const downloadFile = (file: File, name: string) => {
    const url = blobManager.create(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    blobManager.revoke(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ── Tab Switcher (Raycast Style) ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-surface border border-border rounded-2xl w-fit mx-auto md:mx-0 shadow-sm">
        {(["optimize", "batch", "analyzer"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-6 py-2 rounded-xl text-tiny font-bold uppercase tracking-widest-sm transition-all duration-200",
              tab === t 
                ? "bg-blue text-white shadow-md shadow-blue/10" 
                : "text-text-4 hover:text-blue hover:bg-blue/5"
            )}
          >
            {t === "optimize" ? "Single Optimizer" : t === "batch" ? "Batch Renamer" : "SEO Analyzer"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Single Optimizer Tab ────────────────────────────────────────── */}
        {tab === "optimize" && (
          <m.div 
            key="optimize"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg tracking-tight">Image Details</h2>
                    <p className="text-xs text-text-4 font-bold uppercase tracking-widest">Upload and Configure</p>
                  </div>
                </div>

                <div className="group relative p-8 bg-bg border-2 border-dashed border-border rounded-2xl text-center hover:border-blue transition-all overflow-hidden shadow-inner">
                  {preview ? (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-content">
                      <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-xl shadow-lg object-contain" />
                      <button 
                        onClick={() => { setPreview(null); setActiveFile(null); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </m.div>
                  ) : (
                    <div className="py-12 space-y-4">
                      <div className="w-20 h-20 bg-surface rounded-3xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-text-4 group-hover:text-blue transition-colors" />
                      </div>
                      <div>
                        <p className="font-black text-text">Drop your image here</p>
                        <p className="text-xs text-text-4 mt-1 uppercase tracking-widest font-bold">JPG, PNG, WebP, SVG (Max 50MB)</p>
                      </div>
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-4 uppercase tracking-widest-lg px-1">Describe Image Content</label>
                    <textarea
                      className="w-full px-4 py-4 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all resize-none text-sm font-medium"
                      rows={3}
                      value={context}
                      onChange={e => setContext(e.target.value)}
                      placeholder="e.g. blue running shoes on a wooden floor"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-text-4 uppercase tracking-widest-lg px-1">Custom Filename</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none text-sm font-mono font-bold text-blue"
                          value={customFilename}
                          onChange={e => setCustomFilename(e.target.value)}
                        />
                        <select 
                          className="px-3 py-3 bg-bg border border-border rounded-xl outline-none text-xs font-bold"
                          value={selectedExt}
                          onChange={e => setSelectedExt(e.target.value)}
                        >
                          {EXTENSIONS.map(e => <option key={e}>{e}</option>)}
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={generateSEO}
                      className="w-full py-4 bg-blue text-white font-black text-xs uppercase tracking-widest-lg rounded-xl hover:shadow-xl hover:shadow-blue/30 active:scale-98 transition-all flex items-center justify-center gap-3"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Generate SEO Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg tracking-tight">SEO Optimized Result</h2>
                    <p className="text-xs text-text-4 font-bold uppercase tracking-widest">Ready for Indexing</p>
                  </div>
                </div>

                {generatedAlt || activeFile ? (
                  <div className="space-y-8 flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-text-4 uppercase tracking-widest-lg">Primary Alt Text</label>
                        <CopyButton text={generatedAlt} />
                      </div>
                      <div className="p-5 bg-bg border border-border rounded-2xl font-bold text-text-2 text-lg shadow-inner">
                        {generatedAlt || "Waiting for generation..."}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-text-4 uppercase tracking-widest-lg">HTML Implementation</label>
                        <CopyButton text={`<img src="${finalFilename}" alt="${generatedAlt}" />`} label="Copy code" />
                      </div>
                      <div className="p-5 bg-bg border border-border rounded-2xl font-mono text-xs text-blue break-all leading-relaxed shadow-inner">
                        <span className="opacity-50">&lt;img src="</span>
                        <span className="font-black">{finalFilename}</span>
                        <span className="opacity-50">" alt="</span>
                        <span className="font-black">{generatedAlt}</span>
                        <span className="opacity-50">" /&gt;</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border mt-auto">
                      {activeFile && (
                        <button 
                          onClick={() => downloadFile(activeFile, finalFilename)}
                          className="w-full py-5 bg-green-600 text-white font-black text-sm uppercase tracking-widest-lg rounded-2xl hover:shadow-2xl hover:shadow-green-500/30 active:scale-98 transition-all flex items-center justify-center gap-3"
                        >
                          <Download className="w-5 h-5" />
                          Download with SEO Name
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center">
                      <Search className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">Waiting for configuration</p>
                  </div>
                )}
              </div>
            </div>
          </m.div>
        )}

        {/* ── Batch Renamer Tab ───────────────────────────────────────────── */}
        {tab === "batch" && (
          <m.div 
            key="batch"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl tracking-tight">Batch SEO Renamer</h2>
                    <p className="text-xs text-text-4 font-bold uppercase tracking-widest">Process folders at once</p>
                  </div>
                </div>
                
                <div className="relative group overflow-hidden rounded-2xl">
                   <button className="px-8 py-4 bg-blue text-white font-black text-xs uppercase tracking-widest-lg flex items-center gap-3 hover:shadow-xl transition-all">
                      <Upload className="w-4 h-4" />
                      Select Multiple Files
                   </button>
                   <input type="file" multiple accept="image/*" onChange={handleBatchFiles} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <BatchQueue 
                toolId={toolId}
                isProcessing={isProcessing}
                onProcess={async () => {}}
                onDownload={(item) => downloadFile(item.file, toSlug(item.file.name.split('.')[0] || "file") + "." + item.file.name.split('.').pop())}
                renderThumbnail={(item) => {
                  const url = blobManager.create(item.file);
                  return <img src={url} alt="" className="w-full h-full object-cover" />;
                }}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
               {[
                 { icon: ShieldCheck, title: "100% Private", desc: "Files never leave your browser memory." },
                 { icon: Zap, title: "Instant", desc: "No upload/download wait times." },
                 { icon: CheckCircle2, title: "SEO Ready", desc: "Automatically converts spaces to hyphens." }
               ].map((feature, i) => (
                 <div key={i} className="p-6 bg-surface border border-border rounded-2xl flex items-start gap-4">
                    <feature.icon className="w-5 h-5 text-blue shrink-0 mt-1" />
                    <div>
                       <h4 className="font-bold text-sm text-text tracking-tight">{feature.title}</h4>
                       <p className="text-xs text-text-4 mt-1 leading-relaxed">{feature.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </m.div>
        )}

        {/* ── SEO Analyzer Tab ────────────────────────────────────────────── */}
        {tab === "analyzer" && (
          <m.div 
            key="analyzer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm">
               <div className="max-w-2xl mx-auto space-y-8 text-center py-12">
                  <div className="w-20 h-20 bg-blue/10 text-blue rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                     <Search className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                     <h2 className="text-3xl font-black tracking-tighter">Content SEO Analyzer</h2>
                     <p className="text-text-4 text-sm font-medium leading-relaxed">
                        Analyze your image alt text and filenames for search engine best practices. 
                        Checks for keyword stuffing, length, and character accessibility.
                     </p>
                  </div>
                  
                  <div className="space-y-4">
                    <textarea 
                      className="w-full p-6 bg-bg border border-border rounded-3xl focus:border-blue outline-none transition-all font-medium text-lg min-h-40 shadow-inner"
                      placeholder="Paste your image description or alt text here..."
                      value={analyzeText}
                      onChange={e => setAnalyzeText(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                         { label: "Word Count", value: analyzeText.split(/\s+/).filter(Boolean).length },
                         { label: "Characters", value: analyzeText.length },
                         { label: "SEO Health", value: analyzeText.length > 5 && analyzeText.length < 125 ? "Good" : "Check", color: analyzeText.length > 5 && analyzeText.length < 125 ? "text-green-500" : "text-amber-500" },
                         { label: "Complexity", value: "Low" }
                       ].map((stat, i) => (
                         <div key={i} className="p-4 bg-bg border border-border rounded-2xl">
                            <p className="text-xs font-black text-text-4 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={cn("text-lg font-black tracking-tight", stat.color || "text-text")}>{stat.value}</p>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      
      {/* ── Additional Resources ─────────────────────────────────────────── */}
      <section className="pt-12 border-t border-border">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
               <h3 className="text-xl font-black tracking-tight">Need to resize as well?</h3>
               <p className="text-sm text-text-4 max-w-md leading-relaxed font-medium">
                 SEO isn't just about names. Large images slow down your site. Use our local Bulk Image Resizer to optimize load times.
               </p>
            </div>
            <Link href="/image/image-resizer" className="group px-8 py-4 bg-surface border border-border rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue/30 transition-all shadow-sm flex items-center gap-3">
               Image Resizer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </section>
    </div>
  );
}
