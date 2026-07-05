"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MoreVertical, Flag, Lightbulb, Shield, 
  RotateCcw, ChevronRight, Share2, HelpCircle
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useSupportStore } from "@/src/store/useSupportStore";
import { useToast } from "@/components/ui/Toast";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { Maximize2 } from "lucide-react";

interface ToolMoreMenuProps {
  toolId: string;
  toolName: string;
}

export function ToolMoreMenu({ toolId, toolName }: ToolMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{x: "left" | "right", y: "top" | "bottom"}>({ x: "right", y: "bottom" });
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = `menu-${toolId}`;
  const openFeedback = useSupportStore(state => state.openFeedback);
  const { toast } = useToast();
  const { enterFocus } = useFullscreenContext();

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const isNearLeft = rect.left < 250;
      const isNearBottom = rect.bottom > window.innerHeight - 350;

      setPosition({
        x: isNearLeft ? "left" : "right",
        y: isNearBottom ? "top" : "bottom"
      });
    }
  }, [isOpen]);

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
      label: "Help & Docs",
      icon: HelpCircle,
      onClick: () => { window.location.href = "/help"; }
    },
    {
      label: "Fullscreen Mode",
      icon: Maximize2,
      onClick: () => {
        enterFocus(toolId);
        setIsOpen(false);
      }
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

  const xClass = position.x === "right" ? "right-0" : "left-0";
  const yClass = position.y === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5";
  const originClass = position.y === "top" 
    ? (position.x === "right" ? "origin-bottom-right" : "origin-bottom-left")
    : (position.x === "right" ? "origin-top-right" : "origin-top-left");

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 p-2 border rounded-xl transition-all active:scale-90 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue/20 flex items-center justify-center z-above relative ${
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
          <m.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: position.y === "top" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position.y === "top" ? 6 : -6 }}
            className={`absolute ${xClass} ${yClass} w-52 max-w-[calc(100vw-2rem)] bg-mat-raised border border-mat-border shadow-mat-shine rounded-2xl p-2 z-max overflow-hidden ${originClass}`}
          >
            <div className="px-3 py-2 text-micro font-black text-text-4 uppercase tracking-widest-lg border-b border-mat-border mb-2">
              Tool Options
            </div>
            
            <div className="space-y-1">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <React.Fragment key={i}>
                    {item.divider && <div className="h-px bg-mat-border my-1" />}
                    <button
                      role="menuitem"
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group outline-none focus:bg-brand-primary/5 active:scale-[0.98]
                        ${item.danger ? "hover:bg-red-500/5 text-red-500/80 active:bg-red-500/10" : "hover:bg-brand-primary/5 text-text-2 hover:text-brand-primary active:bg-brand-primary/10"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-transform" />
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
