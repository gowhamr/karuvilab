'use client';

import React, { ReactNode, useEffect, useState, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { useSettingsStore } from "@/src/store/settings/store";
import { AriaLiveAnnouncer } from '@/src/lib/a11y/AriaLiveAnnouncer';
import { DraftDrawer } from '@/components/ui/DraftDrawer';
import { GlobalSelectionToolbar } from '@/components/ui/GlobalSelectionToolbar';
import { Toaster as SonnerToaster } from 'sonner';

export function MainLayout({ children }: { children: ReactNode }) {
  const { isFullscreen } = useFullscreenContext();
  const desktopSidebarOpen = useSettingsStore(s => s.appearance.desktopSidebarOpen !== false);
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsEmbed(params.get("embed") === "true");
    }
  }, []);

  if (isEmbed) {
    return (
      <main id="main-content" className="flex-1 outline-none relative overflow-x-hidden min-h-screen bg-bg" tabIndex={-1}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    );
  }

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
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </main>
        <Footer />
        <BottomNav />
      </div>
      <AriaLiveAnnouncer />
      <DraftDrawer />
      <GlobalSelectionToolbar />
    </div>
  );
}
