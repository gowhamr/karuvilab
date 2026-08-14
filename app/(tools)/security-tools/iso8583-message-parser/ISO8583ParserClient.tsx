"use client";

import { useState, useCallback, useMemo } from "react";
import { Eye, AlertCircle, CheckCircle2, Search, Sparkles, Layers, Info, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { parseIso8583, ParsedISOField, decodeMTI, MTIDecoded } from "@/src/lib/iso8583/parser";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";

export const SAMPLE_MESSAGES = [
  {
    label: "0200 Financial Purchase Request",
    value: "020072246401088000001641111111111111110000000000100000070512000012345612120026060000510612345612345678901212345678"
  },
  {
    label: "0210 Financial Response (Approved 00)",
    value: "02107224640108800000164111111111111111000000000010000007051200001234561212000012345600"
  },
  {
    label: "0210 Financial Response (Declined 51)",
    value: "02107224640108800000164111111111111111000000000010000007051200001234561212005112345651"
  },
  {
    label: "0800 Network Sign-On Request",
    value: "080082200000000000000705120000123456301"
  }
];

export default function ISO8583ParserClient() {
  const [msgInput, setMsgInput] = useState(SAMPLE_MESSAGES[0]!.value);
  const [mti, setMti] = useState("");
  const [mtiDecoded, setMtiDecoded] = useState<MTIDecoded | null>(null);
  const [bitmapHex, setBitmapHex] = useState("");
  const [fields, setFields] = useState<ParsedISOField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleParse = useCallback(() => {
    setError(null);
    setFields([]);
    setMti("");
    setMtiDecoded(null);
    setBitmapHex("");

    try {
      const parsed = parseIso8583(msgInput);
      setMti(parsed.mti);
      setMtiDecoded(decodeMTI(parsed.mti));
      setBitmapHex(parsed.bitmapHex);
      setFields(parsed.fields);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse ISO 8583 message payload");
    }
  }, [msgInput]);

  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return fields;
    const q = searchQuery.toLowerCase();
    return fields.filter(
      f => f.field.toString().includes(q) || f.name.toLowerCase().includes(q) || f.value.toLowerCase().includes(q)
    );
  }, [fields, searchQuery]);

  return (
    <ToolWorkspace
      input={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="iso-parser-input" className="text-sm font-bold text-text-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue" />
              ISO 8583 Raw Message Payload
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-4">Load Sample:</span>
              <select
                aria-label="Select Sample ISO 8583 Payload"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    setMsgInput(val);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-bg border border-border text-xs font-medium text-text-2 focus:outline-none focus:ring-2 focus:ring-blue"
              >
                {SAMPLE_MESSAGES.map((s, idx) => (
                  <option key={idx} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ToolInput
            id="iso-parser-input"
            rows={4}
            value={msgInput}
            onChange={(val) => setMsgInput(val)}
            placeholder="Paste ISO 8583 hex/ASCII payload, e.g. 02007224640108800000..."
            mono
          />

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMsgInput("")}
              className="px-4 py-2 rounded-xl border border-border bg-bg text-text-4 hover:text-text-2 hover:bg-surface text-sm font-bold transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear Input
            </button>
            
            <button
              id="iso-parser-submit-btn"
              onClick={handleParse}
              className="px-6 py-2 rounded-xl bg-blue text-white font-bold text-sm flex items-center gap-2 hover:bg-blue/90 transition shadow-sm"
            >
              <Eye className="w-4 h-4" />
              Parse Message
            </button>
          </div>
        </div>
      }
      output={
        <div className="space-y-6 flex flex-col h-full">
          {error && (
            <div className="p-4 rounded-xl bg-error/5 border border-error/20 text-error text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!mti && !error && (
            <div className="flex items-center justify-center flex-1 text-text-4 italic text-sm py-12">
              Parsed results will appear here...
            </div>
          )}

          {mti && mtiDecoded && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* MTI Breakdown Header */}
              <div className="p-5 rounded-2xl bg-bg border border-border space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider pb-3">
                  <h3 className="font-bold text-base text-text-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Message Type Identifier (MTI): <span className="font-mono text-green-500 font-black">{mti}</span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold border border-blue/20">
                    {mtiDecoded.fullDesc}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                    <span className="text-text-4 font-semibold block text-[11px] uppercase tracking-wider">ISO Version</span>
                    <span className="font-bold text-text-2">{mtiDecoded.version}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                    <span className="text-text-4 font-semibold block text-[11px] uppercase tracking-wider">Message Class</span>
                    <span className="font-bold text-text-2">{mtiDecoded.class}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                    <span className="text-text-4 font-semibold block text-[11px] uppercase tracking-wider">Message Function</span>
                    <span className="font-bold text-text-2">{mtiDecoded.function}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                    <span className="text-text-4 font-semibold block text-[11px] uppercase tracking-wider">Message Originator</span>
                    <span className="font-bold text-text-2">{mtiDecoded.originator}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs font-mono">
                  <span className="text-text-4">Bitmap (Hex):</span>
                  <span className="text-blue font-bold break-all">{bitmapHex} ({bitmapHex.length * 4}-bit)</span>
                </div>
              </div>

              {/* Parsed Data Elements List */}
              {fields.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-text-2">Parsed Data Elements</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-mono font-bold">
                        {fields.length} Present
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-text-4 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search fields or values..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-bg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-blue text-text-2 w-48 placeholder:text-text-4/60"
                        />
                      </div>
                      <CopyButton text={JSON.stringify(fields, null, 2)} aria-label="Copy JSON" />
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredFields.map((f) => (
                      <div
                        key={f.field}
                        className="p-4 rounded-xl bg-bg border border-border space-y-2 hover:border-blue/40 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="w-7 h-7 rounded-lg bg-blue/10 border border-blue/20 text-blue font-mono font-black text-xs flex items-center justify-center shrink-0">
                              {f.field}
                            </span>
                            <span className="font-bold text-sm text-text-2">{f.name}</span>
                            {f.type && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-4">
                                {f.type}
                              </span>
                            )}
                          </div>
                          <CopyButton text={f.value} />
                        </div>

                        <div className="p-2.5 rounded-lg bg-surface border border-divider font-mono text-xs text-green-500 font-bold break-all">
                          {f.value}
                        </div>

                        {f.decodedInfo && (
                          <div className="text-xs text-blue font-semibold flex items-center gap-1.5 pt-0.5">
                            <Sparkles className="w-3.5 h-3.5 shrink-0" />
                            <span>{f.decodedInfo}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {filteredFields.length === 0 && (
                      <div className="p-8 text-center text-text-4 text-sm border border-dashed border-border rounded-xl">
                        No fields match your search query "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
      infoPanel={
        <div className="p-5 rounded-3xl bg-surface border border-border space-y-4">
          <h4 className="font-bold text-sm text-text-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue" />
            ISO 8583 Message Architecture Quick Reference
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-4 leading-relaxed">
            <div className="space-y-1.5">
              <span className="font-bold text-text-2 block text-sm">1. MTI (4 Digits)</span>
              <p>Specifies ISO version, message class (auth, financial, network), function (request/response), and originator (acquirer/issuer).</p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-text-2 block text-sm">2. Primary Bitmap (64-bit)</span>
              <p>16 Hex characters indicating which data fields 1–64 are present. Bit 1 indicates if a secondary bitmap follows.</p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-text-2 block text-sm">3. Data Elements</span>
              <p>Field payloads serialized sequentially as FIXED length, LLVAR (2-digit length prefix), or LLLVAR (3-digit length prefix).</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
