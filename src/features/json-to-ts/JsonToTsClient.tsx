"use client";

import { useState, useMemo, useDeferredValue } from 'react';
import Editor from '@monaco-editor/react';
import { CopyButton } from "@/components/ui/CopyButton";
import { Code, FileJson } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

function generateTsInterfaces(json: string, rootName: string = 'RootObject'): string {
  if (!json.trim()) return '';
  try {
    const obj = JSON.parse(json);
    const interfaces: Map<string, string> = new Map();

    function capitalize(str: string) {
      if (!str) return 'Any';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getType(value: any, keyName: string): string {
      if (value === null) return 'any';
      if (typeof value === 'string') return 'string';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'boolean') return 'boolean';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        let itemType = 'any';
        for (const item of value) {
            const currentType = getType(item, capitalize(keyName) + 'Item');
            if (currentType !== 'any') {
                itemType = currentType;
                break;
            }
        }
        return `${itemType}[]`;
      }
      if (typeof value === 'object') {
        const interfaceName = capitalize(keyName);
        generateInterface(value, interfaceName);
        return interfaceName;
      }
      return 'any';
    }

    function generateInterface(obj: Record<string, any>, name: string) {
      let uniqueName = name;
      let counter = 1;
      while (interfaces.has(uniqueName)) {
        uniqueName = `${name}${counter}`;
        counter++;
      }
      
      let ts = `export interface ${uniqueName} {\n`;
      for (const [key, value] of Object.entries(obj)) {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
        const valType = getType(value, key);
        ts += `  ${safeKey}: ${valType};\n`;
      }
      ts += `}\n`;
      interfaces.set(uniqueName, ts);
    }

    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      generateInterface(obj, rootName);
    } else if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        generateInterface(obj[0], rootName + 'Item');
      } else {
        return `export type ${rootName} = ${getType(obj, rootName)};\n`;
      }
    } else {
       return `export type ${rootName} = ${getType(obj, rootName)};\n`;
    }

    return Array.from(interfaces.values()).reverse().join('\n\n');
  } catch (e) {
    return `// Error parsing JSON\n// ${(e as Error).message}`;
  }
}

export default function JsonToTsClient() {
  const { toast } = useToast();
  const [input, setInput] = useState<string>('{\n  "name": "KaruviLab",\n  "version": 1,\n  "features": ["local", "private"]\n}');
  const deferredInput = useDeferredValue(input);

  const output = useMemo(() => {
    return generateTsInterfaces(deferredInput);
  }, [deferredInput]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-text flex items-center gap-3">
              <FileJson className="w-4 h-4 text-blue" />
              JSON Input
            </h2>
          </div>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden h-[600px] shadow-sm relative">
            <Editor
              height="100%"
              language="json"
              theme="vs-dark"
              value={input}
              onChange={(val) => {
                if (val && val.length > 5 * 1024 * 1024) {
                  toast("Input text exceeds 5MB limit", "error");
                } else {
                  setInput(val || '');
                }
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                padding: { top: 16 }
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue flex items-center gap-3">
              <Code className="w-4 h-4" />
              TypeScript Output
            </h2>
            <CopyButton text={output} disabled={!output || output.startsWith('// Error')} />
          </div>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden h-[600px] shadow-sm relative">
            <Editor
              height="100%"
              language="typescript"
              theme="vs-dark"
              value={output}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                padding: { top: 16 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
