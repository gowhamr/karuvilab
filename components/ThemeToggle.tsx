"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  if (!mounted) {
    return <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-surface border border-border/10" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-surface border border-border/10 hover:border-blue/30 hover:text-blue transition-all group"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
      )}
    </button>
  );
}
