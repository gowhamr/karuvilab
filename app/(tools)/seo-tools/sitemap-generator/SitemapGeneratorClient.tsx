"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find(c => c.id === "seo")!;
const CHANGEFREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export default function SitemapGeneratorClient() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [paths, setPaths] = useState("/\n/about\n/contact\n/blog\n/products");
  const [priority, setPriority] = useState("0.8");
  const [changefreq, setChangefreq] = useState("weekly");
  const [includeDate, setIncludeDate] = useState(true);

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

  const { createUrl, revokeUrl } = useObjectUrlManager();

  const download = () => {
    const blob = new Blob([sitemap], { type: "application/xml" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    revokeUrl(url);
  };

  const selectClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl text-base font-bold focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all cursor-pointer appearance-none";

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
            <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Configuration</h2>

            <ToolInput
              label="Base URL"
              type="text"
              value={baseUrl}
              onChange={setBaseUrl}
              placeholder="https://example.com"
            />

            <ToolInput
              label="Page Paths (one per line)"
              rows={6}
              value={paths}
              onChange={setPaths}
              placeholder="/"
              mono
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Default Priority</label>
                <div className="relative">
                  <select className={selectClass} value={priority} onChange={e => setPriority(e.target.value)}>
                    {["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1.0"].map(v => <option key={v}>{v}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-4">▼</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2">Changefreq</label>
                <div className="relative">
                  <select className={selectClass} value={changefreq} onChange={e => setChangefreq(e.target.value)}>
                    {CHANGEFREQS.map(f => <option key={f} className="capitalize">{f}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-4">▼</div>
                </div>
              </div>
            </div>

            <Checkbox
              label="Include today's date as lastmod"
              checked={includeDate}
              onChange={e => setIncludeDate(e.target.checked)}
            />
          </div>

          {/* Pages table */}
          <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-black text-text-2 text-sm uppercase tracking-widest">Pages ({pages.length})</h2>
              <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest bg-bg px-2 py-1 rounded-md">Indexed</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-[10px] text-text-4 font-black uppercase tracking-widest">#</th>
                    <th className="text-left py-3 text-[10px] text-text-4 font-black uppercase tracking-widest">Path</th>
                    <th className="text-left py-3 text-[10px] text-text-4 font-black uppercase tracking-widest">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {pages.map((p, i) => (
                    <tr key={i} className="hover:bg-bg/50 transition-colors group">
                      <td className="py-3 text-text-4 font-bold">{i + 1}</td>
                      <td className="py-3 font-mono text-xs text-text-2 truncate max-w-[200px] group-hover:text-blue transition-colors">{p.path}</td>
                      <td className="py-3 text-text-3 font-bold">{priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm space-y-6 flex flex-col h-full">
          <div className="flex items-center gap-3 flex-wrap border-b border-border pb-4">
            <h2 className="font-black text-text-2 text-sm uppercase tracking-widest flex-1">Generated Sitemap</h2>
            <div className="flex gap-2">
              <CopyButton text={sitemap} label="Copy XML" className="bg-bg border border-border" />
              <button 
                onClick={download} 
                className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-blue text-white rounded-xl hover:scale-[1.05] active:scale-[0.95] transition-all shadow-lg shadow-blue/20"
              >
                Download .xml
              </button>
            </div>
          </div>
          <div className="relative flex-1 group">
            <pre className="absolute inset-0 bg-bg border border-border rounded-2xl p-6 font-mono text-xs text-text-3 overflow-x-auto whitespace-pre overflow-y-auto custom-scrollbar shadow-inner">
              {sitemap}
            </pre>
          </div>
        </div>
      </div>
    
  );
}
