"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation } from "framer-motion";
import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette").then(mod => mod.CommandPalette), {
  ssr: false
});

import { useSettingsStore, useIsHydrated } from "@/src/store/settings/store";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const isHydrated = useIsHydrated();
  const accessibility = useSettingsStore((state) => state.accessibility);

  return (
    <LazyMotion features={domAnimation}>
      <div 
        className={isHydrated && accessibility.highContrast ? 'high-contrast' : ''}
      >
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
      </div>
    </LazyMotion>
  );
}
