"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

export default function SwiftMtMxClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseSwift = (data: string) => {
    try {
      if (!data.trim()) return '';
      // Mock parser for SWIFT MT/MX
      // Real implementation would parse blocks {1:...}{2:...}{3:...}{4:...}
      const isXml = data.trim().startsWith('<');
      const type = isXml ? 'MX (ISO 20022)' : 'MT (FIN)';
      
      const parsed = {
        messageType: type,
        rawLength: data.length,
        status: "Parsed Successfully (Mock Data)",
        blocks: [
          { name: "Basic Header Block", content: "{1:F01BANKBEBBAXXX2222123456}" },
          { name: "Text Block", content: "..." }
        ]
      };
      
      return JSON.stringify(parsed, null, 2);
    } catch {
      return 'Failed to parse SWIFT message';
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    setOutput(parseSwift(val));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ToolInput 
        value={input} 
        onChange={handleInput} 
        placeholder="Paste SWIFT MT (e.g. {1:F01...}) or MX (XML) message here" 
        label="SWIFT Message"
      />
      <ToolResultArea 
        value={output} 
        label="Parsed Message"
        language="json"
      />
    </div>
  );
}
