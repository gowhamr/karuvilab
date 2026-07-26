'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeftRight, Copy, Download, Code2, Table as TableIcon, AlertTriangle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { blobManager } from '@/src/lib/blob-manager';
import { useToast } from '@/components/ui/Toast';

type ConversionMode = 'csv-to-json' | 'json-to-csv';
type Delimiter = ',' | ';' | '\\t' | '|' | 'auto';

interface CSVParseOptions {
  delimiter: Delimiter;
  hasHeader: boolean;
  trimValues: boolean;
  skipEmptyRows: boolean;
  parseNumbers: boolean;
  parseBooleans: boolean;
}

interface ParseResult {
  data: Record<string, unknown>[];
  headers: string[];
  rowCount: number;
  colCount: number;
  errors: { row: number; message: string }[];
  preview: Record<string, unknown>[];
}

function detectDelimiter(csv: string): string {
  const firstLine = csv.split('\\n')[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\\t/g) || []).length;
  const pipeCount = (firstLine.match(/\\|/g) || []).length;
  
  const max = Math.max(commaCount, semiCount, tabCount, pipeCount);
  if (max === 0) return ',';
  if (max === commaCount) return ',';
  if (max === semiCount) return ';';
  if (max === tabCount) return '\\t';
  return '|';
}

function inferType(value: string, options: CSVParseOptions): unknown {
  if (options.trimValues) value = value.trim();
  if (value === '') return null;
  
  if (options.parseNumbers && !isNaN(Number(value))) {
    return Number(value);
  }
  
  if (options.parseBooleans) {
    const v = value.toLowerCase();
    if (v === 'true' || v === 'yes') return true;
    if (v === 'false' || v === 'no') return false;
  }
  
  return value;
}

function parseCSV(csv: string, options: CSVParseOptions): ParseResult {
  if (!csv.trim()) return { data: [], headers: [], rowCount: 0, colCount: 0, errors: [], preview: [] };

  const actualDelimiter = options.delimiter === 'auto' ? detectDelimiter(csv) : options.delimiter;
  const rows = csv.split('\\n');
  const result: Record<string, unknown>[] = [];
  const errors: { row: number; message: string }[] = [];
  
  let headers: string[] = [];
  let startIndex = 0;

  if (options.hasHeader && rows.length > 0) {
    headers = (rows[0] || '').split(actualDelimiter).map(h => options.trimValues ? h.trim() : h);
    startIndex = 1;
  }

  for (let i = startIndex; i < rows.length; i++) {
    const line = rows[i] || '';
    if (options.skipEmptyRows && !line.trim()) continue;
    
    const values = line.split(actualDelimiter);
    if (!options.hasHeader && headers.length === 0) {
      headers = values.map((_, idx) => `Column${idx + 1}`);
    }

    if (values.length !== headers.length) {
      errors.push({ row: i + 1, message: `Expected ${headers.length} columns, found ${values.length}` });
    }

    const obj: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      obj[header] = inferType(values[idx] || '', options);
    });
    result.push(obj);
  }

  return {
    data: result,
    headers,
    rowCount: result.length,
    colCount: headers.length,
    errors,
    preview: result.slice(0, 5)
  };
}

