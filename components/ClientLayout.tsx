"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <ToastProvider>
      <CommandPalette />
      
      <div className="flex min-h-screen">
        {!isHome && <Sidebar />}
        
        <div className={`flex-1 flex flex-col ${!isHome ? "md:ml-[280px]" : ""}`}>
          {isHome ? <Header /> : (
            <header className="h-14 border-b border-border flex items-center justify-end px-6 sticky top-0 bg-surface/80 backdrop-blur-xl z-30">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
                  className="hidden sm:flex items-center gap-2 px-3 py-1 bg-bg border border-border rounded-lg text-[10px] font-black text-text-4 hover:border-blue/30 hover:text-blue transition-all"
                >
                  <span>Search...</span>
                  <kbd className="opacity-50">⌘K</kbd>
                </button>
              </div>
            </header>
          )}
          
          <main className={`${isHome ? "" : "p-4 md:p-8"}`}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
