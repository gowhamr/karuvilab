"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "seo")!;
const CHANGEFREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export default function SitemapGeneratorClient() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [paths, setPaths] = useState("/\n/about\n/contact\n/blog\n/products");
  const [priority, setPriority] = useState("0.8");
  const [changefreq, setChangefreq] = useState("weekly");
  const [includeDate, setIncludeDate] = useState(true);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const today = new Date().toISOString().split("T")[0];

  const pages = useMemo(() => {
    const base = baseUrl.replace(/\/$/, "");
    return paths
      .split("\n")
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        const path = p.startsWith("/") ? p : "/" + p;
        return { path, url: base + path };
      });
  }, [baseUrl, paths]);

  const sitemap = useMemo(() => {
    const entries = pages.map(({ url }) => [
      `  <url>`,
      `    <loc>${url}</loc>`,
      includeDate ? `    <lastmod>${today}</lastmod>` : null,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      `  </url>`,
    ].filter(Boolean).join("\n")).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
  }, [pages, priority, changefreq, includeDate, today]);

  const download = () => {
    const blob = new Blob([sitemap], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Configuration</h2>

            <div className="space-y-1">
              <label className="text-sm font-medium">Base URL</label>
              <input type="url" className={inputClass} value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://example.com" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Page Paths (one per line)</label>
              <textarea
                className={`${inputClass} font-mono text-sm resize-none`}
                rows={8}
                value={paths}
                onChange={e => setPaths(e.target.value)}
                placeholder="/"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Default Priority</label>
                <select className={inputClass} value={priority} onChange={e => setPriority(e.target.value)}>
                  {["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1.0"].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Changefreq</label>
                <select className={inputClass} value={changefreq} onChange={e => setChangefreq(e.target.value)}>
                  {CHANGEFREQS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={includeDate} onChange={e => setIncludeDate(e.target.checked)} className="rounded" />
              Include today&apos;s date as lastmod
            </label>
          </div>

          {/* Pages table */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Pages ({pages.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-4 font-medium">#</th>
                    <th className="text-left py-2 text-text-4 font-medium">Path</th>
                    <th className="text-left py-2 text-text-4 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((p, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-bg/50">
                      <td className="py-2 text-text-4">{i + 1}</td>
                      <td className="py-2 font-mono text-xs text-text-2 truncate max-w-[200px]">{p.path}</td>
                      <td className="py-2 text-text-3">{priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex-1">Generated Sitemap</h2>
            <CopyButton text={sitemap} label="Copy XML" />
            <button onClick={download} className="px-3 py-1.5 text-sm font-medium bg-blue text-white rounded-lg hover:opacity-90 transition-opacity">
              Download .xml
            </button>
          </div>
          <pre className="bg-bg border border-border rounded-xl p-4 font-mono text-xs text-text-3 overflow-x-auto whitespace-pre h-[500px] overflow-y-auto">
            {sitemap}
          </pre>
        </div>
      </div>
    
  );
}
