"use client";

import { useState, useCallback } from "react";
import { base64UrlEncode, base64UrlDecode } from "@/src/lib/security/tokens";
import { CopyButton } from "@/components/ui/CopyButton";
import { ArrowRightLeft, ShieldCheck, AlertCircle } from "lucide-react";

export default function Base64UrlClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    if (!input) {
      setResult("");
      return;
    }

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
    }
  }, [mode, input]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-surface-2 rounded-xl border border-border w-fit">
        <button
          id="b64url-tab-encode"
          onClick={() => { setMode('encode'); setError(null); setResult(""); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            mode === 'encode' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Encode to Base64URL
        </button>
        <button
          id="b64url-tab-decode"
          onClick={() => { setMode('decode'); setError(null); setResult(""); }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            mode === 'decode' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 rotate-180" />
          Decode Base64URL
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">
          {mode === 'encode' ? 'Plaintext / UTF-8 Input:' : 'Base64URL Encoded String:'}
        </label>
        <textarea
          id="b64url-input-text"
          rows={5}
          placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64URL string (e.g. eyJhbGciOiJSUzI1Ni...)'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs focus:outline-none"
        />
      </div>

      <button
        id="b64url-submit-btn"
        onClick={handleConvert}
        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        <ArrowRightLeft className="w-5 h-5" />
        {mode === 'encode' ? 'Encode to Base64URL' : 'Decode Base64URL'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Result Output:
            </label>
            <CopyButton text={result} />
          </div>
          <textarea
            id="b64url-result-output"
            readOnly
            rows={5}
            value={result}
            className="w-full p-4 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
