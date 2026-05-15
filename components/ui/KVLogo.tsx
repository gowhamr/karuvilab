"use client";

import { cn } from "@/src/lib/utils";

interface KVLogoProps {
  className?: string;
  withText?: boolean;
  textClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "monochrome";
}

const sizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-11 h-11",
  xl: "w-14 h-14",
};

export function KVLogo({ 
  className, 
  withText, 
  textClassName, 
  size = "md",
  variant = "full"
}: KVLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="KaruviLab" role="img">
      <div 
        className={cn(
          "rounded-xl flex items-center justify-center transition-all duration-500 ease-expo overflow-hidden",
          sizes[size],
          variant === "full" 
            ? "bg-white/5 backdrop-blur-sm shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-white/10" 
            : "bg-transparent"
        )}
      >
        <img 
          src="/logo.png" 
          alt="KaruviLab" 
          className="w-full h-full object-contain scale-90"
          loading="eager"
        />
      </div>
      {withText && (
        <div className="flex flex-col">
          <span className={cn("brand-wordmark tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-text via-text to-text/70 font-black", 
            size === "sm" ? "text-lg" : "text-xl",
            textClassName
          )}>
            KaruviLab
          </span>
        </div>
      )}
    </div>
  );
}
