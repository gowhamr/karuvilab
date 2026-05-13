"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, Settings, Laptop } from "lucide-react";
import { useSearchStore } from "@/src/store/useSearchStore";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", action: "search", icon: Search },
  { label: "Tools", action: "menu", icon: LayoutGrid },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setIsPaletteOpen, setIsSidebarOpen } = useSearchStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface border-t border-border rounded-t-[24px] h-[72px] px-6 shadow-sm">
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
                <div className="p-2 rounded-xl bg-bg border border-border">
                  <Icon className="w-5 h-5 text-text-3" />
                </div>
              </button>
            );
          }

          if (item.action === "menu") {
            return (
              <button
                key={item.label}
                onClick={() => setIsSidebarOpen(true)}
                className="flex flex-col items-center gap-1 text-text-4 hover:text-blue transition-colors"
                aria-label="Menu"
              >
                <div className="p-2 rounded-xl bg-bg border border-border">
                  <Icon className="w-5 h-5" />
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              aria-label={item.label}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-blue" : "text-text-4 hover:text-text"
              }`}
            >
              <div className={`p-2 rounded-xl border transition-all ${isActive ? "bg-blue/5 border-blue/20" : "bg-bg border-border"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-blue" : ""}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
