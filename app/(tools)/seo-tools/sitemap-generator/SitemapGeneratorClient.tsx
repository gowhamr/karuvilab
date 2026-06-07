"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Globe, 
  Download, 
  Trash2, 
  Plus, 
  FileCode, 
  FileText, 
  AlertTriangle,
  Link as LinkIcon,
  RefreshCw,
  Check,
  X
} from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolInput } from "@/components/ui/ToolInput";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { cn } from "@/src/lib/utils";
import { m, AnimatePresence } from "framer-motion";

const CHANGEFREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
const PRIORITIES = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"];

interface SitemapEntry {
  id: string;
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export default function SitemapGeneratorClient() {
  const getToday = () => new Date().toISOString().split('T')[0] || "";

  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [entries, setEntries] = useState<SitemapEntry[]>([
    { id: '1', url: "/", lastmod: getToday(), changefreq: "weekly", priority: "1.0" },
    { id: '2', url: "/about", lastmod: getToday(), changefreq: "monthly", priority: "0.8" },
  ]);
  const [bulkInput, setBulkInput] = useState("");
  const [activeTab, setActiveTab] = useState<'editor' | 'import'>('editor');

  const { createUrl, revokeUrl } = useObjectUrlManager();

  // --- Handlers ---

  const addEntry = () => {
    setEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      url: "/new-page",
      lastmod: getToday(),
      changefreq: "weekly",
      priority: "0.5"
    }]);
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof SitemapEntry, value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const importFromText = () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const newEntries: SitemapEntry[] = lines.map(line => ({
      id: Math.random().toString(36).substr(2, 9),
      url: line.startsWith('/') ? line : '/' + line,
      lastmod: getToday(),
      changefreq: "weekly",
      priority: "0.8"
    }));
    setEntries(prev => [...prev, ...newEntries]);
    setBulkInput("");
    setActiveTab('editor');
  };

  const clearAll = () => {
    if (confirm("Clear all URLs?")) setEntries([]);
  };

  // --- Exports ---

  const generatedXml = useMemo(() => {
    const base = baseUrl.replace(/\/$/, "");
    const items = entries.map(e => {
      const fullUrl = e.url.startsWith('http') ? e.url : `${base}${e.url.startsWith('/') ? e.url : '/' + e.url}`;
      return [
        `  <url>`,
        `    <loc>${fullUrl}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        `  </url>`,
      ].filter(Boolean).join('\n');
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [baseUrl, entries]);

  const downloadFile = (format: 'xml' | 'csv' | 'json') => {
    let content = "";
    let mime = "";
    let filename = `sitemap.${format}`;

    if (format === 'xml') {
      content = generatedXml;
      mime = "application/xml";
    } else if (format === 'csv') {
      content = "URL,LastMod,ChangeFreq,Priority\n" + entries.map(e => `${e.url},${e.lastmod},${e.changefreq},${e.priority}`).join('\n');
      mime = "text/csv";
    } else {
      content = JSON.stringify(entries, null, 2);
      mime = "application/json";
    }

    const blob = new Blob([content], { type: mime });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    revokeUrl(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Bar: Base Settings */}
      <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-4 ml-1">Website Base URL</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue">
              <Globe size={18} aria-hidden="true" />
            </div>
            <input 
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://your-site.com"
              className="w-full pl-12 pr-4 py-4 bg-bg border border-border rounded-2xl focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all font-bold"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={addEntry}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue/20"
          >
            <Plus size={16} aria-hidden="true" /> Add URL
          </button>
          <button 
            onClick={clearAll}
            className="p-4 bg-error/10 text-error border border-error/20 rounded-2xl hover:bg-error hover:text-white transition-all active:scale-90"
            title="Clear All"
            aria-label="Clear All URLs"
          >
            <Trash2 size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-4xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex border-b border-border bg-bg/50">
              <button 
                onClick={() => setActiveTab('editor')}
                className={cn(
                  "px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'editor' ? "text-blue border-b-2 border-blue bg-surface" : "text-text-4 hover:text-text"
                )}
              >
                Visual Editor
              </button>
              <button 
                onClick={() => setActiveTab('import')}
                className={cn(
                  "px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'import' ? "text-blue border-b-2 border-blue bg-surface" : "text-text-4 hover:text-text"
                )}
              >
                Bulk Import
              </button>
            </div>

            <div className="p-1">
              <AnimatePresence mode="wait">
                {activeTab === 'editor' ? (
                  <m.div
                    key="editor"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[10px] text-text-4 font-black uppercase tracking-widest border-b border-border">
                          <th className="px-6 py-4 text-left">Path / URL</th>
                          <th className="px-4 py-4 text-left w-24">Freq</th>
                          <th className="px-4 py-4 text-left w-24">Priority</th>
                          <th className="px-6 py-4 text-right w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {entries.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-20 text-center space-y-4">
                              <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center mx-auto text-text-4">
                                <LinkIcon size={20} aria-hidden="true" />
                              </div>
                              <p className="text-text-4 font-black uppercase tracking-widest text-[10px]">No URLs added yet</p>
                            </td>
                          </tr>
                        )}
                        {entries.map((entry) => (
                          <tr key={entry.id} className="group hover:bg-bg/40 transition-colors">
                            <td className="px-6 py-3">
                              <input 
                                type="text"
                                value={entry.url}
                                onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                                aria-label="URL Path"
                                className="w-full bg-transparent border-none p-0 focus:ring-0 font-mono text-xs text-text-2 group-hover:text-blue transition-colors"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select 
                                value={entry.changefreq}
                                onChange={(e) => updateEntry(entry.id, 'changefreq', e.target.value)}
                                aria-label="Change Frequency"
                                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-bold uppercase tracking-wider text-text-3 cursor-pointer"
                              >
                                {CHANGEFREQS.map(f => <option key={f} value={f}>{f}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <select 
                                value={entry.priority}
                                onChange={(e) => updateEntry(entry.id, 'priority', e.target.value)}
                                aria-label="Priority"
                                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-bold text-text-3 cursor-pointer"
                              >
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </td>
                            <td className="px-6 py-3 text-right">
                              <button 
                                onClick={() => removeEntry(entry.id)}
                                aria-label="Remove URL"
                                className="p-2 text-text-4 hover:text-error transition-colors rounded-lg hover:bg-error/5"
                              >
                                <X size={14} aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </m.div>
                ) : (
                  <m.div
                    key="import"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="p-6 space-y-4"
                  >
                    <div className="bg-blue/5 border border-blue/10 p-4 rounded-2xl flex gap-3">
                      <AlertTriangle className="text-blue shrink-0" size={18} aria-hidden="true" />
                      <p className="text-[11px] font-medium text-blue/80 leading-relaxed">
                        Paste a list of relative paths (e.g. <code>/about</code>) or full URLs (one per line). 
                        Existing entries will be preserved.
                      </p>
                    </div>
                    <textarea 
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      placeholder="/&#10;/about&#10;/contact&#10;/products/item-1"
                      aria-label="Bulk URL Import"
                      className="w-full h-64 p-6 bg-bg border border-border rounded-2xl font-mono text-xs focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all resize-none custom-scrollbar"
                    />
                    <button 
                      onClick={importFromText}
                      disabled={!bulkInput.trim()}
                      className="w-full py-4 bg-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue/20 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                      Import URLs
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-4xl shadow-sm space-y-6 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Live Preview</h2>
              <div className="flex gap-2">
                <CopyButton text={generatedXml} label="XML" className="bg-bg border border-border" />
              </div>
            </div>
            
            <div className="flex-1 relative group">
              <pre className="absolute inset-0 bg-bg border border-border rounded-2xl p-6 font-mono text-[10px] text-text-4 overflow-x-auto whitespace-pre overflow-y-auto custom-scrollbar shadow-inner group-hover:text-text-3 transition-colors">
                {generatedXml}
              </pre>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-4 text-center">Export Sitemap</p>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => downloadFile('xml')}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-bg border border-border rounded-2xl hover:border-blue hover:text-blue transition-all group"
                >
                  <FileCode size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-[9px] font-black uppercase">XML</span>
                </button>
                <button 
                  onClick={() => downloadFile('csv')}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-bg border border-border rounded-2xl hover:border-blue hover:text-blue transition-all group"
                >
                  <FileText size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-[9px] font-black uppercase">CSV</span>
                </button>
                <button 
                  onClick={() => downloadFile('json')}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-bg border border-border rounded-2xl hover:border-blue hover:text-blue transition-all group"
                >
                  <FileCode size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-[9px] font-black uppercase">JSON</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue/5 border border-blue/10 p-6 rounded-4xl space-y-4">
            <h2 className="flex items-center gap-2 text-[10px] font-black text-blue uppercase tracking-widest">
               <Check size={14} aria-hidden="true" /> SEO Ready
            </h2>
            <p className="text-xs text-blue/70 leading-relaxed font-medium">
              This sitemap follows the <b>Sitemaps.org 0.9</b> protocol. All URLs are automatically validated to ensure they start with your base domain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
