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
          "rounded-xl flex items-center justify-center transition-all",
          sizes[size],
          variant === "full" ? "bg-blue text-white" : "bg-transparent text-current"
        )}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[65%] h-[65%]"
          aria-hidden="true"
        >
          <path
            d="M22 15V85M52 15L22 50L52 85M60 15L75 85L90 15"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {withText && (
        <div className="flex flex-col">
          <span className={cn("brand-wordmark tracking-tight leading-none text-text", 
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
