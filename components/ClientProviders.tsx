"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { useStorageMonitor } from "@/src/lib/hooks/use-storage-monitor";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { SearchManager } from "@/components/ui/search/SearchManager";

import { FullscreenProvider } from "@/src/contexts/FullscreenContext";

function StorageMonitor() {
  useStorageMonitor();
  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <FullscreenProvider>
            <StorageMonitor />
            <FeedbackModal />
            <SearchManager />
            {children}
          </FullscreenProvider>
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
