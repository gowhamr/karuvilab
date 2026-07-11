"use client";

import React, { useState } from 'react';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';

export const MT_TAG_DICTIONARY: Record<string, string> = {
  "20": "Transaction Reference Number",
  "21": "Related Reference",
  "25": "Account Identification",
  "30": "Value Date",
  "32A": "Value Date, Currency Code, Amount",
  "50A": "Ordering Customer (Option A)",
  "50K": "Ordering Customer (Option K)",
  "59": "Beneficiary Customer",
  "70": "Details of Payment (Remittance Info)",
  "71A": "Details of Charges",
  "72": "Sender to Receiver Information"
};

interface SwiftParsedBlock {
  name: string;
  id: string;
  raw: string;
  parsedFields?: Record<string, string>;
}

export function parseSwiftMT(message: string): any {
  const blocks: SwiftParsedBlock[] = [];
  
  // Extract block 1
  const b1Match = message.match(/\{1:([^}]+)\}/);
  if (b1Match) {
    const val = b1Match[1] || "";
    blocks.push({
      id: "1",
      name: "Basic Header Block",
      raw: val,
      parsedFields: {
        "Application ID": val.substring(0, 1),
        "Service ID": val.substring(1, 3),
        "LT Address": val.substring(3, 15),
        "Session Number": val.substring(15, 19),
        "Sequence Number": val.substring(19, 25)
      }
    });
  }

  // Extract block 2
  const b2Match = message.match(/\{2:([^}]+)\}/);
  if (b2Match) {
    const val = b2Match[1] || "";
    const isInput = val.startsWith("I");
    const parsedFields: Record<string, string> = {
      "Direction": isInput ? "Input (Sent)" : "Output (Received)",
      "Message Type": val.substring(1, 4),
    };
    if (isInput) {
      parsedFields["Destination LT Address"] = val.substring(4, 16);
      parsedFields["Message Priority"] = val.substring(16, 17);
    } else {
      parsedFields["Input Time"] = val.substring(4, 14);
      parsedFields["Message Date"] = val.substring(14, 20);
    }
    blocks.push({
      id: "2",
      name: "Application Header Block",
      raw: val,
      parsedFields
    });
  }

  // Extract block 3
  const b3Match = message.match(/\{3:([^}]+)\}/);
  if (b3Match) {
    const val = b3Match[1] || "";
    const parsedFields: Record<string, string> = {};
    // Match subfields like {108:xxx}
    const tagMatches = val.matchAll(/\{(\d+):([^}]+)\}/g);
    for (const tm of tagMatches) {
      const tag = tm[1] || "";
      const tagVal = tm[2] || "";
      if (tag === "108") parsedFields["Message User Reference (MUR)"] = tagVal;
      else if (tag === "121") parsedFields["End-to-End Transaction ID (UETR)"] = tagVal;
      else parsedFields[`Tag ${tag}`] = tagVal;
    }
    blocks.push({
      id: "3",
      name: "User Header Block",
      raw: val,
      parsedFields
    });
  }

  // Extract block 4
  const b4Match = message.match(/\{4:([\s\S]+?)\s*-\}/);
  if (b4Match) {
    const val = b4Match[1] || "";
    const parsedFields: Record<string, string> = {};
    
    // Parse tag/value lines: e.g. :20:REF123
    const lines = val.split(/\r?\n/);
    let currentTag = "";
    let currentVal = "";
    
    const appendCurrent = () => {
      if (currentTag) {
        const tagName = MT_TAG_DICTIONARY[currentTag] || `Field ${currentTag}`;
        if (currentTag === "32A" && currentVal.length >= 10) {
          const dateStr = currentVal.substring(0, 6);
          const curStr = currentVal.substring(6, 9);
          const amtStr = currentVal.substring(9).replace(/,/g, ".");
          parsedFields[tagName] = `Date: 20${dateStr.substring(0, 2)}-${dateStr.substring(2, 4)}-${dateStr.substring(4)}, Currency: ${curStr}, Amount: ${parseFloat(amtStr).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        } else {
          parsedFields[tagName] = currentVal.trim();
        }
      }
    };

    for (const line of lines) {
      const lineMatch = line.match(/^:([0-9A-Z]{2,3}):(.*)$/);
      if (lineMatch) {
        appendCurrent();
        currentTag = lineMatch[1] || "";
        currentVal = lineMatch[2] || "";
      } else {
        currentVal += (currentVal ? "\n" : "") + line;
      }
    }
    appendCurrent();

    blocks.push({
      id: "4",
      name: "Text Block (Data)",
      raw: val,
      parsedFields
    });
  }

  // Extract block 5
  const b5Match = message.match(/\{5:([^}]+)\}/);
  if (b5Match) {
    const val = b5Match[1] || "";
    const parsedFields: Record<string, string> = {};
    const tagMatches = val.matchAll(/\{([A-Z0-9]+):([^}]+)\}/g);
    for (const tm of tagMatches) {
      parsedFields[tm[1] || ""] = tm[2] || "";
    }
    blocks.push({
      id: "5",
      name: "Trailer Block",
      raw: val,
      parsedFields
    });
  }

  return {
    format: "MT (FIN)",
    blocks
  };
}

export function parseSwiftMX(xmlStr: string): any {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, "application/xml");
  const parseError = doc.getElementsByTagName("parsererror");
  if (parseError.length > 0) {
    throw new Error("Invalid XML syntax");
  }

  const rootElement = doc.documentElement;
  const msgType = rootElement.nodeName;

  const getElementText = (tagName: string): string => {
    const el = doc.getElementsByTagName(tagName)[0];
    return el ? el.textContent || "" : "";
  };

  const parsedFields: Record<string, string> = {
    "Message Type (Root)": msgType,
    "Message Identification": getElementText("MsgId") || getElementText("Id"),
    "Creation Date Time": getElementText("CreDtTm"),
    "Initiating Party": getElementText("InitgPty") || getElementText("Nm"),
    "Debtor Name": doc.getElementsByTagName("Dbtr")[0]?.getElementsByTagName("Nm")[0]?.textContent || "",
    "Creditor Name": doc.getElementsByTagName("Cdtr")[0]?.getElementsByTagName("Nm")[0]?.textContent || "",
    "Settlement Amount": getElementText("IntrBkSttlmAmt") || getElementText("Amt"),
    "Settlement Currency": doc.getElementsByTagName("IntrBkSttlmAmt")[0]?.getAttribute("Ccy") || doc.getElementsByTagName("Amt")[0]?.getAttribute("Ccy") || "",
  };

  const filtered: Record<string, string> = {};
  for (const k of Object.keys(parsedFields)) {
    if (parsedFields[k]) filtered[k] = parsedFields[k]!;
  }

  return {
    format: "MX (ISO 20022)",
    root: msgType,
    parsedFields: filtered
  };
}

export default function SwiftMtMxClient() {
  const [input, setInput] = useState('{1:F01BANKBEBBAXXX2222123456}{2:I100BANKBEBBXXXXN}{4:\n:20:REF123456\n:32A:260711USD15000,00\n:50K:JOHN DOE\n:59:JANE DOE\n-}');
  const [output, setOutput] = useState('');
  
  const parseSwift = (data: string) => {
    try {
      if (!data.trim()) return '';
      const isXml = data.trim().startsWith('<');
      const parsed = isXml ? parseSwiftMX(data) : parseSwiftMT(data);
      return JSON.stringify(parsed, null, 2);
    } catch (err: any) {
      return `Failed to parse SWIFT message: ${err.message}`;
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
