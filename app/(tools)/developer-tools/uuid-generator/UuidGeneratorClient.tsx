'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Fingerprint, RefreshCw, Copy, List, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

type UUIDVersion = 'v1' | 'v4' | 'v5' | 'v7';
type UUIDFormat = 'standard' | 'uppercase' | 'no-dashes' | 'braces' | 'urn';

interface UUIDResult {
  uuid: string;
  version: UUIDVersion;
  formatted: string;
  timestamp?: string;
  isValid: boolean;
}

const NAMESPACES = {
  DNS:  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL:  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID:  '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
};

// Pure Functions
function generateV4(): string {
  return crypto.randomUUID();
}

function generateV7(): string {
  const ts = Date.now().toString(16).padStart(12, '0');
  const rand = crypto.getRandomValues(new Uint8Array(10));
  rand[0] = (rand[0]! & 0x0f) | 0x70; // version 7
  rand[2] = (rand[2]! & 0x3f) | 0x80; // variant
  const hex = Array.from(rand).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${ts.substring(0,8)}-${ts.substring(8,12)}-${hex.substring(0,4)}-${hex.substring(4,8)}-${hex.substring(8)}`;
}

function generateV1(): string {
  // Simulated v1 for client-side
  const time = new Date().getTime();
  const hexTime = time.toString(16).padStart(16, '0');
  const mac = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const clockSeq = crypto.getRandomValues(new Uint16Array(1))[0]!.toString(16).padStart(4, '0');
  
  return `${hexTime.substring(8,16)}-${hexTime.substring(4,8)}-1${hexTime.substring(1,4)}-${clockSeq}-${mac}`;
}

async function generateV5(namespace: string, name: string): Promise<string> {
  // Simplified SHA-1 hashing for V5
  const encoder = new TextEncoder();
  const data = encoder.encode(namespace + name);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const h1 = hex.substring(0,8);
  const h2 = hex.substring(8,12);
  const h3 = (parseInt(hex.substring(12,16), 16) & 0x0fff | 0x5000).toString(16).padStart(4, '0');
  const h4 = (parseInt(hex.substring(16,20), 16) & 0x3fff | 0x8000).toString(16).padStart(4, '0');
  const h5 = hex.substring(20,32);
  
  return `${h1}-${h2}-${h3}-${h4}-${h5}`;
}

function formatUUID(uuid: string, format: UUIDFormat): string {
  let formatted = uuid.toLowerCase();
  if (format === 'uppercase') formatted = uuid.toUpperCase();
  if (format === 'no-dashes') formatted = formatted.replace(/-/g, '');
  if (format === 'braces') formatted = `{${formatted}}`;
  if (format === 'urn') formatted = `urn:uuid:${formatted}`;
  return formatted;
}

function validateUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-57][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

function detectVersion(uuid: string): UUIDVersion | null {
  if (!validateUUID(uuid)) return null;
  const v = uuid.charAt(14);
  if (v === '1') return 'v1';
  if (v === '4') return 'v4';
  if (v === '5') return 'v5';
  if (v === '7') return 'v7';
  return null;
}

export default function UuidGeneratorClient() {
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [format, setFormat] = useState<UUIDFormat>('standard');
  const [current, setCurrent] = useState<string>(generateV4());
  
  // Bulk state
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [bulkList, setBulkList] = useState<string[]>([]);
  
  // V5 state
  const [v5Namespace, setV5Namespace] = useState<string>(NAMESPACES.URL);
  const [v5Name, setV5Name] = useState<string>('');
  
  // Validator state
  const [validatorInput, setValidatorInput] = useState<string>('');

  const handleGenerate = useCallback(async () => {
    let newUuid = '';
    if (version === 'v4') newUuid = generateV4();
    else if (version === 'v1') newUuid = generateV1();
    else if (version === 'v7') newUuid = generateV7();
    else if (version === 'v5') newUuid = await generateV5(v5Namespace, v5Name);
    
    setCurrent(newUuid);
  }, [version, v5Namespace, v5Name]);

  const handleBulkGenerate = useCallback(async () => {
    const list: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      if (version === 'v4') list.push(formatUUID(generateV4(), format));
      else if (version === 'v1') list.push(formatUUID(generateV1(), format));
      else if (version === 'v7') list.push(formatUUID(generateV7(), format));
      else if (version === 'v5') list.push(formatUUID(await generateV5(v5Namespace, v5Name + i), format));
    }
    setBulkList(list);
  }, [bulkCount, version, format, v5Namespace, v5Name]);

  const formattedCurrent = useMemo(() => formatUUID(current, format), [current, format]);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* 1. Main Generator Section */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
          <Fingerprint className="w-4 h-4" />
          UUID Generator
        </h2>

        <div className="flex flex-wrap gap-2">
          {(['v1', 'v4', 'v5', 'v7'] as UUIDVersion[]).map(v => (
            <button
              key={v}
              onClick={() => { setVersion(v); handleGenerate(); }}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all",
                version === v ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-bg text-text-3 hover:text-text border border-border"
              )}
            >
              Version {v.replace('v', '')}
            </button>
          ))}
        </div>

        {version === 'v5' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg/50 p-4 rounded-2xl border border-border/50">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4 block mb-2">Namespace</label>
              <select 
                value={v5Namespace} 
                onChange={(e) => setV5Namespace(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl p-3 text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none"
              >
                <option value={NAMESPACES.URL}>URL</option>
                <option value={NAMESPACES.DNS}>DNS</option>
                <option value={NAMESPACES.OID}>OID</option>
                <option value={NAMESPACES.X500}>X500</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-4 block mb-2">Name String</label>
              <input 
                type="text" 
                value={v5Name} 
                onChange={(e) => { setV5Name(e.target.value); handleGenerate(); }}
                placeholder="e.g., example.com"
                className="w-full bg-surface border border-border rounded-xl p-3 text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none"
              />
            </div>
          </div>
        )}

        <div className="relative group">
          <div className="font-mono text-xl sm:text-2xl md:text-3xl bg-bg border-2 border-border rounded-2xl p-6 md:p-8 text-text text-center w-full transition-all flex items-center justify-center break-all">
            {formattedCurrent}
          </div>
          <div className="absolute -top-3 right-4 flex gap-2">
            <button
              onClick={handleGenerate}
              className="p-2.5 bg-blue text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(['standard', 'uppercase', 'no-dashes', 'braces', 'urn'] as UUIDFormat[]).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors",
                  format === f ? "bg-blue/10 text-blue border border-blue/20" : "text-text-4 hover:bg-bg border border-transparent"
                )}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
          <CopyButton text={formattedCurrent} />
        </div>
      </div>

      {/* 2. Bulk Generation */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-6">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
          <List className="w-4 h-4" />
          Bulk Generation
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full flex items-center gap-3 bg-bg border border-border rounded-xl p-2 px-4">
            <span className="text-xs font-bold text-text-4 uppercase tracking-widest">Count</span>
            <input 
              type="number" 
              min={1} 
              max={1000} 
              value={bulkCount} 
              onChange={(e) => setBulkCount(Number(e.target.value))}
              className="bg-transparent border-none outline-none text-text font-mono font-bold w-full"
            />
          </div>
          <button 
            onClick={handleBulkGenerate}
            className="w-full sm:w-auto px-8 py-3.5 bg-surface border-2 border-border hover:border-blue text-text-2 hover:text-blue font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
          >
            Generate List
          </button>
        </div>

        {bulkList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-4">Generated {bulkList.length} UUIDs</span>
              <CopyButton text={bulkList.join('\n')} label="Copy All" />
            </div>
            <textarea 
              readOnly 
              value={bulkList.join('\n')}
              className="w-full h-48 bg-bg border border-border rounded-2xl p-4 font-mono text-sm text-text-3 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 3. Validator */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-6">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
          <ShieldCheck className="w-4 h-4" />
          UUID Validator
        </h2>
        
        <input 
          type="text" 
          value={validatorInput} 
          onChange={(e) => setValidatorInput(e.target.value)}
          placeholder="Paste UUID here..."
          className="w-full bg-bg border border-border rounded-xl p-4 font-mono text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none transition-all"
        />

        {validatorInput && (
          <div className="pt-2">
            {validateUUID(validatorInput) ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <Check className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-green-600 dark:text-green-400 font-bold">Valid UUID</p>
                  <p className="text-xs text-green-600/70 font-medium mt-0.5">Detected Version: {detectVersion(validatorInput)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-600 dark:text-red-400 font-bold">Invalid UUID Format</p>
                  <p className="text-xs text-red-600/70 font-medium mt-0.5">Ensure it follows the 8-4-4-4-12 hex pattern.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

