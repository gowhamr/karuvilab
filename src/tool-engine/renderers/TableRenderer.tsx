// src/tool-engine/renderers/TableRenderer.tsx
"use client";

import React from "react";
import type { ToolResult } from "../types/ToolResult";

export default function TableRenderer({ result }: { result: ToolResult }) {
  const rows = result.rows || [];

  if (rows.length === 0) {
    return <div className="p-8 text-center text-text-4">No data to display.</div>;
  }

  const headers = Object.keys(rows[0] as any);

  return (
    <div className="bg-mat-surface border border-mat-border shadow-mat-shine rounded-4xl overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar max-h-full">
        <table className="w-full text-left border-collapse">
          <thead className="bg-mat-base/50 sticky top-0 z-10">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4 text-tiny font-bold uppercase tracking-widest-sm text-text-3 border-b border-mat-border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-mat-border">
            {rows.map((row: any, i) => (
              <tr key={i} className="hover:bg-mat-hover/50 transition-colors">
                {headers.map((h, j) => (
                  <td key={j} className="px-6 py-4 text-sm text-text-2 font-medium">
                    {String(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
