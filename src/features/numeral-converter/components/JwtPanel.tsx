"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";

interface JwtPanelProps {
  jwtDecoded: any;
}

export function JwtPanel({ jwtDecoded }: JwtPanelProps) {
  if (!jwtDecoded) return null;

  return (
    <div className="space-y-6">
      {jwtDecoded.error ? (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>JWT Decoding Error: {jwtDecoded.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-black text-text-3 uppercase tracking-widest">JWT Header</span>
                <CopyButton text={JSON.stringify(jwtDecoded.header, null, 2)} label="Copy" />
              </div>
              <pre className="bg-bg border border-border p-4 rounded-xl font-mono text-xs text-error overflow-x-auto">
                {JSON.stringify(jwtDecoded.header, null, 2)}
              </pre>
            </div>

            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-black text-text-3 uppercase tracking-widest">JWT Signature</span>
                <CopyButton text={jwtDecoded.signature} label="Copy" />
              </div>
              <div className="bg-bg border border-border p-4 rounded-xl font-mono text-xs break-all text-text-4">
                {jwtDecoded.signature || "No signature segment present."}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-black text-text-3 uppercase tracking-widest">JWT Payload</span>
                <CopyButton text={JSON.stringify(jwtDecoded.payload, null, 2)} label="Copy" />
              </div>
              <pre className="bg-bg border border-border p-4 rounded-xl font-mono text-xs text-blue overflow-x-auto">
                {JSON.stringify(jwtDecoded.payload, null, 2)}
              </pre>
            </div>

            <div className="bg-surface border border-border p-6 rounded-4xl space-y-4 shadow-sm">
              <span className="text-xs font-black text-text-3 uppercase tracking-widest block border-b border-border/50 pb-2">Status & Dates</span>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-text-2">Status:</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase ${
                    jwtDecoded.expiryStatus === "valid" ? "bg-success/10 border border-success/20 text-success" : "bg-error/10 border border-error/20 text-error"
                  }`}>
                    {jwtDecoded.expiryStatus}
                  </span>
                </div>
                {jwtDecoded.expDate && (
                  <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                    <span className="font-bold text-text-3">Expiry:</span>
                    <span className="font-mono text-text-2">{jwtDecoded.expDate.toLocaleString()}</span>
                  </div>
                )}
                {jwtDecoded.iatDate && (
                  <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                    <span className="font-bold text-text-3">Issued:</span>
                    <span className="font-mono text-text-2">{jwtDecoded.iatDate.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
