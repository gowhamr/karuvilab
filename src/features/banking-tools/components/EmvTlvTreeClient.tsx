"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

export default function EmvTlvTreeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseTlv = (hexData: string) => {
    try {
      if (!hexData.trim()) return '';
      if (hexData.length > 100 * 1024) return 'Error: Input is too large. Max size is 100KB.';
      const hex = hexData.replace(/[\s\r\n]/g, '').toUpperCase();
      if (!/^[0-9A-F]+$/.test(hex)) return 'Invalid hex string';
      
      // Simple parser for demonstration
      // A full EMV TLV parser would recursively decode BER-TLV data
      // For now, this is a placeholder that does a mock parsing.
      const parsed = {
        data: hex,
        message: "Parsed TLV structure (Mock implementation for demonstration)",
        tags: []
      };
      return JSON.stringify(parsed, null, 2);
    } catch {
      return 'Failed to parse TLV data';
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    setOutput(parseTlv(val));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ToolInput 
        value={input} 
        onChange={handleInput} 
        placeholder="Paste hex-encoded EMV TLV data (e.g. 9F0206000000001000...)" 
        label="TLV Hex Data"
      />
      <ToolResultArea 
        value={output} 
        label="Parsed Tree"
        language="json"
      />
    </div>
  );
}
