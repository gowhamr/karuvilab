'use client';

import React, { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useSettingsStore } from "@/src/store/settings/store";

export function MainLayout({ children }: { children: ReactNode }) {
  const { isFullscreen } = useFullscreenContext();
  const desktopSidebarOpen = useSettingsStore(s => s.appearance.desktopSidebarOpen !== false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={`
        flex-1 flex flex-col min-w-0 relative overflow-x-hidden
        transition-all duration-300 ease-expo
        ${isFullscreen ? 'ml-0' : (desktopSidebarOpen ? 'md:ml-sidebar' : 'ml-0')}
      `}>
        <Header />
        <main
          id="main-content"
          className="flex-1 outline-none relative overflow-x-hidden"
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </div>
  );
}
