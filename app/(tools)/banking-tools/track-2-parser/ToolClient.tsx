"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

export default function ToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseTrack2 = (data: string) => {
    try {
      if (!data.trim()) return '';
      // Simple parse logic for [PAN]=[YYMM][ServiceCode][DiscretionaryData]
      let pan = '', separator = '', yymm = '', serviceCode = '', discretionary = '';
      
      const hasStartSentinel = data.startsWith(';') || data.startsWith('%') || data.startsWith('B');
      const endSentinelIdx = data.indexOf('?');
      const endSentinelFIdx = data.toUpperCase().indexOf('F');
      
      // Calculate LRC if we have sentinels
      let expectedLrc = null;
      let actualLrc = null;
      let lrcValid = null;
      
      const coreData = data;
      
      if (endSentinelIdx !== -1 && endSentinelIdx + 1 < data.length) {
        actualLrc = data.charAt(endSentinelIdx + 1);
        const lrcData = data.substring(0, endSentinelIdx + 1);
        
        let xor = 0;
        for (let i = 0; i < lrcData.length; i++) {
          xor ^= lrcData.charCodeAt(i);
        }
        
        // Track 2 uses 5-bit encoding for LRC (parity bit), but since this is usually ASCII, we do parity logic or simple XOR.
        // Actually, simple ASCII XOR is common for basic representation, or standard ISO 7813 LRC.
        // ISO 7813 Track 2 uses characters 0-9, :, ;, <, =, >, ? where value is charCode - 48 (0x30).
        // Let's implement standard Track 2 XOR:
        let isoXor = 0;
        for (let i = 0; i < lrcData.length; i++) {
          isoXor ^= (lrcData.charCodeAt(i) & 0x0F);
        }
        // Parity bit is often ignored in simple string representations.
        expectedLrc = String.fromCharCode((isoXor & 0x0F) | 0x30);
        
        if (actualLrc) {
          lrcValid = expectedLrc === actualLrc;
        }
      }

      const normalized = data.replace(/;/g, '').replace(/%/g, '').replace(/\?/g, '').replace(/.$/, (match, offset, str) => {
         // If there was an end sentinel, the last char was probably LRC. We strip it for core parsing if we have an end sentinel.
         if (endSentinelIdx !== -1) return ''; 
         return match;
      });
      // Strip trailing F which some systems use as end sentinel
      const stripped = normalized.replace(/F.+$/i, '').replace(/F$/i, '');
      
      const match = stripped.match(/^(\d{1,19})([=D])(\d{4})(\d{3})(.*)$/i);
      
      if (match) {
        pan = match[1] || '';
        separator = match[2] || '';
        yymm = match[3] || '';
        serviceCode = match[4] || '';
        discretionary = match[5] || '';
        
        // Best effort discretionary splitting (Visa/MC standard)
        let discParsed: any = discretionary;
        if (discretionary.length >= 8) {
           discParsed = {
             Raw: discretionary,
             PINVerificationKeyIndicator: discretionary.substring(0, 1),
             PINVerificationValue: discretionary.substring(1, 5),
             CardVerificationValue: discretionary.substring(5, 8),
             IssuerSpecific: discretionary.substring(8)
           };
        }
        
        const result: any = {
          PAN: pan,
          Separator: separator,
          ExpirationDate: `20${yymm.substring(0, 2)}-${yymm.substring(2, 4)}`,
          ServiceCode: serviceCode,
          DiscretionaryData: discParsed,
        };

        if (actualLrc) {
          result.LRC = {
            Provided: actualLrc,
            Calculated: expectedLrc,
            IsValid: lrcValid
          };
        }
        
        return JSON.stringify(result, null, 2);
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
