"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { useStorageMonitor } from "@/src/lib/hooks/use-storage-monitor";
import { useSettingsStore, useIsHydrated } from "@/src/store/settings/store";
import { useEffect } from "react";

const FeedbackModal = dynamic(() => import("@/components/ui/FeedbackModal").then(mod => ({ default: mod.FeedbackModal })), { ssr: false });
const SearchManager = dynamic(() => import("@/components/ui/search/SearchManager").then(mod => ({ default: mod.SearchManager })), { ssr: false });
const DeveloperPanel = dynamic(() => import("@/components/system/DeveloperPanel").then(mod => ({ default: mod.DeveloperPanel })), { ssr: false });

import { FullscreenProvider } from "@/src/contexts/FullscreenContext";
import { FocusModeControlsProvider } from "@/src/contexts/FocusModeControlsContext";
import { HtmlPrecacher } from "@/components/system/HtmlPrecacher";
import { MonacoProvider } from "@/src/core/monaco";
import { WebMCPInitializer } from "@/src/webmcp/initializer";

function StorageMonitor() {
  useStorageMonitor();
  return null;
}

function GlobalSettingsEffects() {
  const isHydrated = useIsHydrated();
  const theme = useSettingsStore(s => s.appearance.theme);
  const accessibility = useSettingsStore(s => s.accessibility);

  useEffect(() => {
    const root = document.documentElement;
    // Always remove preload class to restore normal paint/transitions
    const timer = setTimeout(() => {
      root.classList.remove('preload');
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    const root = document.documentElement;
    
    // Theme
    let resolved = theme;
    if (theme === 'system') {
      try {
        resolved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
      } catch {
        const attr = root.getAttribute('data-theme');
        resolved = (attr === 'dark' || attr === 'light') ? attr : 'light';
      }
    }
    root.setAttribute('data-theme', resolved);
    root.classList.toggle('dark', resolved === 'dark');
    
    // Accessibility
    root.setAttribute('data-font-size', String(accessibility.fontScaling || '1.0'));
    
    if (accessibility.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');
    
    if (accessibility.focusMode) root.classList.add('focus-mode');
    else root.classList.remove('focus-mode');
    
    if (accessibility.keyboardShortcutsOverlay) root.classList.add('show-shortcuts');
    else root.classList.remove('show-shortcuts');
  }, [isHydrated, theme, accessibility]);

  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const isHydrated = useIsHydrated();
  const reduceMotion = useSettingsStore(s => s.accessibility.reduceMotion);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={isHydrated && reduceMotion ? "always" : "user"}>
        <ToastProvider>
          <FullscreenProvider>
            <FocusModeControlsProvider>
              <StorageMonitor />
              <GlobalSettingsEffects />
              <FeedbackModal />
              <SearchManager />
              <DeveloperPanel />
              <HtmlPrecacher />
              <WebMCPInitializer />
              <MonacoProvider>
                {children}
              </MonacoProvider>
            </FocusModeControlsProvider>
          </FullscreenProvider>
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
