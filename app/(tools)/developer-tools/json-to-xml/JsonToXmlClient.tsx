'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Download, Code2, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { blobManager } from '@/src/lib/blob-manager';

type ConversionMode = 'json-to-xml' | 'xml-to-json';

function sanitizeTagName(name: string): string {
  let sanitized = name.replace(/^[^a-zA-Z_]/, '_');
  sanitized = sanitized.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  return sanitized || '_';
}

function jsonToXml(obj: any, rootName = 'root', indentSpaces = 2): string {
  let xml = '';
  
  const createNode = (key: string, val: any, depth: number): string => {
    const indent = ' '.repeat(depth * indentSpaces);
    const tagName = sanitizeTagName(key);
    
    if (val === null || val === undefined) {
      return `${indent}<${tagName}/>\n`;
    }
    
    if (typeof val !== 'object') {
      const escaped = String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      return `${indent}<${tagName}>${escaped}</${tagName}>\n`;
    }
    
    if (Array.isArray(val)) {
      return val.map(item => createNode(key, item, depth)).join('');
    }
    
    let attrs = '';
    let inner = '';
    let hasChildren = false;
    let textContent = '';
    
    for (const [k, v] of Object.entries(val)) {
      if (k.startsWith('@_')) {
        const attrName = sanitizeTagName(k.slice(2));
        const attrValue = String(v).replace(/"/g, '&quot;');
        attrs += ` ${attrName}="${attrValue}"`;
      } else if (k === '#text') {
        textContent += String(v)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      } else {
        hasChildren = true;
        inner += createNode(k, v, depth + 1);
      }
    }
    
    if (!hasChildren && !textContent) {
      return `${indent}<${tagName}${attrs}/>\n`;
    }
    
    if (!hasChildren && textContent) {
      return `${indent}<${tagName}${attrs}>${textContent}</${tagName}>\n`;
    }
    
    return `${indent}<${tagName}${attrs}>\n${inner}${indent}</${tagName}>\n`;
  };

  try {
    const data = typeof obj === 'string' ? JSON.parse(obj) : obj;
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n${createNode(rootName, data, 0)}`;
    // If indentSpaces is 0, we can optionally remove newlines, but keeping them is fine for "minified lines"
    return indentSpaces === 0 ? xml.replace(/\n/g, '') : xml;
  } catch (err) {
    return `Error parsing JSON: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }
}

function xmlToJson(xmlStr: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "application/xml");
    
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return `Error parsing XML: ${parserError.textContent}`;
    }

    const domNodeToObject = (node: Node): any => {
      if (node.nodeType === 3 || node.nodeType === 4) { // TEXT or CDATA
        const text = node.nodeValue?.trim();
        return text ? text : null;
      }
      if (node.nodeType === 1) { // ELEMENT
        const obj: any = {};
        const element = node as Element;
        
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          if (attr) obj[`@_${attr.name}`] = attr.value;
        }

        let hasChildren = false;
        let textContent = '';
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (!child) continue;
          if (child.nodeType === 1) {
            hasChildren = true;
            const childName = child.nodeName;
            const childObj = domNodeToObject(child);
            if (obj[childName] === undefined) {
              obj[childName] = childObj;
            } else {
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }
              obj[childName].push(childObj);
            }
          } else if (child.nodeType === 3 || child.nodeType === 4) {
            const text = child.nodeValue?.trim();
            if (text) textContent += text;
          }
        }

        if (!hasChildren && Object.keys(obj).length === 0) {
          return textContent || null;
        }
        
        if (textContent) {
          obj['#text'] = textContent;
        }
        return obj;
      }
      return null;
    };

    const rootElement = doc.documentElement;
    const result = { [rootElement.nodeName]: domNodeToObject(rootElement) };
    return JSON.stringify(result, null, 2);
  } catch (err) {
    return `Error parsing XML: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }
}

export default function JsonToXmlClient() {
  const [mode, setMode] = useState<ConversionMode>('json-to-xml');
  const [input, setInput] = useState<string>('');
  const [rootNodeName, setRootNodeName] = useState<string>('root');
  const [indentSpaces, setIndentSpaces] = useState<number>(2);

  const output = useMemo(() => {
    if (!input.trim()) return '';
    if (mode === 'json-to-xml') {
      return jsonToXml(input, rootNodeName || 'root', indentSpaces);
    } else {
      return xmlToJson(input);
    }
  }, [mode, input, rootNodeName, indentSpaces]);

  const handleDownload = () => {
    if (!output || output.startsWith('Error:')) return;
    const blob = new Blob([output], { type: mode === 'json-to-xml' ? 'application/xml' : 'application/json' });
    const url = blobManager.create(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'json-to-xml' ? 'converted.xml' : 'converted.json';
    a.click();
    blobManager.revoke(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-sm font-black uppercase tracking-widest-lg text-blue flex items-center gap-3">
            <ArrowLeftRight className="w-4 h-4" />
            JSON / XML Converter
          </h2>
          
          <div className="flex bg-bg border border-border rounded-xl p-1">
            <button
              onClick={() => setMode('json-to-xml')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                mode === 'json-to-xml' ? "bg-surface text-text shadow-sm" : "text-text-4 hover:text-text-3"
              )}
            >
              JSON to XML
            </button>
            <button
              onClick={() => setMode('xml-to-json')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                mode === 'xml-to-json' ? "bg-surface text-text shadow-sm" : "text-text-4 hover:text-text-3"
              )}
            >
              XML to JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">
                Input {mode === 'json-to-xml' ? 'JSON' : 'XML'}
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
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'json-to-xml' ? '{\n  "name": "John",\n  "age": 30\n}' : '<root>\n  <name>John</name>\n  <age>30</age>\n</root>'}
              className="w-full h-96 bg-bg border border-border rounded-2xl p-4 font-mono text-sm text-text focus:ring-2 focus:ring-blue/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 flex items-center gap-2">
                Output {mode === 'json-to-xml' ? 'XML' : 'JSON'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={!output || output.startsWith('Error:')}
                  className="p-1.5 text-text-4 hover:text-blue transition-colors disabled:opacity-50"
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
        {mode === 'json-to-xml' && (
          <div className="bg-bg border border-border rounded-3xl p-6 space-y-6">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-4">Options</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-2">Root Node Name</label>
                <input
                  type="text"
                  value={rootNodeName}
                  onChange={(e) => setRootNodeName(e.target.value)}
                  placeholder="root"
                  className="w-full bg-surface border border-border rounded-xl p-2.5 text-sm font-medium text-text focus:ring-2 focus:ring-blue/20 outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-2">Indentation</label>
                <select
                  value={indentSpaces}
                  onChange={(e) => setIndentSpaces(Number(e.target.value))}
                  className="w-full bg-surface border border-border rounded-xl p-2.5 text-sm font-medium text-text focus:ring-2 focus:ring-blue/20 outline-none"
                >
                  <option value={0}>Minified (No spaces)</option>
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
