"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

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
    return <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-surface border border-border" />;
  }

  const resolvedTheme = theme === "system" 
    ? (typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-surface border border-border hover:border-blue/30 hover:text-blue transition-all group"
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
    >
      {resolvedTheme === "light" ? (
        <Moon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
      )}
    </button>
  );
}
