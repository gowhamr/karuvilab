"use client";

import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { CopyButton } from "@/components/ui/CopyButton";
import { Download, FileText, FileCode, FileImage, Upload, RefreshCw, CheckCircle2 } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";

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

const EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".txt", ".csv", ".zip", ".mp4", ".mp3", ".wav"
];

export default function ImageSeoClient() {
  const [tab, setTab] = useState<"alt" | "filename" | "renamer">("alt");
  
  // Alt text tab
  const [preview, setPreview] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [context, setContext] = useState("");
  const [generatedAlt, setGeneratedAlt] = useState("");
  const [altSlug, setAltSlug] = useState("");
  const [altExt, setAltExt] = useState(".jpg");
  
  // Filename tab
  const [filenameInput, setFilenameInput] = useState("");
  const [ext, setExt] = useState(".jpg");

  // File Renamer tab
  const [renameFile, setRenameFile] = useState<File | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [renameExt, setRenameExt] = useState("");

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActiveFile(file);
    if (preview) blobManager.revoke(preview);
    const url = blobManager.create(file);
    setPreview(url);
    
    const dotIdx = file.name.lastIndexOf(".");
    const name = dotIdx !== -1 ? file.name.slice(0, dotIdx).replace(/[-_]/g, " ") : file.name.replace(/[-_]/g, " ");
    const extension = dotIdx !== -1 ? file.name.slice(dotIdx) : ".jpg";
    
    setContext(name);
    setAltExt(extension);
  };

  const handleRenameFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRenameFile(file);
    const dotIdx = file.name.lastIndexOf(".");
    const name = dotIdx !== -1 ? file.name.slice(0, dotIdx) : file.name;
    const extension = dotIdx !== -1 ? file.name.slice(dotIdx) : "";
    setRenameInput(name);
    setRenameExt(extension);
  };

  const generateAlt = () => {
    if (!context.trim()) return;
    const alt = toTitleCaseAlt(context.trim());
    setGeneratedAlt(alt);
    setAltSlug(toSlug(context.trim()));
  };

  const generatedFilename = toSlug(filenameInput) + ext;
  const finalRenameName = (toSlug(renameInput) || "file") + renameExt;
  const finalAltName = (altSlug || "image") + altExt;

  const downloadFile = (file: File, name: string) => {
    const url = blobManager.create(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    blobManager.revoke(url);
  };

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2 p-1 bg-surface border border-border rounded-2xl w-fit">
        {(["alt", "filename", "renamer"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t 
                ? "bg-blue text-white shadow-lg shadow-blue/20" 
                : "text-text-3 hover:text-blue hover:bg-blue/5"
            }`}
          >
            {t === "alt" ? "Alt Text Generator" : t === "filename" ? "Filename Generator" : "File Renamer"}
          </button>
        ))}
      </div>

      {tab === "alt" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileImage className="w-4 h-4 text-blue" />
              Input Image
            </h2>

            <div className="p-4 bg-bg border-2 border-dashed border-border rounded-2xl text-center space-y-2 group hover:border-blue transition-colors relative overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg object-contain" />
              ) : imageUrl ? (
                <img src={imageUrl} alt="URL preview" className="mx-auto max-h-48 rounded-lg object-contain" onError={() => {}} />
              ) : (
                <div className="py-8 text-text-4 text-sm">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-text-4 group-hover:text-blue transition-colors" />
                  <p className="font-medium">Drop an image or click to upload</p>
                  <p className="text-xs mt-1">Supports JPG, PNG, WebP, SVG</p>
                </div>
              )}
              <label className="absolute inset-0 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-2 px-1">Or image URL</label>
              <input type="url" className={inputClass} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-2 px-1">Image context / description</label>
              <textarea
                className={`${inputClass} font-medium text-sm resize-none`}
                rows={3}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="e.g. red sports car parked on mountain road at sunset"
              />
              <p className="text-xs text-text-4 px-1">Describe what the image shows for better SEO results.</p>
            </div>

            <button 
              onClick={generateAlt} 
              className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Generate Alt Text
            </button>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Generated Output
            </h2>

            {generatedAlt ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-text-2 px-1">Alt Text</label>
                    <CopyButton text={generatedAlt} />
                  </div>
                  <div className="bg-bg border border-border rounded-xl p-4 font-semibold text-text text-lg">{generatedAlt}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-text-2 px-1">HTML usage</label>
                    <CopyButton text={`<img src="image.jpg" alt="${generatedAlt}" />`} label="Copy HTML" />
                  </div>
                  <div className="bg-bg border border-border rounded-xl p-4 font-mono text-sm text-blue break-all">
                    {`<img src="image.jpg" alt="${generatedAlt}" />`}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-text-2 px-1">SEO Filename Slug</label>
                    <div className="flex gap-2">
                      {activeFile && (
                        <button 
                          onClick={() => downloadFile(activeFile, finalAltName)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg text-xs font-bold transition-colors"
                          title="Download with SEO name"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      )}
                      <CopyButton text={finalAltName} />
                    </div>
                  </div>
                  <div className="bg-bg border border-border rounded-xl p-4 font-mono text-base text-text-2">{finalAltName}</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[340px] text-text-4 text-center">
                <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-medium">Waiting for input...</p>
                <p className="text-xs">Fill in the context and click Generate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "filename" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue" />
              Filename Creator
            </h2>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-2 px-1">Title / Description</label>
              <input
                type="text"
                className={inputClass}
                value={filenameInput}
                onChange={e => setFilenameInput(e.target.value)}
                placeholder="Red Sports Car Mountain Sunset"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="extension-select" className="text-sm font-semibold text-text-2 px-1">File Extension</label>
              <select id="extension-select" className={inputClass} value={ext} onChange={e => setExt(e.target.value)}>
                {EXTENSIONS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              SEO Optimized Name
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-bg border border-border rounded-xl p-5 font-mono text-lg font-bold text-blue break-all">
                  {generatedFilename || "seo-filename" + ext}
                </div>
                <CopyButton text={generatedFilename || "seo-filename" + ext} />
              </div>
              
              <div className="p-4 bg-bg border border-border rounded-2xl space-y-3">
                <p className="text-sm font-bold text-text-2 uppercase tracking-tighter">SEO Best Practices Applied:</p>
                <ul className="space-y-2">
                  {[
                    "Lowercased all characters",
                    "Replaced spaces with hyphens (-)",
                    "Removed special characters",
                    "Collapsed multiple hyphens"
                  ].map((rule, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-text-3">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "renamer" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue" />
              Upload Any File
            </h2>
            
            <div className="p-8 bg-bg border-2 border-dashed border-border rounded-2xl text-center space-y-3 group hover:border-blue transition-colors relative">
              <div className="pointer-events-none">
                {renameFile ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-blue/10 text-blue rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-text truncate max-w-[200px] mx-auto">{renameFile.name}</p>
                    <p className="text-xs text-text-4">{(renameFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-text-4 group-hover:text-blue transition-colors" />
                    <p className="font-bold">Drop your file here</p>
                    <p className="text-xs text-text-4">Supports PDF, DOCX, Images, ZIP, etc.</p>
                  </>
                )}
              </div>
              <label className="absolute inset-0 cursor-pointer">
                <input type="file" className="hidden" onChange={handleRenameFile} />
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-2 px-1">New SEO Title</label>
              <input
                type="text"
                className={inputClass}
                value={renameInput}
                onChange={e => setRenameInput(e.target.value)}
                placeholder="Descriptive filename here"
              />
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm space-y-6">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-blue" />
              Download Renamed File
            </h2>

            {renameFile ? (
              <div className="space-y-6">
                <div className="bg-bg border border-border rounded-2xl p-6 text-center space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-text-4 uppercase">New Filename</p>
                    <p className="text-xl font-bold text-blue break-all">{finalRenameName}</p>
                  </div>
                  
                  <button 
                    onClick={() => downloadFile(renameFile, finalRenameName)}
                    className="w-full py-4 bg-blue text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <Download className="w-6 h-6" />
                    Download Optimized File
                  </button>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
                    This tool renames your file locally in the browser. Your file is never uploaded to any server.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[340px] text-text-4 text-center">
                <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-medium">No file selected</p>
                <p className="text-xs">Upload a file to see the rename options</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
