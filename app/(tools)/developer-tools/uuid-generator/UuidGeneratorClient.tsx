'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Fingerprint, RefreshCw, List, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

type UUIDVersion = 'v1' | 'v4' | 'v5' | 'v7';
type UUIDFormat = 'standard' | 'uppercase' | 'no-dashes' | 'braces' | 'urn';
type TabMode = 'generate' | 'bulk' | 'validate';

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
  const [mode, setMode] = useState<TabMode>('generate');
  
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

  const renderVersionAndFormat = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-text-2">Version</label>
        <div className="flex flex-wrap gap-2">
          {(['v1', 'v4', 'v5', 'v7'] as UUIDVersion[]).map(v => (
            <button
              key={v}
              onClick={() => { setVersion(v); if(mode === 'generate') handleGenerate(); }}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all",
                version === v ? "bg-blue text-white shadow-md shadow-blue/10" : "bg-bg text-text-3 hover:text-text border border-border"
              )}
            >
              Version {v.replace('v', '')}
            </button>
          ))}
        </div>
      </div>

      {version === 'v5' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="uuid-v5-namespace" className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted block">Namespace</label>
            <select
              id="uuid-v5-namespace"
              value={v5Namespace}
              onChange={(e) => setV5Namespace(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none"
            >
              <option value={NAMESPACES.URL}>URL</option>
              <option value={NAMESPACES.DNS}>DNS</option>
              <option value={NAMESPACES.OID}>OID</option>
              <option value={NAMESPACES.X500}>X500</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="uuid-v5-name" className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted block">Name String</label>
            <input
              id="uuid-v5-name"
              type="text"
              value={v5Name}
              onChange={(e) => { setV5Name(e.target.value); if(mode === 'generate') handleGenerate(); }}
              placeholder="e.g., example.com"
              className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-bold text-text-2">Format</label>
        <div className="flex flex-wrap gap-2">
          {(['standard', 'uppercase', 'no-dashes', 'braces', 'urn'] as UUIDFormat[]).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors",
                format === f ? "bg-blue/10 text-blue border border-blue/20" : "text-text-muted hover:bg-bg border border-transparent"
              )}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ToolWorkspace
      tabs={{
        activeId: mode,
        onChange: setMode,
        options: [
          { id: 'generate', label: 'Generate', icon: <Fingerprint className="w-4 h-4" /> },
          { id: 'bulk', label: 'Bulk Generate', icon: <List className="w-4 h-4" /> },
          { id: 'validate', label: 'Validate', icon: <ShieldCheck className="w-4 h-4" /> },
        ]
      }}
      optionsPanel={
        mode === 'generate' ? (
          <div className="space-y-6">
            {renderVersionAndFormat()}
            <button 
              onClick={handleGenerate}
              className="w-full mt-6 py-3.5 bg-blue text-white font-black uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate UUID
            </button>
          </div>
        ) : mode === 'bulk' ? (
          <div className="space-y-6">
            <ToolInput
              label="Count"
              type="number"
              value={bulkCount ? bulkCount.toString() : ''}
              onChange={(v) => setBulkCount(Number(v))}
            />
            <div className="my-6 border-t border-border/50" />
            {renderVersionAndFormat()}
            <button 
              onClick={handleBulkGenerate}
              className="w-full mt-6 py-3.5 bg-blue text-white font-black uppercase tracking-widest rounded-xl transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            >
              <List className="w-4 h-4" />
              Generate List
            </button>
          </div>
        ) : null
      }
      input={
        mode === 'validate' ? (
          <ToolInput
            label="UUID to Validate"
            value={validatorInput}
            onChange={setValidatorInput}
            placeholder="Paste UUID here..."
          />
        ) : undefined
      }
      output={
        mode === 'generate' ? (
          <ToolResultArea
            label="Generated UUID"
            value={formattedCurrent}
          />
        ) : mode === 'bulk' ? (
          <ToolResultArea
            label="Generated UUIDs"
            value={bulkList.join('\n')}
          />
        ) : mode === 'validate' ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="text-sm font-bold text-text-2">Validation Result</div>
            {validatorInput ? (
              validateUUID(validatorInput) ? (
                <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-2xl">
                  <Check className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-success font-bold">Valid UUID</p>
                    <p className="text-xs text-success/70 font-medium mt-0.5">Detected Version: {detectVersion(validatorInput)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-error" />
                  <div>
                    <p className="text-error font-bold">Invalid UUID Format</p>
                    <p className="text-xs text-error/70 font-medium mt-0.5">Ensure it follows the 8-4-4-4-12 hex pattern.</p>
                  </div>
                </div>
              )
            ) : (
              <div className="text-text-4 italic text-sm">Enter a UUID to validate</div>
            )}
          </div>
        ) : null
      }
    />
  );
}

