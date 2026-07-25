'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Workbox } from 'workbox-window';
import { X, Download, Share } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { usePWAStore } from '@/src/store/usePWAStore';
import { useSearchStore } from '@/src/store/useSearchStore';
import { useShallow } from 'zustand/react/shallow';
import { useToast } from '@/components/ui/Toast';

export function PWARegistration() {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Read persisted PWA state and hydration state from Zustand + IndexedDB
  const { pwaVisitCount, pwaDismissedAt, incrementPWAVisit, dismissPWA, hasHydrated, forceShowPrompt, setForceShowPrompt } = usePWAStore(
    useShallow((s) => ({
      pwaVisitCount: s.pwaVisitCount,
      pwaDismissedAt: s.pwaDismissedAt,
      incrementPWAVisit: s.incrementPWAVisit,
      dismissPWA: s.dismissPWA,
      hasHydrated: s.hasHydrated,
      forceShowPrompt: s.forceShowPrompt,
      setForceShowPrompt: s.setForceShowPrompt,
    }))
  );
  
  // Read Search store state to hide install prompt when search palette is open
  const isPaletteOpen = useSearchStore((s) => s.isPaletteOpen);

  // 1. Register Service Worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const swPath = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/sw.js";
        const wb = new Workbox(swPath);

        const onUpdate = () => {
          wb.messageSkipWaiting();
        };

        wb.addEventListener('waiting', onUpdate);

        wb.register().catch((err) => {
          // Non-critical: SW registration can fail in private mode or blocked environments
          console.warn('[KV] Service Worker registration skipped:', err);
        });
      } catch (err) {
        // Silently handle environments that don't support Workbox
        console.warn('[KV] Service Worker unavailable:', err);
      }
    }
  }, []);

  // 2. Setup eligibility check once store has hydrated from IndexedDB
  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') return;

    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const safari = /^((?!chrome|android).)*safari/i.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    Promise.resolve().then(() => {
      setIsIOS(ios);
      setIsSafari(safari);
    });

    if (isStandalone) return; // Already installed, do nothing

    // Track visit count (once per session)
    let currentVisits = pwaVisitCount;
    if (!sessionStorage.getItem('kv-visit-incremented')) {
      currentVisits = pwaVisitCount + 1;
      Promise.resolve().then(() => {
        incrementPWAVisit();
      });
      sessionStorage.setItem('kv-visit-incremented', 'true');
    }

    // Check if dismissed in last 7 days
    if (pwaDismissedAt) {
      const elapsed = Date.now() - pwaDismissedAt;
      if (elapsed < 7 * 24 * 60 * 60 * 1000) return; // 7 days cooldown
    }

    // User requested to disable automatic PWA popup.
    // It will now only be triggered manually from the Settings page.
  }, [hasHydrated, pwaVisitCount, pwaDismissedAt, incrementPWAVisit]);

  // 3. Native prompt listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Manage focus when prompt appears for accessibility
  useEffect(() => {
    if (showPrompt && bannerRef.current) {
      bannerRef.current.focus();
    }
  }, [showPrompt]);

  useEffect(() => {
    if (forceShowPrompt) {
      setShowPrompt(true);
      setForceShowPrompt(false);
    }
  }, [forceShowPrompt, setForceShowPrompt]);

  const handleDismiss = () => {
    setShowPrompt(false);
    dismissPWA();
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt['prompt']();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Hide the banner if not eligible OR if command/search palette is open
  if (!showPrompt || isPaletteOpen) return null;

  return (
    <AnimatePresence>
      <m.div
        ref={bannerRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Install KaruviLab PWA"
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="
          fixed left-4 right-4 z-max
          top-20 md:top-24 md:right-6 md:left-auto md:w-96
          p-5 rounded-3xl
          bg-mat-surface border border-mat-border shadow-2xl shadow-mat-shine
          flex flex-col gap-4 outline-none focus:ring-2 focus:ring-blue/30
        "
      >
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="absolute top-3 right-3 p-2 rounded-xl text-text-4 hover:text-text hover:bg-mat-hover transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex gap-4 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-blue" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-text tracking-tight">Install KaruviLab</h3>
            <p className="text-xs text-text-3 leading-relaxed">
              Install as a private offline web app.
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isIOS && isSafari ? (
          // iOS Safari Share Sheet Instructions
          <div className="flex items-start gap-2.5 p-3 bg-bg/50 border border-border/30 rounded-2xl text-xs text-text-2">
            <Share className="w-4 h-4 text-blue shrink-0 mt-0.5" />
            <p className="leading-normal">
              To install: tap the <strong className="text-text">Share</strong> button in Safari, then select <strong className="text-text">Add to Home Screen</strong>.
            </p>
          </div>
        ) : (
          // Native PWA Install Action or Fallback for Brave/Opera
          <div className="space-y-3">
            {!deferredPrompt && !isIOS && !isSafari ? (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-text-2">
                <p className="font-bold text-error mb-1">Automatic install blocked</p>
                <p>Your browser (like Brave, Opera, or Firefox) blocks automatic installation. To install, look for the <strong>Install</strong> icon in your URL address bar or open the browser menu (⋮) and select <strong>Install App</strong>.</p>
              </div>
            ) : null}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                disabled={!deferredPrompt}
                aria-label="Install KaruviLab app"
                className="flex-1 py-2.5 bg-blue hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-tiny font-bold uppercase tracking-widest-sm transition-all active:scale-95 shadow-md shadow-blue/10"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 bg-bg border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:text-text hover:bg-mat-hover transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </m.div>
    </AnimatePresence>
  );
}
