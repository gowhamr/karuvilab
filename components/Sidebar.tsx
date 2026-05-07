"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, getRecentTools, ToolEntry } from "@/src/tool-registry";
import { ToolIcon } from "@/components/ui/Icons";
import { useState, useEffect } from "react";
import { Home, Info, HelpCircle, Settings, Shield, Menu, X, Clock } from "lucide-react";

const SUPPORT_LINKS = [
  { href: "/about/", label: "About", icon: Info },
  { href: "/help/", label: "Help", icon: HelpCircle },
  { href: "/settings/", label: "Settings", icon: Settings },
  { href: "/privacy/", label: "Privacy", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [recent, setRecent] = useState<ToolEntry[]>([]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
    setRecent(getRecentTools().slice(0, 5));
  }, [pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[280px] bg-surface border-r border-border z-50
        transition-transform duration-300 ease-expo lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-border bg-elevated/50">
          <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter">
            <span className="text-blue">Karuvi</span>Lab
          </Link>
          <button
            className="lg:hidden p-2 hover:bg-bg rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-52px)] flex flex-col gap-8">
          {/* Home */}
          <div className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${pathname === "/" ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-text-3 hover:bg-bg hover:text-text"}`}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </div>

          {/* Recent Tools */}
          {recent.length > 0 && (
            <div className="space-y-2">
              <div className="px-3 flex items-center gap-2 text-[10px] font-black text-text-4 uppercase tracking-[0.2em]">
                <Clock className="w-3 h-3" />
                Recently Used
              </div>
              <div className="space-y-1">
                {recent.map(tool => (
                  <Link
                    key={tool.id}
                    href={`/${tool.href}`}
                    className={`block px-3 py-2 text-sm rounded-lg transition-all font-medium ${pathname.includes(tool.href) ? "bg-blue/10 text-blue" : "text-text-4 hover:bg-bg hover:text-text"}`}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tool Categories */}
          <div className="space-y-1 flex-1">
            <div className="px-3 text-[10px] font-black text-text-4 uppercase tracking-[0.2em] mb-3">Categories</div>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.href}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                    pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`)
                      ? "bg-blue/10 text-blue"
                      : "text-text-3 hover:bg-bg hover:text-text"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`)
                      ? "bg-blue text-white shadow-md shadow-blue/20"
                      : "bg-elevated border border-border group-hover:border-blue/50"
                  }`}>
                    <ToolIcon category={cat.id} className="w-4 h-4" />
                  </div>
                  <span className="flex-1">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div className="pt-4 border-t border-border space-y-1">
            {SUPPORT_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all font-bold ${
                    pathname === link.href
                      ? "text-blue bg-blue/5"
                      : "text-text-4 hover:text-text hover:bg-bg"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-3 left-4 z-30 lg:hidden p-2 bg-surface border border-border rounded-xl shadow-lg focus:ring-2 focus:ring-blue outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-text" />
        </button>
      )}
    </>
  );
}
