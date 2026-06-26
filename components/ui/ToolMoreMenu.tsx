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
      label: "Share Tool",
      icon: Share2,
      onClick: handleShare
    },
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
      danger: true,
      divider: true
    },
  ];

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`min-w-11 min-h-11 p-2.5 border rounded-xl transition-all active:scale-90 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue/20 flex items-center justify-center z-above relative ${
          isOpen ? "bg-blue border-blue text-white" : "bg-surface border-border text-text-3 hover:text-blue hover:border-blue/30"
        }`}
        aria-label="More options"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-modal md:hidden"
            />
            
            <m.div
              id={menuId}
              role="menu"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="
                fixed bottom-0 left-0 right-0 z-[9999] bg-mat-raised rounded-t-3xl p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border-t border-mat-border
                md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-64 md:rounded-2xl md:p-2 md:border md:shadow-mat-shine
              "
            >
              <div className="px-3 py-2 text-micro font-black text-text-4 uppercase tracking-widest-lg border-b border-mat-border mb-2 hidden md:block">
                Tool Options
              </div>
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4 md:hidden" />
              
              <div className="space-y-1">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <React.Fragment key={i}>
                      {item.divider && <div className="h-px bg-mat-border my-2" />}
                      <button
                        role="menuitem"
                        onClick={() => {
                          item.onClick();
                          setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 md:px-3 md:py-2.5 rounded-xl transition-all group outline-none focus:bg-brand-primary/5 active:scale-[0.98]
                          ${item.danger ? "hover:bg-red-500/5 text-red-500/80 active:bg-red-500/10" : "hover:bg-brand-primary/5 text-text-2 hover:text-brand-primary active:bg-brand-primary/10"}
                        `}
                      >
                        <div className="flex items-center gap-3 md:gap-3">
                          <Icon className="w-5 h-5 md:w-4 md:h-4 opacity-70 group-hover:opacity-100" />
                          <span className="text-sm md:text-xs font-bold">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 md:w-3 md:h-3 opacity-20 group-hover:opacity-100 transition-transform" />
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
