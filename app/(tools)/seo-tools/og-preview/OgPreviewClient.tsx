"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "seo")!;
const TWITTER_CARDS = ["summary", "summary_large_image"];

export default function OgPreviewClient() {
  const [url, setUrl] = useState("https://example.com/page");
  const [title, setTitle] = useState("Your Amazing Page Title Here");
  const [desc, setDesc] = useState("A short description that appears under the title in social media previews and search results.");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("Example Site");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";
  const displayTitle = title || "Page Title";
  const displayDesc = desc || "Page description goes here.";
  const displayUrl = url || "https://example.com";
  const displaySite = siteName || "Site Name";

  const hostname = (() => {
    try { return new URL(displayUrl).hostname; } catch { return displayUrl; }
  })();

  return (
    
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Page Details</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium">URL</label>
            <input type="url" className={inputClass} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input type="text" className={inputClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="Page Title" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea className={`${inputClass} font-mono text-sm resize-none`} rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Page description..." />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <input type="url" className={inputClass} value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/og-image.jpg" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Site Name</label>
            <input type="text" className={inputClass} value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="My Website" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Twitter Card Type</label>
            <select className={inputClass} value={twitterCard} onChange={e => setTwitterCard(e.target.value)}>
              {TWITTER_CARDS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Previews */}
        <div className="space-y-6">
          {/* Google Search */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Google Search</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-border max-w-[560px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-blue rounded-full flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-3">{displaySite}</p>
                  <p className="text-xs text-green-700 dark:text-green-400">{displayUrl}</p>
                </div>
              </div>
              <p className="text-blue text-lg font-medium hover:underline cursor-pointer truncate">{displayTitle}</p>
              <p className="text-sm text-text-3 mt-1 line-clamp-2 leading-relaxed">{displayDesc}</p>
            </div>
          </div>

          {/* Facebook / OG */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Facebook / Open Graph</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border overflow-hidden max-w-[480px]">
              {image ? (
                <img src={image} alt="OG preview" className="w-full h-[252px] object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-[252px] bg-bg flex items-center justify-center text-text-4 text-sm">
                  No image — add an OG Image URL
                </div>
              )}
              <div className="p-3 border-t border-border">
                <p className="text-xs uppercase text-text-4 tracking-wider">{hostname}</p>
                <p className="font-bold text-text mt-0.5 line-clamp-1">{displayTitle}</p>
                <p className="text-sm text-text-3 mt-0.5 line-clamp-2">{displayDesc}</p>
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Twitter / X Card</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border overflow-hidden max-w-[480px]">
              {twitterCard === "summary_large_image" ? (
                <>
                  {image ? (
                    <img src={image} alt="Twitter card preview" className="w-full h-[200px] object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-[200px] bg-bg flex items-center justify-center text-text-4 text-sm">No image</div>
                  )}
                  <div className="p-3">
                    <p className="font-bold text-text line-clamp-1">{displayTitle}</p>
                    <p className="text-sm text-text-3 mt-1 line-clamp-2">{displayDesc}</p>
                    <p className="text-xs text-text-4 mt-1">{hostname}</p>
                  </div>
                </>
              ) : (
                <div className="flex gap-3 p-3">
                  {image ? (
                    <img src={image} alt="" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-bg rounded-lg flex-shrink-0 flex items-center justify-center text-text-4 text-xs">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text line-clamp-1">{displayTitle}</p>
                    <p className="text-sm text-text-3 mt-1 line-clamp-2">{displayDesc}</p>
                    <p className="text-xs text-text-4 mt-1">{hostname}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
}
