"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find(c => c.id === "seo")!;
const TWITTER_CARDS = ["summary", "summary_large_image"];

export default function OgPreviewClient() {
  const [url, setUrl] = useState("https://example.com/page");
  const [title, setTitle] = useState("Your Amazing Page Title Here");
  const [desc, setDesc] = useState("A short description that appears under the title in social media previews and search results.");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("Example Site");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");

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
        <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
          <h2 className="font-black text-text text-sm uppercase tracking-widest border-b border-border pb-3">Page Details</h2>
          
          <ToolInput
            label="URL"
            value={url}
            onChange={setUrl}
            placeholder="https://example.com/page"
          />

          <ToolInput
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="Page Title"
          />

          <ToolInput
            label="Description"
            value={desc}
            onChange={setDesc}
            placeholder="Page description..."
            rows={3}
            mono
          />

          <ToolInput
            label="Image URL"
            value={image}
            onChange={setImage}
            placeholder="https://example.com/og-image.jpg"
          />

          <div className="grid grid-cols-2 gap-4">
            <ToolInput
              label="Site Name"
              value={siteName}
              onChange={setSiteName}
              placeholder="My Website"
            />
            <div className="space-y-2">
              <label htmlFor="twitter-card-select" className="text-sm font-bold text-text-2">Twitter Card</label>
              <select 
                id="twitter-card-select"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all text-base min-h-[48px]" 
                value={twitterCard} 
                onChange={e => setTwitterCard(e.target.value)}
              >
                {TWITTER_CARDS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Previews */}
        <div className="space-y-6">
          {/* Google Search */}
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-3">
            <h2 className="font-black text-text text-sm uppercase tracking-widest">Google Search</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-border max-w-[560px] shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-blue rounded-full flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-3 font-bold">{displaySite}</p>
                  <p className="text-xs text-green-700 dark:text-green-400">{displayUrl}</p>
                </div>
              </div>
              <p className="text-blue text-lg font-medium truncate">{displayTitle}</p>
              <p className="text-sm text-text-3 mt-1 line-clamp-2 leading-relaxed">{displayDesc}</p>
            </div>
          </div>

          {/* Facebook / OG */}
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-3">
            <h2 className="font-black text-text text-sm uppercase tracking-widest">Facebook / Open Graph</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border overflow-hidden max-w-[480px] shadow-sm">
              {image ? (
                <img src={image} alt="Facebook Open Graph preview" className="w-full h-[252px] object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-[252px] bg-bg flex items-center justify-center text-text-4 text-sm font-bold uppercase tracking-widest">
                  No image — add an OG Image URL
                </div>
              )}
              <div className="p-4 border-t border-border bg-bg/30">
                <p className="text-[10px] uppercase text-text-4 tracking-widest font-black">{hostname}</p>
                <p className="font-bold text-text mt-1 line-clamp-1">{displayTitle}</p>
                <p className="text-sm text-text-3 mt-1 line-clamp-2 leading-relaxed">{displayDesc}</p>
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-3">
            <h2 className="font-black text-text text-sm uppercase tracking-widest">Twitter / X Card</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border overflow-hidden max-w-[480px] shadow-sm">
              {twitterCard === "summary_large_image" ? (
                <>
                  {image ? (
                    <img src={image} alt="Twitter card preview large" className="w-full h-[200px] object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-[200px] bg-bg flex items-center justify-center text-text-4 text-sm font-bold uppercase tracking-widest">No image</div>
                  )}
                  <div className="p-4 bg-bg/30">
                    <p className="font-bold text-text line-clamp-1">{displayTitle}</p>
                    <p className="text-sm text-text-3 mt-1 line-clamp-2 leading-relaxed">{displayDesc}</p>
                    <p className="text-[10px] text-text-4 mt-2 font-black uppercase tracking-widest">{hostname}</p>
                  </div>
                </>
              ) : (
                <div className="flex gap-4 p-4 bg-bg/30">
                  {image ? (
                    <img src={image} alt="Twitter card preview small" className="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-border" />
                  ) : (
                    <div className="w-24 h-24 bg-bg rounded-xl flex-shrink-0 flex items-center justify-center text-text-4 text-xs font-black uppercase border border-border">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text line-clamp-1">{displayTitle}</p>
                    <p className="text-sm text-text-3 mt-1 line-clamp-2 leading-relaxed">{displayDesc}</p>
                    <p className="text-[10px] text-text-4 mt-2 font-black uppercase tracking-widest">{hostname}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
}
