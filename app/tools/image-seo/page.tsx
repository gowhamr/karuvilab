"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "seo")!;

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toTitleCaseAlt(s: string): string {
  const stop = new Set(["a","an","the","in","on","at","of","and","or","but","for","to","with"]);
  return s
    .trim()
    .split(/\s+/)
    .map((w, i) => {
      if (i === 0 || !stop.has(w.toLowerCase())) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      }
      return w.toLowerCase();
    })
    .join(" ")
    .replace(/\.$/, "");
}

export default function ImageSeo() {
  const [tab, setTab] = useState<"alt" | "filename">("alt");
  // Alt text tab
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [context, setContext] = useState("");
  const [generatedAlt, setGeneratedAlt] = useState("");
  const [altSlug, setAltSlug] = useState("");
  // Filename tab
  const [filenameInput, setFilenameInput] = useState("");
  const [ext, setExt] = useState(".jpg");

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    setContext(name);
  };

  const generateAlt = () => {
    if (!context.trim()) return;
    const alt = toTitleCaseAlt(context.trim());
    setGeneratedAlt(alt);
    setAltSlug(toSlug(context.trim()));
  };

  const generatedFilename = toSlug(filenameInput) + ext;

  return (
    <ToolShell
      title="Image SEO Tool"
      description="Generate SEO-friendly alt text and filenames for your images."
      category={cat}
    >
      {/* Tab switcher */}
      <div className="flex gap-2">
        {(["alt", "filename"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? "bg-blue text-white" : "bg-surface border border-border text-text-3 hover:border-blue hover:text-blue"}`}
          >
            {t === "alt" ? "Alt Text Generator" : "Filename Generator"}
          </button>
        ))}
      </div>

      {tab === "alt" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Input Image</h2>

            <div className="p-4 bg-bg border-2 border-dashed border-border rounded-xl text-center space-y-2">
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg object-contain" />
              ) : imageUrl ? (
                <img src={imageUrl} alt="URL preview" className="mx-auto max-h-48 rounded-lg object-contain" onError={() => {}} />
              ) : (
                <div className="py-8 text-text-4 text-sm">
                  <p className="text-2xl mb-2">🖼️</p>
                  <p>Drop an image or paste URL below</p>
                </div>
              )}
              <label className="block cursor-pointer text-xs font-medium text-blue hover:underline">
                Select image file
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Or image URL</label>
              <input type="url" className={inputClass} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Image context / description</label>
              <textarea
                className={`${inputClass} font-mono text-sm resize-none`}
                rows={3}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="e.g. red sports car parked on mountain road at sunset"
              />
              <p className="text-xs text-text-4">Describe what the image shows. Alt text generation uses your description.</p>
            </div>

            <button onClick={generateAlt} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Generate Alt Text
            </button>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-xs text-yellow-700 dark:text-yellow-400">
              Alt text generation uses your provided description — AI-powered generation is not available in offline mode.
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Generated Output</h2>

            {generatedAlt ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Alt Text</label>
                    <CopyButton text={generatedAlt} />
                  </div>
                  <div className="bg-bg border border-border rounded-xl p-4 font-medium text-text">{generatedAlt}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">HTML usage</label>
                    <CopyButton text={`<img src="image.jpg" alt="${generatedAlt}" />`} label="Copy HTML" />
                  </div>
                  <div className="bg-bg border border-border rounded-xl p-4 font-mono text-xs text-text-3 break-all">
                    {`<img src="image.jpg" alt="${generatedAlt}" />`}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">SEO Filename Slug</label>
                    <CopyButton text={altSlug + ".jpg"} />
                  </div>
                  <div className="bg-bg border border-border rounded-xl p-4 font-mono text-sm text-text-3">{altSlug}.jpg</div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-text-4 text-sm">
                Fill in the context and click Generate
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "filename" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Input</h2>
            <div className="space-y-1">
              <label className="text-sm font-medium">Title / Description</label>
              <input
                type="text"
                className={inputClass}
                value={filenameInput}
                onChange={e => setFilenameInput(e.target.value)}
                placeholder="Red Sports Car Mountain Sunset"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">File Extension</label>
              <select className={inputClass} value={ext} onChange={e => setExt(e.target.value)}>
                {[".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Generated Filename</h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-bg border border-border rounded-xl p-4 font-mono text-sm text-text-3 break-all">
                {generatedFilename || "seo-filename" + ext}
              </div>
              <CopyButton text={generatedFilename || "seo-filename" + ext} />
            </div>
            <div className="space-y-2 text-xs text-text-4">
              <p>Rules applied:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Lowercase letters only</li>
                <li>Spaces replaced with hyphens</li>
                <li>Special characters removed</li>
                <li>Multiple hyphens collapsed</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
