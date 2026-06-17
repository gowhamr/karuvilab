"use client";

import { useWorkflowStore } from "@/src/store/useWorkflowStore";
import { ToolEntry, getToolColor } from "@/src/tool-registry";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function WorkflowSuggestions() {
  const suggestions = useWorkflowStore(state => state.suggestions);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 text-blue font-black uppercase tracking-widest-lg text-xs">
        <Sparkles className="w-4 h-4" />
        Next in Workflow
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={`/${tool.href}`}
              className="group block bg-surface border border-border p-5 rounded-2xl hover:border-blue transition-all hover:shadow-md hover:shadow-blue/5 relative overflow-hidden h-full"
            >
              <div 
                className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: getToolColor(tool), borderRadius: '100%' }}
              />
              
              <div className="space-y-3 relative">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${getToolColor(tool)}15`, color: getToolColor(tool) }}
                >
                  {tool.icon || '🛠️'}
                </div>
                <div>
                  <h4 className="font-black text-sm group-hover:text-blue transition-colors line-clamp-1">{tool.name}</h4>
                  <p className="text-xs text-text-4 font-medium line-clamp-2 mt-1">{tool.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-blue uppercase tracking-widest pt-1">
                  Try Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
