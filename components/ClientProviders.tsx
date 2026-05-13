"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { useStorageMonitor } from "@/src/lib/hooks/use-storage-monitor";

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette").then(mod => mod.CommandPalette), {
  ssr: false
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useStorageMonitor();

  return (
    <LazyMotion features={domAnimation}>
      <ToastProvider>
        <CommandPalette />
        {children}
      </ToastProvider>
    </LazyMotion>
  );
}
