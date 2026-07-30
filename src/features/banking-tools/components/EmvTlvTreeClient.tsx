"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

interface TlvNode {
  tag: string;
  length: number;
  value: string;
  subTags?: TlvNode[];
}

function parseBerTlv(hex: string): TlvNode[] {
  const nodes: TlvNode[] = [];
  let index = 0;

  while (index < hex.length) {
    if (index + 2 > hex.length) break;
    
    // Tag parsing
    let tagStart = index;
    const firstByte = parseInt(hex.substring(index, index + 2), 16);
    if (isNaN(firstByte) || firstByte === 0) {
      index += 2;
      continue;
    }
    index += 2;

    let tagHex = hex.substring(tagStart, index);
    const isConstructed = (firstByte & 0x20) !== 0;

    // Multi-byte tag handling
    if ((firstByte & 0x1F) === 0x1F) {
      while (index + 2 <= hex.length) {
        const b = parseInt(hex.substring(index, index + 2), 16);
        index += 2;
        tagHex = hex.substring(tagStart, index);
        if ((b & 0x80) === 0) break;
      }
    }

    if (index + 2 > hex.length) break;

    // Length parsing
    let length = 0;
    const lenByte = parseInt(hex.substring(index, index + 2), 16);
    index += 2;

    if (lenByte < 0x80) {
      length = lenByte;
    } else {
      const numLengthBytes = lenByte & 0x7F;
      if (index + numLengthBytes * 2 > hex.length) break;
      const lenHex = hex.substring(index, index + numLengthBytes * 2);
      length = parseInt(lenHex, 16);
      index += numLengthBytes * 2;
    }

    const valueHexLen = length * 2;
    if (index + valueHexLen > hex.length) {
      const remainingVal = hex.substring(index);
      nodes.push({ tag: tagHex, length, value: remainingVal });
      break;
    }

    const valHex = hex.substring(index, index + valueHexLen);
    index += valueHexLen;

    const node: TlvNode = {
      tag: tagHex,
      length,
      value: valHex,
    };

    if (isConstructed && valHex.length > 0) {
      const children = parseBerTlv(valHex);
      if (children.length > 0) {
        node.subTags = children;
      }
    }

    nodes.push(node);
  }

  return nodes;
}

export default function EmvTlvTreeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const parseTlv = (hexData: string) => {
    try {
      if (!hexData.trim()) return '';
      if (hexData.length > 100 * 1024) return 'Error: Input is too large. Max size is 100KB.';
      const hex = hexData.replace(/[\s\r\n]/g, '').toUpperCase();
      if (!/^[0-9A-F]+$/.test(hex)) return 'Invalid hex string';
      
      const parsedTree = parseBerTlv(hex);
      if (parsedTree.length === 0) return 'No valid TLV tags found.';
      
      return JSON.stringify(parsedTree, null, 2);
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
