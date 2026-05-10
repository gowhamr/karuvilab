"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "seo")!;

interface RuleSet {
  id: number;
  userAgent: string;
  allow: string;
  disallow: string;
  crawlDelay: string;
}

let nextId = 1;

export default function RobotsTxtBuilderClient() {
  const [rules, setRules] = useState<RuleSet[]>([
    { id: nextId++, userAgent: "*", allow: "/", disallow: "/admin, /private", crawlDelay: "" },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm";

  const addRule = () => {
    setRules(r => [...r, { id: nextId++, userAgent: "*", allow: "", disallow: "", crawlDelay: "" }]);
  };

  const removeRule = (id: number) => {
    setRules(r => r.filter(x => x.id !== id));
  };

  const updateRule = (id: number, field: keyof RuleSet, value: string) => {
    setRules(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));
  };

  const parsePaths = (s: string) =>
    s.split(/[\n,]/).map(p => p.trim()).filter(p => p.length > 0);

  const generated = useMemo(() => {
    const lines: string[] = [];
    rules.forEach((rule, i) => {
      if (i > 0) lines.push("");
      lines.push(`User-agent: ${rule.userAgent || "*"}`);
      parsePaths(rule.allow).forEach(p => lines.push(`Allow: ${p}`));
      parsePaths(rule.disallow).forEach(p => lines.push(`Disallow: ${p}`));
      if (rule.crawlDelay) lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    });
    if (sitemapUrl.trim()) {
      lines.push("");
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }
    return lines.join("\n");
  }, [rules, sitemapUrl]);

  const download = () => {
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={rule.id} className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Rule Set {idx + 1}</h3>
                {rules.length > 1 && (
                  <button onClick={() => removeRule(rule.id)} className="text-xs text-red-500 hover:text-red-600 font-medium">Remove</button>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-3">User-agent</label>
                <input className={inputClass} value={rule.userAgent} onChange={e => updateRule(rule.id, "userAgent", e.target.value)} placeholder="*" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-3">Allow paths (comma or newline separated)</label>
                <textarea className={`${inputClass} resize-none font-mono`} rows={2} value={rule.allow} onChange={e => updateRule(rule.id, "allow", e.target.value)} placeholder="/" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-3">Disallow paths (comma or newline separated)</label>
                <textarea className={`${inputClass} resize-none font-mono`} rows={2} value={rule.disallow} onChange={e => updateRule(rule.id, "disallow", e.target.value)} placeholder="/admin, /private" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-3">Crawl-delay (seconds, optional)</label>
                <input type="number" className={inputClass} value={rule.crawlDelay} onChange={e => updateRule(rule.id, "crawlDelay", e.target.value)} placeholder="e.g. 10" />
              </div>
            </div>
          ))}

          <button onClick={addRule} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-text-3 hover:border-blue hover:text-blue transition-colors text-sm font-medium">
            + Add User-agent Rule Set
          </button>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="font-bold text-sm">Sitemap URL</h3>
            <input type="url" className={inputClass} value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" />
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex-1">Generated robots.txt</h2>
            <CopyButton text={generated} />
            <button onClick={download} className="px-3 py-1.5 text-sm font-medium bg-blue text-white rounded-lg hover:opacity-90 transition-opacity">
              Download
            </button>
          </div>
          <pre className="bg-bg border border-border rounded-xl p-4 font-mono text-sm text-text-3 overflow-x-auto whitespace-pre min-h-[300px]">
            {generated}
          </pre>
        </div>
      </div>
    
  );
}
