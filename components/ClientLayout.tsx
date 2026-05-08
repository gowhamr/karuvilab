"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <CommandPalette />
      
      <div className="flex min-h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col md:ml-[280px] min-w-0">
          <Header />
          
          <main className="flex-1 pb-[72px] md:pb-0">
            {children}
          </main>

          <Footer />
          <BottomNav />
        </div>
      </div>
    </ToastProvider>
  );
}

