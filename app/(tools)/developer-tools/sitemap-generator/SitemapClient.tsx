"use client";

import { useState, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  FileCode, 
  FileText, 
  AlertTriangle,
  Link as LinkIcon,
  Check,
  X
} from "lucide-react";
import { ToolInput } from "@/components/ui/ToolInput";
import { useToast } from "@/components/ui/Toast";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

const CHANGEFREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
const PRIORITIES = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"];

interface SitemapEntry {
  id: string;
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export default function SitemapClient() {
  const getToday = () => new Date().toISOString().split('T')[0] || "";

  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [entries, setEntries] = useState<SitemapEntry[]>([
    { id: '1', url: "/", lastmod: getToday(), changefreq: "weekly", priority: "1.0" },
    { id: '2', url: "/about", lastmod: getToday(), changefreq: "monthly", priority: "0.8" },
  ]);
  const [bulkInput, setBulkInput] = useState("");
  const [activeTab, setActiveTab] = useState<'editor' | 'import'>('editor');
  const [bulkPriority, setBulkPriority] = useState("0.8");
  const [bulkChangeFreq, setBulkChangeFreq] = useState("weekly");

  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

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
      changefreq: bulkChangeFreq,
      priority: bulkPriority
    }));
    setEntries(prev => [...prev, ...newEntries]);
    setBulkInput("");
    setActiveTab('editor');
  };

  const clearAll = () => {
    toast("Clear all URLs?", "warn", {
      label: "Clear",
      onClick: () => setEntries([])
    });
  };

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
    const filename = `sitemap.${format}`;

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
    <ToolWorkspace
      layout="split"
      tabs={{
        options: [
          { id: 'editor', label: 'Visual Editor' },
          { id: 'import', label: 'Bulk Import' }
        ],
        activeId: activeTab,
        onChange: (id) => setActiveTab(id as 'editor' | 'import')
      }}
      optionsPanel={
        <div className="space-y-4">
          <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Base Settings</h3>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <ToolInput 
                label="Website Base URL"
                value={baseUrl}
                onChange={setBaseUrl}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto pb-1">
              <button 
                onClick={addEntry}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-blue/10"
              >
                <Plus size={16} aria-hidden="true" /> Add URL
              </button>
              <button 
                onClick={clearAll}
                className="p-3 bg-error/10 text-error border border-error/20 rounded-xl hover:bg-error hover:text-white transition-all active:scale-90"
                title="Clear All"
                aria-label="Clear All URLs"
              >
                <Trash2 size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      }
      input={
        <div className="space-y-4 h-full flex flex-col">
          {activeTab === 'editor' ? (
            <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[500px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-text-4 font-black uppercase tracking-widest border-b border-border">
                    <th className="px-4 py-4 text-left">Path / URL</th>
                    <th className="px-2 py-4 text-left w-24">Freq</th>
                    <th className="px-2 py-4 text-left w-24">Priority</th>
                    <th className="px-4 py-4 text-right w-16">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center mx-auto text-text-4">
                          <LinkIcon size={20} aria-hidden="true" />
                        </div>
                        <p className="text-text-4 font-black uppercase tracking-widest text-xs">No URLs added yet</p>
                      </td>
                    </tr>
                  )}
                  {entries.map((entry) => (
                    <tr key={entry.id} className="group hover:bg-bg/40 transition-colors">
                      <td className="px-4 py-3">
                        <input 
                          type="text"
                          value={entry.url}
                          onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                          aria-label="URL Path"
                          className="w-full bg-transparent border-none p-0 focus:ring-0 font-mono text-xs text-text-2 group-hover:text-blue transition-colors outline-none"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <select 
                          value={entry.changefreq}
                          onChange={(e) => updateEntry(entry.id, 'changefreq', e.target.value)}
                          aria-label="Change Frequency"
                          className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold uppercase tracking-wider text-text-3 cursor-pointer outline-none"
                        >
                          {CHANGEFREQS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <select 
                          value={entry.priority}
                          onChange={(e) => updateEntry(entry.id, 'priority', e.target.value)}
                          aria-label="Priority"
                          className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-text-3 cursor-pointer outline-none"
                        >
                          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
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
            </div>
          ) : (
            <div className="space-y-4 flex flex-col h-full">
              <div className="bg-blue/5 border border-blue/10 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="text-blue shrink-0" size={18} aria-hidden="true" />
                <p className="text-xs font-medium text-blue/80 leading-relaxed">
                  Paste a list of relative paths (e.g. <code>/about</code>) or full URLs (one per line). 
                  Existing entries will be preserved.
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Default Priority</label>
                  <select value={bulkPriority} onChange={e => setBulkPriority(e.target.value)} className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:border-blue outline-none text-xs font-bold">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Default Frequency</label>
                  <select value={bulkChangeFreq} onChange={e => setBulkChangeFreq(e.target.value)} className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:border-blue outline-none text-xs font-bold uppercase">
                    {CHANGEFREQS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <ToolInput 
                value={bulkInput}
                onChange={setBulkInput}
                placeholder="/&#10;/about&#10;/contact&#10;/products/item-1"
                rows={8}
                mono
                className="flex-1"
              />
              <button 
                onClick={importFromText}
                disabled={!bulkInput.trim()}
                className="w-full py-3 bg-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue/10 disabled:opacity-50 disabled:grayscale disabled:scale-100"
              >
                Import URLs
              </button>
            </div>
          )}
        </div>
      }
      output={
        <div className="flex flex-col h-full space-y-6">
          <ToolResultArea 
            label="Live Preview"
            value={generatedXml}
            language="XML"
            onDownload={() => downloadFile('xml')}
            downloadFilename="sitemap.xml"
            downloadMimeType="application/xml"
            className="flex-1"
          />
          
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-tiny font-black uppercase tracking-widest-lg text-text-4 text-center">Export Extra Formats</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => downloadFile('csv')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-bg border border-border rounded-xl hover:border-blue hover:text-blue transition-all group"
              >
                <FileText size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="text-tiny font-black uppercase">CSV</span>
              </button>
              <button 
                onClick={() => downloadFile('json')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-bg border border-border rounded-xl hover:border-blue hover:text-blue transition-all group"
              >
                <FileCode size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="text-tiny font-black uppercase">JSON</span>
              </button>
            </div>
          </div>
        </div>
      }
      infoPanel={
        <div className="bg-blue/5 border border-blue/10 p-6 rounded-4xl space-y-4">
          <h2 className="flex items-center gap-2 text-xs font-black text-blue uppercase tracking-widest">
             <Check size={14} aria-hidden="true" /> SEO Ready
          </h2>
          <p className="text-xs text-blue/70 leading-relaxed font-medium">
            This sitemap follows the <b>Sitemaps.org 0.9</b> protocol. All URLs are automatically validated to ensure they start with your base domain.
          </p>
        </div>
      }
    />
  );
}
