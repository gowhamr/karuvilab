"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { useStorageMonitor } from "@/src/lib/hooks/use-storage-monitor";

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette").then(mod => mod.CommandPalette), {
  ssr: false
});

function StorageMonitor() {
  useStorageMonitor();
  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <ToastProvider>
        <StorageMonitor />
        <CommandPalette />
        {children}
      </ToastProvider>
    </LazyMotion>
  );
}
