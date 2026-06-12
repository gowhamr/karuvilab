'use client';

import React, { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";

export function MainLayout({ children }: { children: ReactNode }) {
  const { isFullscreen } = useFullscreenContext();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={`
        flex-1 flex flex-col min-w-0
        transition-all duration-300 ease-expo
        ${isFullscreen ? 'ml-0' : 'md:ml-[280px]'}
      `}>
        <Header />
        <main
          id="main-content"
          className="flex-1 outline-none"
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
