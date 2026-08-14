"use client";

import { useState, useCallback } from "react";
import { parsePemBlocks, parseASN1, bytesToHex, PemBlock, ASN1Node } from "@/src/lib/security/asn1";
import { CopyButton } from "@/components/ui/CopyButton";
import { FileCode, ShieldCheck, Layers, Eye } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";

export default function PemViewerClient() {
  const [pemInput, setPemInput] = useState("");
  const [blocks, setBlocks] = useState<PemBlock[]>([]);
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number>(0);
  const [asnTree, setAsnTree] = useState<ASN1Node | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = useCallback(() => {
    setError(null);
    try {
      const res = parsePemBlocks(pemInput);
      setBlocks(res);
      if (res.length > 0) {
        setSelectedBlockIdx(0);
        try {
          const tree = parseASN1(res[0]!.bytes);
          setAsnTree(tree);
        } catch {
          setAsnTree(null);
        }
      } else {
        setAsnTree(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PEM input');
    }
  }, [pemInput]);

  const selectBlock = (idx: number) => {
    setSelectedBlockIdx(idx);
    if (blocks[idx]) {
      try {
        const tree = parseASN1(blocks[idx]!.bytes);
        setAsnTree(tree);
      } catch {
        setAsnTree(null);
      }
    }
  };

  return (
    <ToolWorkspace
      input={
        <div className="space-y-4">
          <ToolInput
            label="Paste PEM Container Content"
            placeholder="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n-----BEGIN RSA PRIVATE KEY-----\n..."
            value={pemInput}
            onChange={setPemInput}
            rows={8}
            mono
          />
          <button
            id="pem-parse-btn"
            onClick={handleParse}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Eye className="w-5 h-5" />
            Inspect PEM Blocks & ASN.1
          </button>
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      }
      output={
        blocks.length > 0 ? (
          <div className="space-y-4 h-full flex flex-col">
            {/* Block Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
              {blocks.map((b, idx) => (
                <button
                  key={idx}
                  id={`pem-block-tab-${idx}`}
                  onClick={() => selectBlock(idx)}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 border whitespace-nowrap transition ${
                    selectedBlockIdx === idx
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-2 border-border text-text-muted hover:text-text'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  {b.type} ({b.bytes.length} bytes)
                </button>
              ))}
            </div>

            {/* Selected Block Info */}
            {blocks[selectedBlockIdx] && (
              <div className="p-4 rounded-xl bg-surface-2 border border-border flex flex-col gap-4 flex-1 overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                  <h4 className="font-bold text-sm text-sky-400">
                    Block Type: {blocks[selectedBlockIdx]!.type}
                  </h4>
                  <CopyButton text={blocks[selectedBlockIdx]!.b64} />
                </div>

                <div className="space-y-1 shrink-0">
                  <label className="text-xs font-semibold text-text-muted">Hex Dump (DER):</label>
                  <div className="p-3 rounded-lg bg-surface border border-border font-mono text-xs text-emerald-300 break-all max-h-40 overflow-y-auto">
                    {bytesToHex(blocks[selectedBlockIdx]!.bytes, " ")}
                  </div>
                </div>

                {asnTree && (
                  <div className="space-y-1 flex-1 flex flex-col min-h-0">
                    <label className="text-xs font-semibold text-text-muted shrink-0">ASN.1 Structure Tree:</label>
                    <div className="p-3 rounded-lg bg-surface border border-border font-mono text-xs text-sky-200 overflow-y-auto flex-1">
                      <ASN1TreeView node={asnTree} depth={0} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted text-sm italic min-h-[200px]">
            Parse a PEM container to view its structure
          </div>
        )
      }
    />
  );
}

function ASN1TreeView({ node, depth }: { node: ASN1Node; depth: number }) {
  return (
    <div className="ml-3 my-0.5 border-l border-border/50 pl-2">
      <span className="text-text-muted">[{node.typeHex}]</span>{" "}
      <span className="text-amber-300">
        {node.isConstructed ? "CONSTRUCTED" : "PRIMITIVE"}
      </span>{" "}
      <span className="text-text font-bold">Tag {node.tag}</span>{" "}
      <span className="text-text-muted">({node.length} B)</span>
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map((c, i) => (
            <ASN1TreeView key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
