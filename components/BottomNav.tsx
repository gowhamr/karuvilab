"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, Settings, Laptop } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", action: "search", icon: Search },
  { label: "Tools", href: "/calculators", icon: LayoutGrid },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const setIsPaletteOpen = useSearchStore((state) => state.setIsPaletteOpen);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-border/10 rounded-t-[24px] h-[72px] px-6 shadow-premium">
      <div className="flex items-center justify-between h-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === pathname;

          if (item.action === "search") {
            return (
              <button
                key={item.label}
                onClick={() => setIsPaletteOpen(true)}
                className="flex flex-col items-center gap-1 text-text-4 hover:text-blue transition-colors"
                aria-label="Search"
              >
                <div className="p-2 rounded-xl bg-blue/5 border border-blue/10">
                  <Icon className="w-5 h-5 text-blue" />
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-blue scale-110" : "text-text-4 hover:text-text"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-blue/10" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
