import { Activity } from "lucide-react";
import { DecodedJWT } from "../utils";

interface DeveloperAnalysisProps {
  decoded: DecodedJWT;
}

export function DeveloperAnalysis({ decoded }: DeveloperAnalysisProps) {
  return (
    <section aria-labelledby="analysis-heading" className="bg-surface border border-border p-5 rounded-3xl space-y-4">
       <div className="flex items-center justify-between">
          <h3 id="analysis-heading" className="text-sm font-bold text-text flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue" aria-hidden="true" /> Developer Analysis
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Total Size</p>
              <p className="text-sm font-mono text-text mt-1">{decoded.sizes.total} B</p>
           </div>
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Header Size</p>
              <p className="text-sm font-mono text-purple-400 mt-1">{decoded.sizes.header} B</p>
           </div>
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Payload Size</p>
              <p className="text-sm font-mono text-blue mt-1">{decoded.sizes.payload} B</p>
           </div>
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Signature Size</p>
              <p className="text-sm font-mono text-emerald-400 mt-1">{decoded.sizes.sig} B</p>
           </div>
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Encoding</p>
              <p className="text-sm font-mono text-text mt-1">Base64URL</p>
           </div>
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Token Entropy</p>
              <p className="text-sm font-mono text-text mt-1">{decoded.entropy.total} bits</p>
           </div>
           <div className="bg-bg border border-border rounded-xl p-3">
              <p className="text-[10px] uppercase font-bold text-text-muted">Signature Entropy</p>
              <p className="text-sm font-mono text-text mt-1">{decoded.entropy.sig} bits</p>
           </div>
        </div>
    </section>
  );
}
