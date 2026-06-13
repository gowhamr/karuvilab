"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MoreVertical, Flag, Lightbulb, Shield, 
  RotateCcw, ChevronRight, Share2 
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useSupportStore } from "@/src/store/useSupportStore";
import { useToast } from "@/components/ui/Toast";

interface ToolMoreMenuProps {
  toolId: string;
  toolName: string;
}

export function ToolMoreMenu({ toolId, toolName }: ToolMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = `menu-${toolId}`;
  const openFeedback = useSupportStore(state => state.openFeedback);
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Basic keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `KV - ${toolName}`,
          url: window.location.href,
        });
      } else {
        throw new Error("Share not supported");
      }
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard", "success");
    }
    setIsOpen(false);
  };

  const menuItems = [
    { 
      label: "Report Issue", 
      icon: Flag, 
      onClick: () => openFeedback("bug", { toolId, toolName }) 
    },
    { 
      label: "Suggest Feature", 
      icon: Lightbulb, 
      onClick: () => openFeedback("feature", { toolId, toolName }) 
    },
    { 
      label: "Privacy Info", 
      icon: Shield, 
      onClick: () => toast("All processing is 100% local in your browser.", "info") 
    },
    { 
      label: "Reset Tool", 
      icon: RotateCcw, 
      onClick: () => {
        window.location.reload();
      },
      danger: true
    },
  ];

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      <button 
        onClick={handleShare}
        className="min-w-[44px] min-h-[44px] p-2.5 bg-surface border border-border rounded-xl text-text-3 hover:text-blue hover:border-blue/30 transition-all active:scale-90 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue/20 flex items-center justify-center"
        aria-label="Share tool"
      >
        <Share2 className="w-4 h-4" />
      </button>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`min-w-[44px] min-h-[44px] p-2.5 border rounded-xl transition-all active:scale-90 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue/20 flex items-center justify-center ${
          isOpen ? "bg-blue border-blue text-white" : "bg-surface border-border text-text-3 hover:text-blue hover:border-blue/30"
        }`}
        aria-label="More options"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-full mt-2 w-56 bg-mat-raised border border-mat-border shadow-mat-shine rounded-2xl p-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 text-micro font-black text-text-4 uppercase tracking-[0.2em] border-b border-mat-border mb-1">
              Tool Options
            </div>
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  role="menuitem"
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors group outline-none focus:bg-brand-primary/5
                    ${item.danger ? "hover:bg-red-500/5 text-red-500/80" : "hover:bg-brand-primary/5 text-text-2 hover:text-brand-primary"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-transform" />
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
