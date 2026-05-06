"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { CopyButton } from "@/components/ui/CopyButton";

const cat = CATEGORIES.find(c => c.id === "image")!;

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

export default function ImageBase64() {
  const [tab, setTab] = useState<"encode" | "decode">("encode");
  // encode
  const [dataUri, setDataUri] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // decode
  const [decodeInput, setDecodeInput] = useState("");
  const [decodePreview, setDecodePreview] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState("");

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setDataUri(result);
      setMimeType(file.type);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = () => {
    setDecodeError("");
    setDecodePreview(null);
    const input = decodeInput.trim();
    if (!input) return;
    const uri = input.startsWith("data:") ? input : `data:image/jpeg;base64,${input}`;
    const img = new Image();
    img.onload = () => setDecodePreview(uri);
    img.onerror = () => setDecodeError("Invalid data URI or base64 string.");
    img.src = uri;
  };

  const base64Only = dataUri.split(",")[1] || "";
  const htmlTag = `<img src="${dataUri.slice(0, 50)}..." alt="embedded image" />`;
  const htmlTagFull = `<img src="${dataUri}" alt="embedded image" />`;
  const cssUsage = `background-image: url('${dataUri.slice(0, 50)}...');`;
  const cssUsageFull = `background-image: url('${dataUri}');`;

  return (
    <ToolShell
      title="Image to Base64"
      description="Encode images as Base64 data URIs or decode data URIs back to images."
      category={cat}
    >
      {/* Tabs */}
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? "bg-blue text-white" : "bg-surface border border-border text-text-3 hover:border-blue hover:text-blue"}`}
          >
            {t === "encode" ? "Encode (Image → Base64)" : "Decode (Base64 → Image)"}
          </button>
        ))}
      </div>

      {tab === "encode" && (
        <div className="space-y-6">
          <div
            className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="mx-auto max-h-48 rounded-xl object-contain" />
            ) : (
              <>
                <div className="text-4xl mb-2">🖼️</div>
                <p className="font-semibold text-text-2">Drop image here</p>
              </>
            )}
            <label className="block mt-3 cursor-pointer text-sm font-medium text-blue hover:underline">
              Select file
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
          </div>

          {dataUri && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-text-3">
                <span>MIME: <strong>{mimeType}</strong></span>
                <span>Data URI size: <strong>{fmtSize(dataUri.length)}</strong></span>
              </div>

              {[
                { label: "Data URI (full)", value: dataUri, copyValue: dataUri },
                { label: "Base64 only (no prefix)", value: base64Only.slice(0, 200) + (base64Only.length > 200 ? "…" : ""), copyValue: base64Only },
                { label: "HTML <img> tag", value: htmlTag, copyValue: htmlTagFull },
                { label: "CSS background-image", value: cssUsage, copyValue: cssUsageFull },
              ].map(({ label, value, copyValue }) => (
                <div key={label} className="bg-surface border border-border p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-3 uppercase tracking-wider">{label}</span>
                    <CopyButton text={copyValue} />
                  </div>
                  <pre className="font-mono text-xs text-text-3 bg-bg rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all max-h-24">
                    {value}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "decode" && (
        <div className="space-y-4">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <label className="text-sm font-medium">Paste Data URI or Base64 string</label>
            <textarea
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
              rows={6}
              value={decodeInput}
              onChange={e => setDecodeInput(e.target.value)}
              placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
            />
            <button onClick={handleDecode} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Decode
            </button>
          </div>

          {decodeError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{decodeError}</div>
          )}

          {decodePreview && (
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3 text-center">
              <h2 className="font-bold text-sm text-text-2 uppercase tracking-wider">Decoded Image</h2>
              <img src={decodePreview} alt="Decoded" className="mx-auto max-h-64 rounded-xl object-contain border border-border" />
              <a href={decodePreview} download="decoded-image.jpg" className="inline-block px-5 py-2 bg-blue text-white font-bold rounded-xl text-sm hover:opacity-90">
                Download
              </a>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
