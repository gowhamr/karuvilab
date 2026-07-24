"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

import { parseBERTLV } from '@/src/lib/emv/tlv';

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseTlv = (hexData: string) => {
    try {
      if (!hexData.trim()) return '';
      const hex = hexData.replace(/[\s\r\n]/g, '').toUpperCase();
      if (!/^[0-9A-F]+$/.test(hex)) return 'Invalid hex string';
      
      const parsedNodes = parseBERTLV(hex);
      return JSON.stringify(parsedNodes, null, 2);
    } catch (err: any) {
      return `Failed to parse TLV data: ${err.message}`;
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
