"use client";

import { cn } from "@/src/lib/utils";
import { m } from "framer-motion";
import Image from "next/image";

interface KVLogoProps {
  className?: string;
  withText?: boolean;
  textClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "monochrome";
  loading?: "eager" | "lazy";
}

const sizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-11 h-11",
  xl: "w-14 h-14",
};

// Use base path if deployed to GitHub Pages
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const logoPath = `${basePath}/logo.png`;

export function KVLogo({
  className,
  withText,
  textClassName,
  size = "md",
  variant = "full",
  loading = "eager"
}: KVLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group", className)} >
      <m.div
        whileHover={{
          scale: 1.05,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "rounded-xl flex items-center justify-center transition-all duration-500 ease-expo overflow-hidden",
          sizes[size],
          variant === "full"
            ? "bg-white/5 backdrop-blur-sm shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-white/10 group-hover:border-blue/30 group-hover:shadow-blue/10"
            : "bg-transparent"
        )}
      >
        <Image
          src={logoPath}
          alt="" 
          width={100}
          height={100}
          className="w-full h-full object-contain scale-90"
          priority={loading === "eager"}
          loading={loading === "lazy" ? "lazy" : undefined}
        />
      </m.div>
      {withText && (
        <div className="flex flex-col">
          <m.span 
            whileHover={{ x: 2 }}
            className={cn("brand-wordmark tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-text via-text to-text/70 font-black transition-colors group-hover:from-blue group-hover:to-blue/70", 
            size === "sm" ? "text-lg" : "text-xl",
            textClassName
          )}>
            KaruviLab
          </m.span>
        </div>
      )}
    </div>
  );
}
