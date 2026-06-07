"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { idbStorage } from "@/src/store/idb-storage";
import { useSettingsStore } from "@/src/store/settings/store";

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    idbStorage.getItem("kv-ad-consent").then((val) => {
      setConsent(val);
    });
  }, []);

  const handleConsent = async (value: "accepted" | "rejected") => {
    await idbStorage.setItem("kv-ad-consent", value);
    useSettingsStore.setState({ adsConsent: value === "accepted" });
    setConsent(value);
    if (value === "accepted") {
      window.location.reload();
    }
  };

  if (consent !== null) return null;

  return (
    <AnimatePresence>
      <m.div
        role="dialog"
        aria-label="Cookie consent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[450px] z-[1000]"
      >
        <div className="backdrop-blur-md bg-surface/90 border border-border rounded-2xl shadow-surface-4 p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center flex-shrink-0 text-blue">
              <Cookie className="w-5 h-5" />
            </div>
            <p className="text-xs text-text-3 leading-relaxed">
              To keep KaruviLab free and private, we use Google AdSense to serve personalized ads. This requires third‑party advertising cookies. <strong className="text-blue">Your tool data remains 100% local and is never shared.</strong> You can accept or reject these cookies below. Learn more in our <Link href="/privacy" className="text-blue hover:underline font-bold">Privacy Policy</Link>.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleConsent("rejected")}
              className="px-4 py-3 border border-mat-border hover:bg-mat-hover text-text-3 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95"
            >
              Reject All
            </button>
            <button 
              onClick={() => handleConsent("accepted")}
              className="px-4 py-3 bg-blue hover:bg-blue-dark text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-blue/20 active:scale-95"
            >
              Accept All
            </button>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
