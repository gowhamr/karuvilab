"use client";

import React, { useState, useDeferredValue, useMemo } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { AlertCircle } from 'lucide-react';
import { parseIso8583 } from '@/src/lib/iso8583/parser';

export default function ToolClient() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);
  
  const { output, error } = useMemo(() => {
    try {
      if (!deferredInput.trim()) return { output: '', error: null };
      const parsed = parseIso8583(deferredInput);
      return { 
        output: JSON.stringify({
          message: "Parsed Core Banking / ISO 8583 Log",
          rawLength: deferredInput.length,
          iso8583: parsed
        }, null, 2), 
        error: null 
      };
    } catch (err: any) {
      return { output: '', error: err.message || 'Failed to parse core banking log' };
    }
  }, [deferredInput]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ToolInput 
        value={input} 
        onChange={setInput} 
        placeholder="Paste Core Banking trace log or ISO 8583 hex string here" 
        label="Core Banking Log / ISO 8583"
      />
      <div className="flex flex-col gap-2 h-full min-h-[400px]">
        {error ? (
          <div className="p-4 bg-error/10 text-error rounded-xl border border-error/20 flex items-start gap-3">
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Parsing Error</p>
               <p className="text-sm mt-1">{error}</p>
             </div>
          </div>
        ) : (
          <ToolResultArea 
            value={output} 
            label="Parsed Data"
            language="json"
          />
        )}
      </div>
    </div>
  );
}
