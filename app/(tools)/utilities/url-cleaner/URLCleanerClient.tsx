"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const TRACKING_PARAMS = new Set([
  // UTM
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  // Google
  "gclid", "gclsrc", "dclid",
  // Facebook
  "fbclid", "fb_source", "fb_ref",
  // Microsoft / Bing
  "msclkid",
  // Mailchimp
  "mc_eid", "mc_cid",
  // Others
  "ref", "source", "affiliate", "partner", "campaign", "ad_id", "ad_source",
  "ad_network", "adid", "adset_id", "adset_name", "ad_name", "creative_id",
  "_hsenc", "_hsmi", "hsCtaTracking",
  "igshid", "igsh",
  "mibextid",
  "ttclid",
  "twclid",
  "yclid",
  "zanpid",
  "__s",
  "vero_id",
  "vero_conv",
  "wickedid",
  "rdocstyled",
  "trk",
  "trkCampaign",
]);

function cleanURL(raw: string): { cleaned: string; removed: string[] } | { error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { cleaned: "", removed: [] };
  try {
    const url = new URL(trimmed);
    const removed: string[] = [];
    const toDelete: string[] = [];
    url.searchParams.forEach((_, key) => {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        toDelete.push(key);
        removed.push(key);
      }
    });
    toDelete.forEach(k => url.searchParams.delete(k));
    return { cleaned: url.toString(), removed };
  } catch {
    return { error: "Invalid URL. Make sure to include https:// or http://" };
  }
}

export default function URLCleanerClient() {
  const [input, setInput] = useState("");

  const result = useMemo(() => cleanURL(input), [input]);
  const hasError = "error" in result;
  const cleaned = !hasError ? result.cleaned : "";
  const removed = !hasError ? result.removed : [];

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label htmlFor="url-cleaner-input" className="text-sm font-bold text-text-2">Paste URL</label>
        <input
          id="url-cleaner-input"
          type="text"
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-sm"
          placeholder="https://example.com/page?utm_source=newsletter&utm_medium=email&fbclid=abc123"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {hasError && input && (
          <p className="text-sm text-red-500">{result.error}</p>
        )}
      </div>

      {cleaned && (
        <div className="space-y-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface border border-border p-4 rounded-xl text-center">
              <dd className="text-2xl font-black text-blue">{removed.length}</dd>
              <dt className="text-xs text-text-muted mt-1">Parameters Removed</dt>
            </div>
            <div className="bg-surface border border-border p-4 rounded-xl text-center">
              <dd className="text-2xl font-black text-text">
                {Math.round(((input.length - cleaned.length) / input.length) * 100)}%
              </dd>
              <dt className="text-xs text-text-muted mt-1">URL Shorter</dt>
            </div>
          </dl>

          <div className="bg-surface border border-border p-5 rounded-2xl space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Original URL</h3>
                <CopyButton text={input} label="Copy Original" />
              </div>
              <div className="font-mono text-xs text-text-3 break-all bg-bg border border-border rounded-xl p-3">
                {input}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Cleaned URL</h3>
                <CopyButton text={cleaned} label="Copy Cleaned" />
              </div>
              <div className="font-mono text-sm text-text break-all bg-bg border border-border rounded-xl p-3">
                {cleaned}
              </div>
            </div>
          </div>

          {removed.length > 0 && (
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
              <h2 className="text-sm font-bold text-text-2">Removed Parameters</h2>
              <div className="flex flex-wrap gap-2">
                {removed.map(param => (
                  <span key={param} className="px-3 py-1.5 text-xs font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">
                    {param}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
        <h2 className="text-sm font-bold text-text-2">Tracked Parameter Categories</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-text-3">
          {[
            ["UTM Tags", "utm_source, utm_medium, utm_campaign…"],
            ["Google", "gclid, dclid, gclsrc"],
            ["Facebook", "fbclid, fb_source, igshid"],
            ["Microsoft", "msclkid"],
            ["Mailchimp", "mc_eid, mc_cid"],
            ["Others", "ref, ttclid, twclid, yclid…"],
          ].map(([cat, params]) => (
            <div key={cat} className="bg-bg border border-border rounded-xl p-3">
              <dt className="font-bold text-text mb-0.5">{cat}</dt>
              <dd className="text-text-muted">{params}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
