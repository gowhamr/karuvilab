'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { KeyRound, Check, AlertCircle, Copy, FileCheck, ShieldCheck } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

type HMACAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
type HMACEncoding = 'hex' | 'base64' | 'base64url';

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateHMAC(
  message: string,
  key: string,
  algorithm: HMACAlgorithm,
  encoding: HMACEncoding
): Promise<string> {
  if (!message || !key) return '';

  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));

  if (encoding === 'hex') return arrayBufferToHex(signature);
  const b64 = arrayBufferToBase64(signature);
  if (encoding === 'base64') return b64;
  return base64ToBase64Url(b64);
}

export default function HmacGeneratorClient() {
  const [mode, setMode] = useState<'generate' | 'verify'>('generate');
  const [message, setMessage] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [algorithm, setAlgorithm] = useState<HMACAlgorithm>('SHA-256');
  const [encoding, setEncoding] = useState<HMACEncoding>('hex');
  const [expectedHmac, setExpectedHmac] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const compute = useCallback(async () => {
    if (!message || !key) {
      setOutput('');
      return;
    }
    if (message.length > 5 * 1024 * 1024) {
      setOutput('Error: Message is too large. Maximum size is 5MB.');
      return;
    }
    if (key.length > 1 * 1024 * 1024) {
      setOutput('Error: Key is too large. Maximum size is 1MB.');
      return;
    }
    try {
      const result = await generateHMAC(message, key, algorithm, encoding);
      setOutput(result);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
  }, [message, key, algorithm, encoding]);

  useEffect(() => {
    compute();
  }, [compute]);

  const isValid = mode === 'verify' && output && expectedHmac && output === expectedHmac;
  const isInvalid = mode === 'verify' && output && expectedHmac && output !== expectedHmac;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-blue flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5" /> Configuration
            </h3>
            <div className="flex bg-bg border border-border rounded-xl p-1">
              <button onClick={() => setMode('generate')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'generate' ? "bg-surface text-text shadow-sm" : "text-text-4")}>Generate</button>
              <button onClick={() => setMode('verify')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'verify' ? "bg-surface text-text shadow-sm" : "text-text-4")}>Verify</button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label id="hmac-alg-label" className="text-xs font-bold text-text-3 block">Algorithm</label>
              <div role="group" aria-labelledby="hmac-alg-label" className="flex gap-2 bg-bg border border-border p-1 rounded-2xl">
                {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as HMACAlgorithm[]).map(alg => (
                  <button
                    key={alg}
                    onClick={() => setAlgorithm(alg)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all",
                      algorithm === alg ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-4 hover:text-text"
                    )}
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="hmac-secret-key" className="text-xs font-bold text-text-3 block flex justify-between">
                Secret Key
                <span className="text-xs text-text-4">{key.length} chars</span>
              </label>
              <input
                id="hmac-secret-key"
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter secret key..."
                className="w-full bg-bg border border-border rounded-2xl p-4 font-mono text-sm text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="hmac-message" className="text-xs font-bold text-text-3 block flex justify-between">
                Message Data
                <span className="text-xs text-text-4">{message.length} chars</span>
              </label>
              <textarea
                id="hmac-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste payload or message here..."
                className="w-full h-32 bg-bg border border-border rounded-2xl p-4 font-mono text-sm text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all resize-none"
              />
            </div>

            {mode === 'verify' && (
              <m.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-4 border-t border-border/50"
              >
                <label htmlFor="hmac-expected" className="text-xs font-bold text-text-3 block">Expected HMAC Signature</label>
                <input
                  id="hmac-expected"
                  type="text"
                  value={expectedHmac}
                  onChange={(e) => setExpectedHmac(e.target.value.trim())}
                  placeholder={`Paste expected ${encoding} signature...`}
                  className="w-full bg-bg border border-border rounded-2xl p-4 font-mono text-sm text-text focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all"
                />
              </m.div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-4xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-4 flex items-center gap-2">
                <FileCheck className="w-3 h-3" /> 
                {mode === 'verify' ? 'Computed Signature' : 'Generated Signature'}
              </h3>
              <div className="flex bg-bg border border-border rounded-xl p-1">
                {(['hex', 'base64', 'base64url'] as HMACEncoding[]).map(enc => (
                  <button
                    key={enc}
                    onClick={() => setEncoding(enc)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all",
                      encoding === enc ? "bg-surface text-text shadow-sm" : "text-text-4"
                    )}
                  >
                    {enc}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <textarea
                readOnly
                value={output}
                placeholder="Awaiting input..."
                className={cn(
                  "w-full h-32 bg-bg border border-border rounded-2xl p-6 font-mono text-sm outline-none resize-none break-all transition-colors",
                  output ? "text-text" : "text-text-4",
                  isValid ? "border-green-500/50 bg-green-500/5 text-green-500" : isInvalid ? "border-red-500/50 bg-red-500/5 text-red-500" : ""
                )}
              />
              {output && <div className="absolute top-4 right-4"><CopyButton text={output} /></div>}
            </div>

            {mode === 'verify' && expectedHmac && output && (
              <AnimatePresence mode="wait">
                {isValid ? (
                  <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">Signature Match Verified</p>
                      <p className="text-xs font-medium text-green-600/70 mt-0.5">The provided data and secret key produce the expected HMAC.</p>
                    </div>
                  </m.div>
                ) : (
                  <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">Signature Mismatch</p>
                      <p className="text-xs font-medium text-red-600/70 mt-0.5">The computed signature does not match the expected value.</p>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="bg-surface border border-border rounded-4xl p-6 shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-emerald-600 mb-2">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-tiny font-bold uppercase tracking-widest-sm">Client-Side Security</span>
             </div>
             <p className="text-sm font-medium text-text-3 leading-relaxed">
               HMAC generation uses the browser's native <code className="text-blue bg-blue/10 px-1.5 py-0.5 rounded">crypto.subtle</code> API. The secret key and payload are processed entirely in memory and are <strong>never transmitted</strong> to any server.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
