"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

import { useSettingsStore, useIsHydrated } from "@/src/store/settings/store";

export function ThemeToggle() {
  const isHydrated = useIsHydrated();
  const { appearance, updateAppearance } = useSettingsStore();
  const theme = appearance.theme;

  const toggleTheme = () => {
    const resolvedTheme = theme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    const nextTheme = resolvedTheme === "light" ? "dark" : "light";
    updateAppearance({ theme: nextTheme });
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  if (!isHydrated) {
    return <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-surface border border-border shimmer-wrapper" />;
  }

  const resolvedTheme = theme === "system" 
    ? (typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  return (
    <m.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, rotate: 15 }}
      onClick={toggleTheme}
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-surface border border-border hover:border-blue/30 hover:text-blue transition-colors group relative overflow-hidden"
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={resolvedTheme}
          initial={{ y: 20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {resolvedTheme === "light" ? (
            <Moon className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
          ) : (
            <Sun className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
          )}
        </m.div>
      </AnimatePresence>
    </m.button>
  );
}
