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
    <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <CopyButton text={summary} label="Summary" />
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-all"
          title="Share Result URL"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={handleSaveHistory}
          className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-all"
          title="Save to History"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        {onToggleProjection && (
          <button
            onClick={onToggleProjection}
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-surface border border-border rounded-lg hover:border-blue hover:text-blue transition-all"
          >
            <FileText className="w-4 h-4" />
            {showProjection ? "Hide" : "Show"} Projection
          </button>
        )}
      </div>
      {onExport && showProjection && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase tracking-widest bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      )}
    </div>
  );
}
