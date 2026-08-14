"use client";
import { useState } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

export default function ImageBase64Client() {
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
  const htmlTag = `<img src="${dataUri}" alt="embedded image" />`;
  const cssUsage = `background-image: url('${dataUri}');`;

  const tabs = {
    options: [
      { id: "encode", label: "Encode (Image → Base64)" },
      { id: "decode", label: "Decode (Base64 → Image)" }
    ],
    activeId: tab,
    onChange: (t: string) => setTab(t as "encode" | "decode")
  };

  const encodeInput = (
    <div
      className="bg-surface border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-blue transition-colors flex flex-col items-center justify-center min-h-[200px]"
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
  );

  const encodeOutput = dataUri ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-text-3 px-2">
        <span>MIME: <strong>{mimeType}</strong></span>
        <span>Data URI size: <strong>{fmtSize(dataUri.length)}</strong></span>
      </div>

      <div className="flex flex-col gap-4">
        <ToolResultArea label="Data URI (full)" value={dataUri} contentClassName="max-h-32" />
        <ToolResultArea label="Base64 only (no prefix)" value={base64Only} contentClassName="max-h-32" />
        <ToolResultArea label="HTML <img> tag" value={htmlTag} contentClassName="max-h-32" language="html" />
        <ToolResultArea label="CSS background-image" value={cssUsage} contentClassName="max-h-32" language="css" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-text-4 italic min-h-[200px]">
      Encoded result will appear here...
    </div>
  );

  const decodeInputArea = (
    <div className="space-y-4 flex flex-col h-full">
      <ToolInput
        label="Paste Data URI or Base64 string"
        value={decodeInput}
        onChange={setDecodeInput}
        placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
        rows={6}
        mono
        error={decodeError}
      />
      <button 
        onClick={handleDecode} 
        className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all"
      >
        Decode
      </button>
    </div>
  );

  const decodeOutput = decodePreview ? (
    <div className="space-y-4 text-center">
      <h2 className="font-bold text-sm text-text-2 uppercase tracking-wider text-left">Decoded Image</h2>
      <div className="bg-bg border border-border p-4 rounded-xl flex items-center justify-center min-h-[200px]">
        <img src={decodePreview} alt="Decoded" className="mx-auto max-h-64 rounded-xl object-contain" />
      </div>
      <a href={decodePreview} download="decoded-image.jpg" className="inline-block w-full px-5 py-3 bg-surface border border-border font-bold rounded-xl text-sm hover:bg-border transition-colors">
        Download Image
      </a>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-text-4 italic min-h-[200px]">
      Decoded image will appear here...
    </div>
  );

  return (
    <ToolWorkspace
      tabs={tabs}
      input={tab === "encode" ? encodeInput : decodeInputArea}
      output={tab === "encode" ? encodeOutput : decodeOutput}
    />
  );
}
