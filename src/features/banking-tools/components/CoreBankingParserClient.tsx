"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { parseIso8583 } from '@/src/lib/iso8583/parser';

export default function CoreBankingParserClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseCoreBankingLog = (data: string) => {
    try {
      if (!data.trim()) return '';
      
      const trimmed = data.trim();
      
      // XML Validation
      if (trimmed.startsWith('<')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(trimmed, "application/xml");
        const parseError = doc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
          return JSON.stringify({
            status: "Error",
            message: "Invalid XML",
            details: parseError[0]?.textContent || "Syntax error"
          }, null, 2);
        }
        
        return JSON.stringify({
          status: "Success",
          type: "XML Document",
          rootElement: doc.documentElement.nodeName,
          message: "Valid XML mapped successfully."
        }, null, 2);
      }
      
      // ISO 8583 Parsing
      try {
        const isoParsed = parseIso8583(trimmed);
        return JSON.stringify({
          status: "Success",
          type: "ISO 8583",
          data: isoParsed
        }, null, 2);
      } catch (isoErr: any) {
        return JSON.stringify({
          status: "Error",
          message: "Failed to parse as ISO 8583",
          details: isoErr.message || String(isoErr)
        }, null, 2);
      }
      
    } catch (err: any) {
      return JSON.stringify({ status: 'Error', message: err.message }, null, 2);
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
