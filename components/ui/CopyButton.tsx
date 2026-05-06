"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 text-sm font-medium bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
