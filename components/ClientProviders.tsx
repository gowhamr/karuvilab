"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { useStorageMonitor } from "@/src/lib/hooks/use-storage-monitor";

const FeedbackModal = dynamic(() => import("@/components/ui/FeedbackModal").then(mod => ({ default: mod.FeedbackModal })), { ssr: false });
const SearchManager = dynamic(() => import("@/components/ui/search/SearchManager").then(mod => ({ default: mod.SearchManager })), { ssr: false });

import { FullscreenProvider } from "@/src/contexts/FullscreenContext";
import { FocusModeControlsProvider } from "@/src/contexts/FocusModeControlsContext";

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
            <FocusModeControlsProvider>
              <StorageMonitor />
              <FeedbackModal />
              <SearchManager />
              {children}
            </FocusModeControlsProvider>
          </FullscreenProvider>
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
