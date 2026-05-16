"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, Home, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-3xl bg-blue/10 flex items-center justify-center text-blue"
      >
        <WifiOff size={48} />
      </motion.div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-black uppercase tracking-tight">You're Offline</h1>
        <p className="text-text-4 font-medium leading-relaxed">
          It looks like you've lost your connection. Some tools might still work if you've visited them before, but this page hasn't been cached yet.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-8 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
        
        <Link 
          href="/"
          className="flex items-center gap-2 px-8 py-4 bg-surface border border-border text-text font-black uppercase tracking-widest rounded-2xl hover:bg-bg transition-all"
        >
          <Home size={18} />
          Go Home
        </Link>
      </div>

      <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl w-full">
        <div className="p-6 bg-surface border border-border rounded-3xl space-y-2">
          <h3 className="font-black uppercase tracking-widest text-[10px] text-blue">Local Tools</h3>
          <p className="text-xs text-text-3 font-medium">Most calculators and converters work 100% offline once loaded.</p>
        </div>
        <div className="p-6 bg-surface border border-border rounded-3xl space-y-2">
          <h3 className="font-black uppercase tracking-widest text-[10px] text-blue">Data Privacy</h3>
          <p className="text-xs text-text-3 font-medium">Your data never leaves your device, connection or no connection.</p>
        </div>
      </div>
    </div>
  );
}
