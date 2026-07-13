"use client";

import { Download, MonitorSmartphone, Share } from "lucide-react";
import { m } from "framer-motion";
import { usePWAStore } from "@/src/store/usePWAStore";

export function PWAInstallSection() {
  const setForceShowPrompt = usePWAStore(s => s.setForceShowPrompt);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-black text-text tracking-tight flex items-center gap-3">
          <MonitorSmartphone className="w-6 h-6 text-blue" /> Install App
        </h2>
        <p className="text-text-3 text-sm max-w-lg leading-relaxed">
          Install KaruviLab as a Progressive Web App (PWA) to use it fully offline, right from your home screen or dock.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="p-5 rounded-3xl bg-blue/5 border border-blue/10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-text flex items-center gap-2">
              Fast, Private, Offline
            </h3>
            <p className="text-xs text-text-4">
              Get an app-like experience without the App Store. Launch instantly and access all tools without an internet connection.
            </p>
          </div>
          <button
            onClick={() => setForceShowPrompt(true)}
            className="shrink-0 inline-flex items-center gap-2 bg-blue hover:bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
          >
            <Download className="w-4 h-4" /> Install Now
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-text-4">Installation Guide</h3>
          
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-surface-2/30 border border-border/40">
              <h4 className="text-sm font-bold text-text mb-1">Desktop (Chrome / Edge)</h4>
              <p className="text-xs text-text-4">Click the install button above or look for the install icon in your browser's address bar.</p>
            </div>
            
            <div className="p-4 rounded-2xl bg-surface-2/30 border border-border/40">
              <h4 className="text-sm font-bold text-text mb-1">iOS (Safari)</h4>
              <p className="text-xs text-text-4 flex items-center gap-1.5 flex-wrap">
                1. Tap the <Share className="w-3.5 h-3.5 text-blue" /> Share button at the bottom.<br />
                2. Scroll down and tap <strong className="text-text">Add to Home Screen</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-2/30 border border-border/40">
              <h4 className="text-sm font-bold text-text mb-1">Android (Chrome)</h4>
              <p className="text-xs text-text-4">Tap the install button above or select "Install app" from the browser menu (⋮).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
