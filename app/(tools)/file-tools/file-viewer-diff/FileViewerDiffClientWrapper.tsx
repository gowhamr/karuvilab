"use client";

import dynamic from "next/dynamic";

const FileViewerDiffClient = dynamic(() => import("@/components/tools/file-viewer-diff/FileViewerDiffClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-surface border border-border rounded-[32px] flex items-center justify-center animate-pulse">
      <div className="text-text-4 font-black uppercase tracking-widest">Initializing Editor...</div>
    </div>
  ),
});

export default function FileViewerDiffClientWrapper() {
  return <FileViewerDiffClient />;
}
