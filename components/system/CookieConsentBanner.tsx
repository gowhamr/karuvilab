"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

export function CookieConsentBanner() {
  // Temporarily disabled: Google Ads are not currently displayed
  return null;
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem("kv-ad-consent"));
  }, []);

  const handleConsent = (value: "accepted" | "rejected") => {
    localStorage.setItem("kv-ad-consent", value);
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
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <Cookie className="w-5 h-5" />
            </div>
            <p className="text-xs text-text-3 leading-relaxed">
              This site uses third‑party advertising cookies from Google to display personalized ads. You can accept or reject these cookies. Learn more in our <Link href="/privacy" className="text-indigo-500 hover:underline font-bold">Privacy Policy</Link>.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleConsent("rejected")}
              className="px-4 py-2.5 border border-border hover:bg-bg text-text-3 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all"
            >
              Reject All
            </button>
            <button 
              onClick={() => handleConsent("accepted")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all"
            >
              Accept All
            </button>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
