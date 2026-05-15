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
          "rounded-[28%] flex items-center justify-center transition-all duration-500 ease-expo",
          sizes[size],
          variant === "full" 
            ? "bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] border border-white/20" 
            : "bg-transparent text-current"
        )}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[58%] h-[58%]"
          aria-hidden="true"
        >
          <path
            d="M26 20V80M54 20L26 50L54 80M62 20L76 80L90 20"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {withText && (
        <div className="flex flex-col">
          <span className={cn("brand-wordmark tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-text via-text to-text/70", 
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
