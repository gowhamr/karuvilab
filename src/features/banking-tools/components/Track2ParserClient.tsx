"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

export default function Track2ParserClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseTrack2 = (data: string) => {
    try {
      if (!data.trim()) return '';
      // Simple parse logic for [PAN]=[YYMM][ServiceCode][DiscretionaryData]
      let pan = '', separator = '', yymm = '', serviceCode = '', discretionary = '';
      
      const normalized = data.replace(/;/g, '').replace(/\?/g, '');
      const match = normalized.match(/^(\d{1,19})([=D])(\d{4})(\d{3})(.*)$/i);
      
      if (match) {
        pan = match[1] || '';
        separator = match[2] || '';
        yymm = match[3] || '';
        serviceCode = match[4] || '';
        discretionary = match[5] || '';
        
        return JSON.stringify({
          PAN: pan,
          Separator: separator,
          ExpirationDate: `20${yymm.substring(0, 2)}-${yymm.substring(2, 4)}`,
          ServiceCode: serviceCode,
          DiscretionaryData: discretionary
        }, null, 2);
      }
      return 'Invalid Track 2 format';
    } catch {
      return 'Failed to parse Track 2 data';
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    setOutput(parseTrack2(val));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ToolInput 
        value={input} 
        onChange={handleInput} 
        placeholder="Paste Track 2 data here (e.g. ;1234567890123456=2412120...)" 
        label="Track 2 Data"
      />
      <ToolResultArea 
        value={output} 
        label="Parsed Data"
        language="json"
      />
    </div>
  );
}
