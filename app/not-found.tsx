import Link from "next/link";
import type { Metadata } from "next";
import { Search, Home, ArrowRight, Compass } from "lucide-react";

export const metadata: Metadata = { 
  title: "404 - Page Not Found | KaruviLab",
  description: "The requested tool or page could not be found."
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface/50 border border-border backdrop-blur-md rounded-6xl p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-content space-y-8">
          <div className="mx-auto w-24 h-24 bg-blue/10 text-blue rounded-full flex items-center justify-center mb-8">
            <Compass className="w-12 h-12" />
          </div>

          <div>
            <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-text to-text-muted opacity-20 select-none">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mt-[-2rem] md:mt-[-3rem] text-text">Lost in the lab?</h2>
          </div>

          <p className="text-lg text-text-3 max-w-md mx-auto">
            The tool or page you're looking for has moved, doesn't exist, or is still being forged.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue text-white font-bold rounded-2xl hover:bg-blue/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue/20"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            
            <Link 
              href="/all-tools" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-surface-2 text-text font-bold rounded-2xl border border-border hover:border-blue/30 hover:bg-surface-2/80 hover:scale-105 active:scale-95 transition-all"
            >
              <Search className="w-5 h-5" />
              Browse All Tools
              <ArrowRight className="w-4 h-4 ml-1 opacity-50" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
