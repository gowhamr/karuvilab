"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseCoreBankingLog = (data: string) => {
    try {
      if (!data.trim()) return '';
      // Mock parser for core banking trace logs
      const parsed = {
        message: "Parsed Core Banking Log (Mock Data)",
        rawLength: data.length,
        iso8583: {
          mti: "0200",
          bitmap: "F238800128E08000",
          fields: [
            { id: 2, name: "PAN", value: "XXXXXXXXXXXX1234" },
            { id: 3, name: "Processing Code", value: "000000" },
            { id: 4, name: "Amount, Transaction", value: "000000001000" }
          ]
        }
      };
      
      return JSON.stringify(parsed, null, 2);
    } catch {
      return 'Failed to parse core banking log';
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
