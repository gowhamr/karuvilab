"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

interface KVLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  showSubtext?: boolean;
  className?: string;
  variant?: "full" | "minimal";
  loading?: "eager" | "lazy";
}

export function KVLogo({ 
  size = "md", 
  withText = true, 
  showSubtext = true,
  className,
  variant = "full",
  loading = "eager"
}: KVLogoProps) {
  const dimensions = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80
  };

  const pixelSize = dimensions[size];

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
          "relative flex items-center justify-center transition-all duration-500",
          size === "sm" ? "w-8 h-8" : 
          size === "md" ? "w-10 h-10" : 
          size === "lg" ? "w-14 h-14" : "w-20 h-20"
        )}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
          alt="KaruviLab Logo"
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
          priority={loading === "eager"}
        />
        
        {/* Animated Glow Effect */}
        <m.div 
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-brand-glow blur-xl rounded-full z-behind"
        />
      </m.div>

      {withText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-dm-serif font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-text-3",
            size === "sm" ? "text-lg" : 
            size === "md" ? "text-2xl" : 
            size === "lg" ? "text-4xl" : "text-6xl"
          )}>
            KaruviLab
          </span>
        </div>
      )}
    </div>
  );
}
