import React, { useEffect, useState } from "react";
import type { ToolResult } from "../types/ToolResult";
import { blobManager } from "@/src/lib/blob-manager";

export default function PreviewRenderer({ result }: { result: ToolResult }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!result.blob) {
      setUrl(null);
      return;
    }
    const newUrl = blobManager.create(result.blob);
    setUrl(newUrl);
    return () => {
      blobManager.revoke(newUrl);
    };
  }, [result.blob]);

  if (!url) return null;

  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl overflow-hidden p-6 flex items-center justify-center">
      {result.mimeType?.startsWith("image/") ? (
        <img src={url} alt="Preview" className="max-w-full h-auto rounded-2xl" />
      ) : (
        <iframe src={url} className="w-full h-[600px] rounded-2xl border-none" />
      )}
    </div>
  );
}
