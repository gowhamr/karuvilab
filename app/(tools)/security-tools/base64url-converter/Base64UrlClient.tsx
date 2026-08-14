"use client";

import { useState, useEffect } from "react";
import { base64UrlEncode, base64UrlDecode } from "@/src/lib/security/tokens";
import { ArrowRightLeft } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

export default function Base64UrlClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setError(undefined);
    if (!input) {
      setResult("");
      return;
    }

    const timer = setTimeout(() => {
      try {
        if (mode === 'encode') {
          const out = base64UrlEncode(input);
          setResult(out);
        } else {
          const out = base64UrlDecode(input);
          setResult(out);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Base64URL conversion failed');
        setResult("");
      }
    }, 150);
    
    return () => clearTimeout(timer);
  }, [mode, input]);

  return (
    <ToolWorkspace
      layout="split"
      tabs={{
        options: [
          { id: 'encode', label: 'Encode to Base64URL', icon: <ArrowRightLeft size={16} /> },
          { id: 'decode', label: 'Decode Base64URL', icon: <ArrowRightLeft size={16} className="rotate-180" /> }
        ],
        activeId: mode,
        onChange: (id) => {
           setMode(id as 'encode' | 'decode');
           setInput("");
           setResult("");
        }
      }}
      input={
        <div className="flex flex-col h-full space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-text-2">
              {mode === 'encode' ? 'Plaintext / UTF-8 Input' : 'Base64URL Encoded String'}
            </span>
            <button 
              onClick={() => setInput('')}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
          <ToolInput
            value={input}
            onChange={setInput}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64URL string (e.g. eyJhbGciOiJSUzI1Ni...)'}
            mono
            className="flex-1 min-h-52 resize-none"
          />
        </div>
      }
      output={
        <ToolResultArea
          label="Result Output"
          value={result}
          error={error}
          downloadFilename={`base64url-result-${Date.now()}.txt`}
          contentClassName="min-h-52 text-emerald-300"
        />
      }
    />
  );
}
