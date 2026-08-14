'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { useToast } from '@/components/ui/Toast';

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
      if (node.nodeType === 3 || node.nodeType === 4) {
        const text = node.nodeValue?.trim();
        return text ? text : null;
      }
      if (node.nodeType === 1) {
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
  const { toast } = useToast();
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

  const error = output.startsWith('Error:') ? output : undefined;
  const validOutput = error ? '' : output;

  return (
    <ToolWorkspace
      layout="split"
      tabs={{
        options: [
          { id: 'json-to-xml', label: 'JSON to XML', icon: <ArrowLeftRight size={16} /> },
          { id: 'xml-to-json', label: 'XML to JSON', icon: <ArrowLeftRight size={16} /> }
        ],
        activeId: mode,
        onChange: (id) => setMode(id as ConversionMode)
      }}
      input={
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-sm font-bold text-text-2">Input {mode === 'json-to-xml' ? 'JSON' : 'XML'}</span>
            <button 
              onClick={() => setInput('')}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
          <ToolInput
            value={input}
            onChange={(val) => {
               if (val.length > 5 * 1024 * 1024) toast("Input text exceeds 5MB limit", "error");
               else setInput(val);
            }}
            placeholder={mode === 'json-to-xml' ? '{\n  "name": "John",\n  "age": 30\n}' : '<root>\n  <name>John</name>\n  <age>30</age>\n</root>'}
            mono
            className="flex-1 min-h-96 lg:min-h-[700px] resize-none"
          />
        </div>
      }
      optionsPanel={
        mode === 'json-to-xml' ? (
          <div className="space-y-6">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ToolInput
                label="Root Node Name"
                value={rootNodeName}
                onChange={setRootNodeName}
                placeholder="root"
              />
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-2 px-1">Indentation</label>
                <select
                  value={indentSpaces}
                  onChange={(e) => setIndentSpaces(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-input text-body text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none h-12"
                >
                  <option value={0}>Minified (No spaces)</option>
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                </select>
              </div>
            </div>
          </div>
        ) : undefined
      }
      output={
        <ToolResultArea
          label={`Output ${mode === 'json-to-xml' ? 'XML' : 'JSON'}`}
          value={validOutput}
          error={error}
          downloadFilename={mode === 'json-to-xml' ? 'converted.xml' : 'converted.json'}
          downloadMimeType={mode === 'json-to-xml' ? 'application/xml' : 'application/json'}
          language={mode === 'json-to-xml' ? 'xml' : 'json'}
          contentClassName="h-96 lg:h-[700px] max-h-[700px]"
        />
      }
    />
  );
}
