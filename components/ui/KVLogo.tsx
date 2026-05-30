"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface KVLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  className?: string;
  variant?: "full" | "minimal";
  loading?: "eager" | "lazy";
}

export function KVLogo({ 
  size = "md", 
  withText = true, 
  className,
  variant = "full",
  loading = "eager"
}: KVLogoProps) {
  return (
    <div 
      className={cn("flex items-center gap-3 group", className)} 
      aria-label={!withText ? "KaruviLab Home" : undefined}
      role={!withText ? "img" : undefined}
    >
      <m.div
        whileHover={{
          scale: 1.05,
          rotate: 5,
        }}
        className={cn(
          "relative flex items-center justify-center rounded-xl transition-all duration-500",
          size === "sm" ? "w-8 h-8" : 
          size === "md" ? "w-10 h-10" : 
          size === "lg" ? "w-14 h-14" : "w-20 h-20",
          "bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 shadow-lg shadow-indigo-500/20"
        )}
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl" />
        <span className={cn(
          "font-black text-white font-dm-serif",
          size === "sm" ? "text-lg" : 
          size === "md" ? "text-xl" : 
          size === "lg" ? "text-3xl" : "text-5xl"
        )}>
          K
        </span>
        
        {/* Animated Glow Effect */}
        <m.div 
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-indigo-400 blur-xl rounded-full -z-10"
        />
      </m.div>

      {withText && (
        <div className="flex flex-col -space-y-1">
          <span className={cn(
            "font-dm-serif font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-text-3",
            size === "sm" ? "text-lg" : 
            size === "md" ? "text-2xl" : 
            size === "lg" ? "text-4xl" : "text-6xl"
          )}>
            KaruviLab
          </span>
          <span className={cn(
            "font-black uppercase tracking-[0.4em] text-blue leading-none",
            size === "sm" ? "text-[6px]" : 
            size === "md" ? "text-[8px]" : 
            size === "lg" ? "text-[11px]" : "text-[14px]"
          )}>
            Elite Tools
          </span>
        </div>
      )}
    </div>
  );
}
