import * as Comlink from "comlink";
import { EmiInputs, EmiResult, DiffLine } from "./types";

// Compute functions only
const api = {
  async minifyCode(code: string, lang: "css" | "js" | "html", onProgress: any) {
    if (lang === 'js') {
      try {
        const { minify } = await import("terser");
        const result = await minify(code, { compress: true, mangle: true, module: true });
        return { code: result.code || code, error: null };
      } catch (err: any) {
        return { 
          code, 
          error: { 
            type: 'premium_engine_unavailable', 
            message: 'Premium JS minification engine (Terser) is currently unavailable.' 
          } 
        };
      }
    }
    let minified = code;
    if (lang === "css") minified = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,>~+])\s*/g, "$1").replace(/;\s*}/g, "}").replace(/\s+/g, " ").trim();
    if (lang === "html") minified = code.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
    
    return { code: minified, error: null };
  },

  async computeDiff(textA: string, textB: string, ignoreWs: boolean = false, onProgress?: any) {
    const normalize = (s: string) => ignoreWs ? s.trim() : s;
    const linesA = textA.split(/\r?\n/);
    const linesB = textB.split(/\r?\n/);
    const m = linesA.length;
    const n = linesB.length;
    if (m * n > 10000000) {
      const result: DiffLine[] = [];
      linesA.forEach((l, i) => result.push({ type: 'removed', text: l, lineA: i + 1 }));
      linesB.forEach((l, i) => result.push({ type: 'added', text: l, lineB: i + 1 }));
      return result;
    }
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        dp[i]![j] = normalize(linesA[i]!) === normalize(linesB[j]!)
          ? dp[i + 1]![j + 1]! + 1
          : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
      }
    }

    const result: DiffLine[] = [];
    let i = 0, j = 0, lineA = 1, lineB = 1;
    while (i < m && j < n) {
      if (normalize(linesA[i]!) === normalize(linesB[j]!)) {
        result.push({ type: "equal", text: linesA[i]!, lineA: lineA++, lineB: lineB++ });
        i++; j++;
      } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
        result.push({ type: "removed", text: linesA[i]!, lineA: lineA++ });
        i++;
      } else {
        result.push({ type: "added", text: linesB[j]!, lineB: lineB++ });
        j++;
      }
    }
    while (i < m) { result.push({ type: "removed", text: linesA[i++]!, lineA: lineA++ }); }
    while (j < n) { result.push({ type: "added", text: linesB[j++]!, lineB: lineB++ }); }
    return result;
  },

  async createZip(files: any, onProgress: any): Promise<Uint8Array> {
    const fflate = await import("fflate");
    return new Promise((resolve, reject) => {
      fflate.zip(files, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },

  

  async processYaml(input: string, action: 'validate' | 'json_to_yaml' | 'yaml_to_json') {
    const YAML = await import("yaml");
    try {
      if (action === 'validate') {
        YAML.parse(input);
        return { result: 'Valid YAML' };
      }
      if (action === 'yaml_to_json') {
        const doc = YAML.parse(input);
        return { result: JSON.stringify(doc, null, 2) };
      }
      if (action === 'json_to_yaml') {
        const doc = JSON.parse(input);
        return { result: YAML.stringify(doc) };
      }
      return { error: 'Invalid action' };
    } catch (e: any) {
      return { error: e.message || 'An unknown error occurred' };
    }
  },

  async processJson(input: string, mode: "beautify" | "minify", indent: number | "tab") {
    try {
      const obj = JSON.parse(input);
      let out = "";
      if (mode === "minify") {
        out = JSON.stringify(obj);
      } else {
        const spaces = indent === "tab" ? "\t" : indent;
        out = JSON.stringify(obj, null, spaces);
      }
      return { output: out, parsed: obj, error: null };
    } catch (e: any) {
      return { output: "", parsed: null, error: { message: e.message } };
    }
  },

  async processCsv(input: string, action: 'csv_to_json' | 'json_to_csv', options: any) {
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

    function inferType(value: string, opts: any): unknown {
      if (opts.trimValues) value = value.trim();
      if (value === '') return null;
      if (opts.parseNumbers && !isNaN(Number(value))) return Number(value);
      if (opts.parseBooleans) {
        const v = value.toLowerCase();
        if (v === 'true' || v === 'yes') return true;
        if (v === 'false' || v === 'no') return false;
      }
      return value;
    }

    if (action === 'csv_to_json') {
      if (!input.trim()) return { data: [], headers: [], rowCount: 0, colCount: 0, errors: [], preview: [] };
      const actualDelimiter = options.delimiter === 'auto' ? detectDelimiter(input) : options.delimiter;
      const rows = input.split('\\n');
      const result: Record<string, unknown>[] = [];
      const errors: { row: number; message: string }[] = [];
      let headers: string[] = [];
      let startIndex = 0;

      if (options.hasHeader && rows.length > 0) {
        headers = (rows[0] || '').split(actualDelimiter).map((h: string) => options.trimValues ? h.trim() : h);
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
      return { data: result, headers, rowCount: result.length, colCount: headers.length, errors, preview: result.slice(0, 5) };
    } else {
      try {
        const data = JSON.parse(input);
        if (!Array.isArray(data)) return 'Error: JSON must be an array of objects';
        if (data.length === 0) return '';
        const actualDelimiter = options.delimiter === 'auto' ? ',' : options.delimiter;
        const headers = Array.from(new Set(data.flatMap(Object.keys)));
        let csv = '';
        if (options.hasHeader) {
          csv += headers.join(actualDelimiter) + '\\n';
        }
        data.forEach(row => {
          const values = headers.map(h => {
            const val = row[h];
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(actualDelimiter) || str.includes('\\n') || str.includes('"')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          });
          csv += values.join(actualDelimiter) + '\\n';
        });
        return csv;
      } catch (err: any) {
        return `Error parsing JSON: ${err.message || 'Unknown error'}`;
      }
    }
  },

  async evaluateMath(expr: string) {
     
    const factorial = (n: number): number => {
      if (n < 0 || n > 170) return NaN;
      if (n === 0) return 1;
      let res = 1;
      for (let i = 2; i <= Math.floor(n); i++) res *= i;
      return res;
    };

    if (!/^(?:[0-9+\-*/.%() \t]|Math\.[a-z0-9]+|\*\*|factorial)+$/i.test(expr)) {
      throw new Error("Invalid characters in expression");
    }
    
    // Using new Function as a slightly safer eval alternative for trusted math expressions
    const result = new Function(`return ${expr}`)();
    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error("Result is not a finite number");
    }
    return result;
  },

  async calculateEmiSchedule(inputs: EmiInputs): Promise<EmiResult> {
    const { generateSchedule } = await import("../lib/emi-calculations");
    return generateSchedule(inputs);
  },

  async convertNumeral(input: string, inputFormat: string, targetFormat: string, extraOptions?: any) {
    const { decodeToBytes, encodeFromBytes, detectFormat } = await import("../features/numeral-converter/utils/conversion-helpers");
    try {
      const detected = inputFormat === 'auto' ? detectFormat(input).format : inputFormat;
      const bytes = decodeToBytes(input, detected);
      const value = encodeFromBytes(bytes, targetFormat, extraOptions);
      return { value, error: "" };
    } catch (e: any) {
      return { value: "", error: e.message || "Conversion failed" };
    }
  },

  async detectNumeralFormat(input: string) {
    const { detectFormat } = await import("../features/numeral-converter/utils/conversion-helpers");
    return detectFormat(input);
  }
};

Comlink.expose(api);
export type ComputeWorkerAPI = typeof api;
