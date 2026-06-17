"use client";

import { Share2, Save, Download, FileText } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { useToast } from "./Toast";
import { addToHistory } from "@/src/lib/db";

interface CalculatorActionBarProps {
  summary: string;
  toolId: string;
  historyLabel: string;
  historyData: Record<string, any>;
  onExport?: () => void;
  showProjection?: boolean;
  onToggleProjection?: () => void;
}

export function CalculatorActionBar({
  summary,
  toolId,
  historyLabel,
  historyData,
  onExport,
  showProjection,
  onToggleProjection
}: CalculatorActionBarProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!");
    } catch {
      toast("Failed to copy link", "error");
    }
  };

  const handleSaveHistory = async () => {
    await addToHistory(toolId, historyLabel, historyData);
    toast("Calculation saved to history");
  };

  return (
    <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3" role="toolbar" aria-label="Tool actions">
      <div className="flex flex-wrap gap-2">
        <CopyButton text={summary} label="Summary" />
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-all focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
          title="Share Result URL"
          aria-label="Share current calculation link"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Share
        </button>
        <button
          onClick={handleSaveHistory}
          className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-all focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
          title="Save to History"
          aria-label="Save calculation to local history"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          Save
        </button>
        {onToggleProjection && (
          <button
            onClick={onToggleProjection}
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-all focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
            aria-label={showProjection ? "Hide data projection" : "Show data projection"}
            aria-expanded={showProjection}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            {showProjection ? "Hide" : "Show"} Projection
          </button>
        )}
      </div>
      {onExport && showProjection && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 text-tiny font-bold uppercase tracking-widest-sm bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors focus-visible:ring-2 focus-visible:ring-blue/20 outline-none"
          aria-label="Export projection data as CSV"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Export CSV
        </button>
      )}
    </div>
  );
}
