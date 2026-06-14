"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find(c => c.id === "seo")!;

const OG_TYPES = ["website", "article", "book", "profile", "music.song", "video.movie"];
const TWITTER_CARDS = ["summary", "summary_large_image"];
const ROBOTS_OPTIONS = ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"];

export default function MetaTagsGeneratorClient() {
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
    
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column - inputs */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-black text-text text-sm uppercase tracking-widest border-b border-border pb-3">Basic SEO</h2>

            <ToolInput
              label="Page Title"
              value={title}
              onChange={setTitle}
              placeholder="My Awesome Page"
              description={`${titleLen}/60`}
            />
            {titleLen > 60 && <p className="text-xs font-bold text-red-500 uppercase tracking-tight">Title exceeds 60 characters — may be truncated in search results.</p>}

            <ToolInput
              label="Meta Description"
              value={desc}
              onChange={setDesc}
              placeholder="A brief description of this page for search engines..."
              rows={3}
              mono
              description={`${descLen}/160`}
            />
            {descLen > 160 && <p className="text-xs font-bold text-red-500 uppercase tracking-tight">Description exceeds 160 characters — may be truncated.</p>}

            <ToolInput
              label="Keywords"
              value={keywords}
              onChange={setKeywords}
              placeholder="seo, meta tags, html"
              description="Comma-separated"
            />

            <div className="grid grid-cols-2 gap-4">
              <ToolInput
                label="Author"
                value={author}
                onChange={setAuthor}
                placeholder="R Gowtham"
              />
              <div className="space-y-2">
                <label htmlFor="robots-select" className="text-sm font-bold text-text-2">Robots</label>
                <select id="robots-select" className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all text-base min-h-12" value={robots} onChange={e => setRobots(e.target.value)}>
                  {ROBOTS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <ToolInput
              label="Canonical URL"
              value={canonical}
              onChange={setCanonical}
              placeholder="https://example.com/page"
              type="text"
            />
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-black text-text text-sm uppercase tracking-widest border-b border-border pb-3">Open Graph & Twitter</h2>

            <ToolInput
              label="OG Title"
              value={ogTitle}
              onChange={setOgTitle}
              placeholder={title || "OG Title"}
              description="Leave blank to use Page Title"
            />

            <ToolInput
              label="OG Description"
              value={ogDesc}
              onChange={setOgDesc}
              placeholder={desc || "OG Description"}
              rows={2}
              mono
              description="Leave blank to use Meta Description"
            />

            <ToolInput
              label="OG Image URL"
              value={ogImage}
              onChange={setOgImage}
              placeholder="https://example.com/og-image.jpg"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="og-type-select" className="text-sm font-bold text-text-2">OG Type</label>
                <select id="og-type-select" className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all text-base min-h-12" value={ogType} onChange={e => setOgType(e.target.value)}>
                  {OG_TYPES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="twitter-card-select" className="text-sm font-bold text-text-2">Twitter Card</label>
                <select id="twitter-card-select" className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all text-base min-h-12" value={twitterCard} onChange={e => setTwitterCard(e.target.value)}>
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
              <h2 className="font-black text-text text-sm uppercase tracking-widest">Search Snippet Preview</h2>
              <div className="bg-bg rounded-xl p-4 border border-border max-w-full">
                <p className="text-blue text-base font-medium truncate">{title || "Page Title"}</p>
                <p className="text-green-600 text-xs mt-0.5 truncate">{canonical || "https://example.com/page"}</p>
                <p className="text-text-3 text-sm mt-1 line-clamp-2">{desc || "Page description will appear here."}</p>
              </div>
            </div>
          )}

          {/* Generated tags */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-text text-sm uppercase tracking-widest">Generated HTML</h2>
              <CopyButton text={generated} label="Copy All" />
            </div>
            <pre className="bg-bg border border-border rounded-xl p-4 font-mono text-xs text-text-3 overflow-x-auto whitespace-pre-wrap">
              {generated || "Fill in the fields above to generate meta tags."}
            </pre>
          </div>
        </div>
      </div>
    
  );
}
