"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { parseIso8583 } from '@/src/lib/iso8583/parser';

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseCoreBankingLog = (data: string) => {
    try {
      if (!data.trim()) return '';
      const parsed = parseIso8583(data);
      return JSON.stringify({
        message: "Parsed Core Banking / ISO 8583 Log",
        rawLength: data.length,
        iso8583: parsed
      }, null, 2);
    } catch (err: any) {
      return `Failed to parse core banking log: ${err.message}`;
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    setOutput(parseCoreBankingLog(val));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ToolInput 
        value={input} 
        onChange={handleInput} 
        placeholder="Paste Core Banking trace log or ISO 8583 hex string here" 
        label="Core Banking Log / ISO 8583"
      />
      <ToolResultArea 
        value={output} 
        label="Parsed Data"
        language="json"
      />
    </div>
  );
}
