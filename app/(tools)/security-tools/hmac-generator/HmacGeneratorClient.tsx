'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';

import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

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

  const hasError = output.startsWith('Error:');
  const isValid = mode === 'verify' && output && expectedHmac && output === expectedHmac && !hasError;
  const isInvalid = mode === 'verify' && output && expectedHmac && output !== expectedHmac && !hasError;

  return (
    <ToolWorkspace
      tabs={{
        options: [
          { id: 'generate', label: 'Generate' },
          { id: 'verify', label: 'Verify' }
        ],
        activeId: mode,
        onChange: (id) => setMode(id as 'generate' | 'verify'),
      }}
      input={
        <div className="space-y-6">
          <ToolInput
            label="Secret Key"
            value={key}
            onChange={setKey}
            placeholder="Enter secret key..."
            mono
            description={`${key.length} chars`}
          />
          <ToolInput
            label="Message Data"
            value={message}
            onChange={setMessage}
            placeholder="Paste payload or message here..."
            rows={5}
            mono
            description={`${message.length} chars`}
          />
          {mode === 'verify' && (
            <AnimatePresence mode="wait">
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="pt-2">
                  <ToolInput
                    label="Expected HMAC Signature"
                    value={expectedHmac}
                    onChange={(val) => setExpectedHmac(val.trim())}
                    placeholder={`Paste expected ${encoding} signature...`}
                    mono
                  />
                </div>
              </m.div>
            </AnimatePresence>
          )}
        </div>
      }
      optionsPanel={
        <div className="space-y-6">
          <div className="space-y-3">
            <label id="hmac-alg-label" className="text-xs font-bold text-text-3 block">Algorithm</label>
            <div role="group" aria-labelledby="hmac-alg-label" className="flex flex-wrap gap-2 bg-bg border border-border p-1 rounded-2xl">
              {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as HMACAlgorithm[]).map(alg => (
                <button
                  key={alg}
                  onClick={() => setAlgorithm(alg)}
                  className={cn(
                    "flex-1 min-w-[70px] py-2.5 rounded-xl text-xs font-bold transition-all",
                    algorithm === alg ? "bg-surface text-blue shadow-sm ring-1 ring-border" : "text-text-muted hover:text-text"
                  )}
                >
                  {alg}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label id="hmac-enc-label" className="text-xs font-bold text-text-3 block">Encoding</label>
            <div role="group" aria-labelledby="hmac-enc-label" className="flex flex-wrap gap-2 bg-bg border border-border p-1 rounded-2xl">
              {(['hex', 'base64', 'base64url'] as HMACEncoding[]).map(enc => (
                <button
                  key={enc}
                  onClick={() => setEncoding(enc)}
                  className={cn(
                    "flex-1 min-w-[70px] py-2.5 rounded-xl text-xs font-bold uppercase transition-all",
                    encoding === enc ? "bg-surface text-text shadow-sm ring-1 ring-border" : "text-text-muted hover:text-text"
                  )}
                >
                  {enc}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      output={
        <div className="flex flex-col h-full space-y-4">
          <ToolResultArea
            label={mode === 'verify' ? 'Computed Signature' : 'Generated Signature'}
            value={hasError ? '' : output}
            error={hasError ? output : undefined}
          />
          {mode === 'verify' && expectedHmac && output && !hasError && (
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
      }
      infoPanel={
        <div className="bg-surface border border-border rounded-4xl p-6 shadow-sm space-y-4">
           <div className="flex items-center gap-2 text-emerald-600 mb-2">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-tiny font-bold uppercase tracking-widest-sm">Client-Side Security</span>
           </div>
           <p className="text-sm font-medium text-text-3 leading-relaxed">
             HMAC generation uses the browser's native <code className="text-blue bg-blue/10 px-1.5 py-0.5 rounded">crypto.subtle</code> API. The secret key and payload are processed entirely in memory and are <strong>never transmitted</strong> to any server.
           </p>
        </div>
      }
    />
  );
}
