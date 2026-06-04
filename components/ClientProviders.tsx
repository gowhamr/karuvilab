"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { useStorageMonitor } from "@/src/lib/hooks/use-storage-monitor";
import { FeedbackModal } from "@/components/ui/FeedbackModal";

function StorageMonitor() {
  useStorageMonitor();
  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <StorageMonitor />
          <FeedbackModal />
          {children}
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
