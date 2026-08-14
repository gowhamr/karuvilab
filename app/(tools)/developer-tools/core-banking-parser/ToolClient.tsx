"use client";

import React, { useState, useDeferredValue, useMemo } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
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
    <ToolWorkspace
      input={
        <ToolInput 
          value={input} 
          onChange={setInput} 
          placeholder="Paste Core Banking trace log or ISO 8583 hex string here" 
          label="Core Banking Log / ISO 8583"
        />
      }
      output={
        <ToolResultArea 
          value={output} 
          label="Parsed Data"
          language="json"
          error={error || undefined}
        />
      }
    />
  );
}
