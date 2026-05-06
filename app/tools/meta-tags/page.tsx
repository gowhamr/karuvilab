"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "seo")!;

const OG_TYPES = ["website", "article", "book", "profile", "music.song", "video.movie"];
const TWITTER_CARDS = ["summary", "summary_large_image"];
const ROBOTS_OPTIONS = ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"];

export default function MetaTagsGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [canonical, setCanonical] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDesc, setOgDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
  const textareaClass = `${inputClass} font-mono text-sm resize-none`;

  const generated = [
    `<!-- Primary Meta Tags -->`,
    title ? `<title>${title}</title>` : null,
    title ? `<meta name="title" content="${title}" />` : null,
    desc ? `<meta name="description" content="${desc}" />` : null,
    keywords ? `<meta name="keywords" content="${keywords}" />` : null,
    author ? `<meta name="author" content="${author}" />` : null,
    robots ? `<meta name="robots" content="${robots}" />` : null,
    canonical ? `<link rel="canonical" href="${canonical}" />` : null,
    ``,
    `<!-- Open Graph / Facebook -->`,
    ogType ? `<meta property="og:type" content="${ogType}" />` : null,
    canonical ? `<meta property="og:url" content="${canonical}" />` : null,
    (ogTitle || title) ? `<meta property="og:title" content="${ogTitle || title}" />` : null,
    (ogDesc || desc) ? `<meta property="og:description" content="${ogDesc || desc}" />` : null,
    ogImage ? `<meta property="og:image" content="${ogImage}" />` : null,
    ``,
    `<!-- Twitter -->`,
    twitterCard ? `<meta property="twitter:card" content="${twitterCard}" />` : null,
    canonical ? `<meta property="twitter:url" content="${canonical}" />` : null,
    (ogTitle || title) ? `<meta property="twitter:title" content="${ogTitle || title}" />` : null,
    (ogDesc || desc) ? `<meta property="twitter:description" content="${ogDesc || desc}" />` : null,
    ogImage ? `<meta property="twitter:image" content="${ogImage}" />` : null,
  ].filter(l => l !== null).join("\n");

  const titleLen = title.length;
  const descLen = desc.length;

  return (
    <ToolShell
      title="Meta Tags Generator"
      description="Generate SEO-optimized HTML meta tags including Open Graph and Twitter Card tags."
      category={cat}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column - inputs */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Basic SEO</h2>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Page Title</label>
                <span className={`text-xs font-mono ${titleLen > 60 ? "text-red-500" : titleLen > 50 ? "text-yellow-500" : "text-text-4"}`}>
                  {titleLen}/60
                </span>
              </div>
              <input
                type="text"
                className={inputClass}
                placeholder="My Awesome Page"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              {titleLen > 60 && <p className="text-xs text-red-500">Title exceeds 60 characters — may be truncated in search results.</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Meta Description</label>
                <span className={`text-xs font-mono ${descLen > 160 ? "text-red-500" : descLen > 140 ? "text-yellow-500" : "text-text-4"}`}>
                  {descLen}/160
                </span>
              </div>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="A brief description of this page for search engines..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
              {descLen > 160 && <p className="text-xs text-red-500">Description exceeds 160 characters — may be truncated.</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Keywords (comma-separated)</label>
              <input type="text" className={inputClass} placeholder="seo, meta tags, html" value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Author</label>
                <input type="text" className={inputClass} placeholder="R Gowtham" value={author} onChange={e => setAuthor(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Robots</label>
                <select className={inputClass} value={robots} onChange={e => setRobots(e.target.value)}>
                  {ROBOTS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Canonical URL</label>
              <input type="url" className={inputClass} placeholder="https://example.com/page" value={canonical} onChange={e => setCanonical(e.target.value)} />
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Open Graph & Twitter</h2>

            <div className="space-y-1">
              <label className="text-sm font-medium">OG Title (leave blank to use Page Title)</label>
              <input type="text" className={inputClass} placeholder={title || "OG Title"} value={ogTitle} onChange={e => setOgTitle(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">OG Description (leave blank to use Meta Description)</label>
              <textarea className={textareaClass} rows={2} placeholder={desc || "OG Description"} value={ogDesc} onChange={e => setOgDesc(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">OG Image URL</label>
              <input type="url" className={inputClass} placeholder="https://example.com/og-image.jpg" value={ogImage} onChange={e => setOgImage(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">OG Type</label>
                <select className={inputClass} value={ogType} onChange={e => setOgType(e.target.value)}>
                  {OG_TYPES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Twitter Card</label>
                <select className={inputClass} value={twitterCard} onChange={e => setTwitterCard(e.target.value)}>
                  {TWITTER_CARDS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - output */}
        <div className="space-y-6">
          {/* Search snippet preview */}
          {(title || desc) && (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Search Snippet Preview</h2>
              <div className="bg-bg rounded-xl p-4 border border-border max-w-[600px]">
                <p className="text-blue text-base font-medium truncate">{title || "Page Title"}</p>
                <p className="text-green-600 text-xs mt-0.5 truncate">{canonical || "https://example.com/page"}</p>
                <p className="text-text-3 text-sm mt-1 line-clamp-2">{desc || "Page description will appear here."}</p>
              </div>
            </div>
          )}

          {/* Generated tags */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Generated HTML</h2>
              <CopyButton text={generated} label="Copy All" />
            </div>
            <pre className="bg-bg border border-border rounded-xl p-4 font-mono text-xs text-text-3 overflow-x-auto whitespace-pre-wrap">
              {generated || "Fill in the fields above to generate meta tags."}
            </pre>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
