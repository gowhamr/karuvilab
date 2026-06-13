"use client";

import { memo, useEffect, useState } from "react";
import { getHistory, addToHistory, clearAllHistory } from "@/src/lib/db";
import { History, Trash2, ExternalLink, Calendar, ChevronRight } from "lucide-react";
import { formatINR } from "@/src/lib/calculator-utils";
import Link from "next/link";
import { ALL_TOOLS } from "@/src/tool-registry";
import { useToast } from "@/components/ui/Toast";

export const HistorySection = memo(function HistorySection() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getHistory();
      // Sort by timestamp desc
      setHistory(data.sort((a: any, b: any) => b.timestamp - a.timestamp));
      setIsLoading(false);
    }
    load();
  }, []);

  const { toast } = useToast();

  const clearHistory = async () => {
    toast("Are you sure you want to clear all calculation history?", "warn", {
      label: "Clear",
      onClick: async () => {
        try {
          await clearAllHistory();
          setHistory([]);
          toast("History cleared successfully.", "success");
        } catch (error) {
          console.error("Failed to clear history:", error);
          toast("Failed to clear history. Please try again.", "error");
        }
      }
    });
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1,2,3].map(i => <div key={i} className="h-24 bg-surface rounded-2xl" />)}
  </div>;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-text-4">
          <History className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-black">No History Yet</h3>
          <p className="text-sm text-text-4">Your saved calculations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-4">{history.length} Saved Calculations</h3>
        <button 
          onClick={clearHistory}
          className="text-xs font-black uppercase tracking-widest text-red-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="grid gap-3">
        {history.map((item) => {
          const tool = ALL_TOOLS.find(t => t.id === item.toolId);
          return (
            <div 
              key={item.id} 
              className="group bg-surface border border-border rounded-2xl p-4 hover:border-blue transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-blue bg-blue/5 px-2 py-0.5 rounded">
                      {tool?.name || item.toolId}
                    </span>
                    <span className="text-xs font-bold text-text-4 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-text group-hover:text-blue transition-colors">
                    {item.label}
                  </h4>
                  <div className="text-xs text-text-3 font-medium line-clamp-1">
                    {JSON.stringify(item.data.result || item.data).replace(/[{}"[\]]/g, '').replace(/,/g, ' | ')}
                  </div>
                </div>
                
                <Link 
                  href={`/${tool?.href || ''}`}
                  className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-text-4 hover:text-blue hover:border-blue transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