function jsonToCSV(jsonStr: string, options: CSVParseOptions): string {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) return 'Error: JSON must be an array of objects';
    if (data.length === 0) return '';

    const actualDelimiter = options.delimiter === 'auto' ? ',' : options.delimiter;
    const headers = Array.from(new Set(data.flatMap(Object.keys)));
    
    let csv = '';
    if (options.hasHeader) {
      csv += headers.join(actualDelimiter) + '\n';
    }

    data.forEach(row => {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(actualDelimiter) || str.includes('\n') || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      csv += values.join(actualDelimiter) + '\n';
    });

    return csv;
  } catch (err) {
    return `Error parsing JSON: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }
}

export default function CsvToJsonClient() {
  const { toast } = useToast();
  const [mode, setMode] = useState<ConversionMode>('csv-to-json');
  const [input, setInput] = useState<string>('');
  const [options, setOptions] = useState<CSVParseOptions>({
    delimiter: 'auto',
    hasHeader: true,
    trimValues: true,
    skipEmptyRows: true,
    parseNumbers: true,
    parseBooleans: true,
  });

  const parsedResult = useMemo(() => {
    if (mode === 'csv-to-json') {
      return parseCSV(input, options);
    }
    return null;
  }, [input, options, mode]);

  const output = useMemo(() => {
    if (mode === 'csv-to-json') {
      if (!parsedResult) return '';
      return JSON.stringify(parsedResult.data, null, 2);
    } else {
      if (!input.trim()) return '';
      return jsonToCSV(input, options);
    }
  }, [mode, input, options, parsedResult]);

  const handleDownload = () => {
    const blob = new Blob([output], { type: mode === 'csv-to-json' ? 'application/json' : 'text/csv' });
    const url = blobManager.create(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'csv-to-json' ? 'converted.json' : 'converted.csv';
    a.click();
    blobManager.revoke(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3">
            <ArrowLeftRight className="w-4 h-4" />
            CSV / JSON Converter
          </h2>
          
          <div className="flex bg-bg border border-border rounded-xl p-1">
            <button
              onClick={() => setMode('csv-to-json')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                mode === 'csv-to-json' ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text-3"
              )}
            >
              CSV to JSON
            </button>
            <button
              onClick={() => setMode('json-to-csv')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                mode === 'json-to-csv' ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text-3"
              )}
            >
              JSON to CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">
                Input {mode === 'csv-to-json' ? 'CSV' : 'JSON'}
              </label>
              <button 
                onClick={() => setInput('')}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => {
                if (e.target.value.length > 5 * 1024 * 1024) {
                  toast("Input text exceeds 5MB limit", "error");
                } else {
                  setInput(e.target.value);
                }
              }}
              placeholder={mode === 'csv-to-json' ? "id,name,age\\n1,John,30\\n2,Jane,25" : "[\\n  { \"id\": 1, \"name\": \"John\", \"age\": 30 }\\n]"}
              className="w-full h-96 bg-bg border border-border rounded-2xl p-4 font-mono text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted flex items-center gap-2">
                Output {mode === 'csv-to-json' ? 'JSON' : 'CSV'}
                {parsedResult && parsedResult.errors.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    {parsedResult.errors.length} Errors
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="p-1.5 text-text-muted hover:text-blue transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <CopyButton text={output} />
              </div>
            </div>
            <textarea
              readOnly
              value={output}
              className={cn(
                "w-full h-96 bg-mat-base border border-mat-border rounded-2xl p-4 font-mono text-sm outline-none resize-none",
                output.startsWith('Error:') ? "text-red-500" : "text-text-3"
              )}
            />
          </div>
        </div>

        {/* Options Panel */}
        <div className="bg-bg border border-border rounded-3xl p-6 space-y-6">
          <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Parsing Options</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-2">Delimiter</label>
              <select
                value={options.delimiter}
                onChange={(e) => setOptions({ ...options, delimiter: e.target.value as Delimiter })}
                className="w-full bg-surface border border-border rounded-xl p-2.5 text-sm font-medium text-text focus:ring-2 focus:ring-blue/20 outline-none"
              >
                <option value="auto">Auto-detect</option>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\\t">Tab (\\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <div className="space-y-3 flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.hasHeader}
                  onChange={(e) => setOptions({ ...options, hasHeader: e.target.checked })}
                  className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border"
                />
                <span className="text-sm font-medium text-text-2 group-hover:text-text">First row is header</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.skipEmptyRows}
                  onChange={(e) => setOptions({ ...options, skipEmptyRows: e.target.checked })}
                  className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border"
                />
                <span className="text-sm font-medium text-text-2 group-hover:text-text">Skip empty rows</span>
              </label>
            </div>

            <div className="space-y-3 flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.parseNumbers}
                  onChange={(e) => setOptions({ ...options, parseNumbers: e.target.checked })}
                  className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border"
                />
                <span className="text-sm font-medium text-text-2 group-hover:text-text">Parse numbers</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={options.parseBooleans}
                  onChange={(e) => setOptions({ ...options, parseBooleans: e.target.checked })}
                  className="w-4 h-4 rounded text-blue focus:ring-blue/20 border-border"
                />
                <span className="text-sm font-medium text-text-2 group-hover:text-text">Parse booleans</span>
              </label>
            </div>
          </div>
        </div>

        {/* Visual Preview (CSV to JSON only) */}
        {mode === 'csv-to-json' && parsedResult && parsedResult.data.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted flex items-center gap-2">
                <TableIcon className="w-3.5 h-3.5" />
                Data Preview (First 5 Rows)
              </h3>
              <span className="text-xs font-bold text-text-3">{parsedResult.rowCount} rows × {parsedResult.colCount} columns</span>
            </div>
            
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-bg/80 border-b border-border">
                    {parsedResult.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-tiny font-bold uppercase tracking-widest-sm text-text-muted border-r border-border last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedResult.preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
                      {parsedResult.headers.map((h, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 text-sm text-text-3 font-mono border-r border-border last:border-r-0">
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
