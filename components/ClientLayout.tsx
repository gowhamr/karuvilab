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
        <Sidebar />
        
        <div className="flex-1 flex flex-col md:ml-[280px] min-w-0">
          <Header />
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

