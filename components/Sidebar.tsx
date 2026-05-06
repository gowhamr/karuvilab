"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/src/tool-registry";
import { useState, useEffect } from "react";

const SUPPORT_LINKS = [
  { href: "/about/", label: "About" },
  { href: "/help/", label: "Help" },
  { href: "/settings/", label: "Settings" },
  { href: "/privacy/", label: "Privacy" },
];

export function Sidebar() {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[280px] bg-surface border-r border-border z-50
        transition-transform duration-300 ease-expo lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <span className="text-blue">Karuvi</span>Lab
          </Link>
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-52px)] flex flex-col gap-6">
          {/* Home */}
          <div className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === "/" ? "bg-blue/10 text-blue font-semibold" : "hover:bg-border"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>

          {/* Tool Categories */}
          <div className="space-y-4 flex-1">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/${cat.href}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith(`/${cat.href.replace(/\/$/, "")}`)
                      ? "bg-blue/10 text-blue font-semibold"
                      : "hover:bg-border"
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Support Links */}
          <div className="pt-4 border-t border-border space-y-1">
            {SUPPORT_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-blue font-semibold"
                    : "text-text-4 hover:text-text hover:bg-border"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-3 left-4 z-30 lg:hidden p-2 bg-surface border border-border rounded-lg shadow-sm"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  );
}
