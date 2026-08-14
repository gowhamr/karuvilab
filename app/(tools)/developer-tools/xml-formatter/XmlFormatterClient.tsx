'use client';

import React, { useState, useMemo } from 'react';
import { Check, AlertTriangle, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { blobManager } from '@/src/lib/blob-manager';
import { useFocusModeIntegration } from '@/src/contexts/FocusModeControlsContext';
import { useFullscreenContext } from '@/src/contexts/FullscreenContext';
import { useToast } from '@/components/ui/Toast';

type XMLFormatMode = 'format' | 'minify' | 'validate';
type XMLIndent = '2' | '4' | 'tab';

interface XMLFormatOptions {
  indent: XMLIndent;
  mode: XMLFormatMode;
}

interface XMLResult {
  output: string;
  valid: boolean;
  error?: { message: string; line?: number; col?: number };
  stats: {
    elements: number;
    attributes: number;
    depth: number;
    size: { original: number; output: number };
  };
}

// Simple XML formatter using DOMParser and TreeWalker
function processXML(xml: string, options: XMLFormatOptions): XMLResult {
  const originalSize = new Blob([xml]).size;
  const result: XMLResult = {
    output: '',
    valid: false,
    stats: { elements: 0, attributes: 0, depth: 0, size: { original: originalSize, output: 0 } }
  };

  if (!xml.trim()) return result;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parse errors (browser DOMParser injects <parsererror>)
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      result.error = { message: errorNode.textContent || 'Syntax Error' };
      // Try to extract line number from standard error formats
      const lineMatch = errorNode.textContent?.match(/line\\s+(\\d+)/i);
      const colMatch = errorNode.textContent?.match(/column\\s+(\\d+)/i);
      if (lineMatch) result.error.line = parseInt(lineMatch[1] || '0', 10);
      if (colMatch) result.error.col = parseInt(colMatch[1] || '0', 10);
      return result;
    }

    result.valid = true;

    if (options.mode === 'validate') {
      result.output = 'XML is valid.';
      return result;
    }

    // Stats calculation
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT, null);
    let currentNode = walker.nextNode();
    let maxDepth = 0;

    while (currentNode) {
      const el = currentNode as Element;
      result.stats.elements++;
      result.stats.attributes += el.attributes.length;
      
      let depth = 0;
      let parent = el.parentElement;
      while (parent) {
        depth++;
        parent = parent.parentElement;
      }
      if (depth > maxDepth) maxDepth = depth;
      
      currentNode = walker.nextNode();
    }
    result.stats.depth = maxDepth;

    // Formatting / Minifying
    const serializer = new XMLSerializer();
    const rawOutput = serializer.serializeToString(doc);

    if (options.mode === 'minify') {
      // Very basic minify: remove newlines and spaces between tags
      result.output = rawOutput.replace(/>\\s+</g, '><').trim();
    } else {
      // Basic formatter (could be improved with a proper recursive serializer)
      const indentStr = options.indent === 'tab' ? '\\t' : ' '.repeat(parseInt(options.indent));
      let formatted = '';
      let indent = 0;
      const arr = rawOutput.replace(/>\\s+</g, '><').split(/(?=<)|(?<=>)/);
      
      for (let i = 0; i < arr.length; i++) {
        const node = arr[i] || '';
        if (!node) continue;

        if (node.match(/^<\w[^>]*[^/]>.*<\/\w[^>]*>$/)) {
          // Inline element <tag>content</tag>
          formatted += indentStr.repeat(indent) + node + '\n';
        } else if (node.match(/^<\/?/)) {
          // Start or end tag
          if (node.match(/^<\//)) indent--;
          formatted += indentStr.repeat(indent) + node + '\n';
          if (node.match(/^<[^/]/) && !node.match(/\/>$/) && !node.match(/^<\?/)) indent++;
        } else {
          // Text node
          if (node.trim()) formatted += indentStr.repeat(indent) + node.trim() + '\n';
        }
      }
      result.output = formatted.trim();
    }

    result.stats.size.output = new Blob([result.output]).size;
    return result;

  } catch (err) {
    result.error = { message: err instanceof Error ? err.message : 'Unknown Parsing Error' };
    return result;
  }
}

export default function XmlFormatterClient() {
  const { toast } = useToast();
  const [input, setInput] = useState<string>('');
  const [options, setOptions] = useState<XMLFormatOptions>({
    indent: '2',
    mode: 'format'
  });

  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  const { isFullscreen, activeToolId } = useFullscreenContext();
  const isThisToolFullscreen = isFullscreen && activeToolId === "xml-formatter";

  const result = useMemo(() => processXML(input, options), [input, options]);

  const handleDownload = () => {
    if (!result.valid || options.mode === 'validate') return;
    const blob = new Blob([result.output], { type: 'application/xml' });
    const url = blobManager.create(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = options.mode === 'minify' ? 'minified.xml' : 'formatted.xml';
    a.click();
    blobManager.revoke(url);
  };

  useFocusModeIntegration({
    charCount: result.output.length,
    lineCount: result.output ? result.output.split('\n').length : 0,
    language: "xml",
    onFontSizeChange: setFontSize,
    onWrapToggle: () => setWordWrap(v => !v),
  });

  return (
    <ToolWorkspace
      tabs={{
        options: [
          { id: 'format', label: 'Format' },
          { id: 'minify', label: 'Minify' },
          { id: 'validate', label: 'Validate' }
        ],
        activeId: options.mode,
        onChange: (id) => setOptions({ ...options, mode: id as XMLFormatMode })
      }}
      optionsPanel={
        options.mode === 'format' ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-text-2">Indentation</span>
            <div className="flex gap-2">
              {(['2', '4', 'tab'] as XMLIndent[]).map(ind => (
                <button
                  key={ind}
                  onClick={() => setOptions({ ...options, indent: ind })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors border",
                    options.indent === ind ? "bg-blue/10 border-blue/30 text-blue" : "bg-surface border-border text-text-muted hover:text-text"
                  )}
                >
                  {ind === 'tab' ? 'Tab' : `${ind} Spaces`}
                </button>
              ))}
            </div>
          </div>
        ) : undefined
      }
      input={
        <div className="space-y-3 flex flex-col h-full min-h-[300px]">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-text-2">Input XML</label>
            {input && (
              <button onClick={() => setInput('')} className="text-xs font-bold text-red-500 hover:underline">
                Clear
              </button>
            )}
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
            placeholder="<root>\n  <item>Data</item>\n</root>"
            className={`w-full flex-1 bg-bg border border-border rounded-xl p-4 font-mono text-text focus:ring-2 focus:ring-blue/20 outline-none transition-all resize-none ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
            style={{ fontSize: `${fontSize}px` }}
            spellCheck="false"
          />
        </div>
      }
      output={
        <div className="space-y-3 flex flex-col h-full min-h-[300px]">
          <div className="flex justify-between items-center px-1 min-h-[24px]">
            <label className="text-sm font-bold text-text-2">
              {options.mode === 'validate' ? 'Validation Result' : 'Output'}
            </label>
            {options.mode !== 'validate' && result.valid && (
              <div className="flex items-center gap-2">
                <button onClick={handleDownload} className="min-w-11 min-h-11 flex items-center justify-center text-text-4 hover:text-blue transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-blue/20 outline-none" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <CopyButton text={result.output} />
              </div>
            )}
          </div>
          
          <div className={cn(
            "w-full flex-1 rounded-xl overflow-hidden border flex flex-col",
            !input ? "bg-bg border-border text-text-muted items-center justify-center" :
            result.valid ? "bg-mat-surface border-green-500/30 ring-1 ring-green-500/10" : "bg-error/5 border-error/30 items-center justify-center"
          )}>
            {!input ? (
              <div className="font-mono text-sm">Awaiting input...</div>
            ) : result.valid ? (
              options.mode === 'validate' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-green-500">Valid XML</h3>
                    <p className="text-sm font-medium text-text-3 mt-2">The document is well-formed and structurally sound.</p>
                  </div>
                </div>
              ) : (
                <textarea
                  readOnly
                  value={result.output}
                  className={`w-full h-full bg-transparent p-4 font-mono text-text outline-none resize-none ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
                  style={{ fontSize: `${fontSize}px` }}
                />
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-error" />
                <div>
                  <h3 className="text-base font-black uppercase tracking-widest text-error">Parsing Error</h3>
                  <p className="font-mono text-sm mt-4 bg-error/10 text-error p-3 rounded-xl border border-error/20">{result.error?.message}</p>
                  {(result.error?.line || result.error?.col) && (
                    <p className="text-xs font-bold mt-3 text-error">
                      Line: {result.error?.line || '?'} | Col: {result.error?.col || '?'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      }
      infoPanel={
        input && result.valid ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">Elements</span>
              <span className="text-xl font-mono font-black text-text">{result.stats.elements}</span>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">Attributes</span>
              <span className="text-xl font-mono font-black text-text">{result.stats.attributes}</span>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">Max Depth</span>
              <span className="text-xl font-mono font-black text-text">{result.stats.depth}</span>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">Size {options.mode === 'minify' ? 'Reduction' : 'Change'}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-mono font-black text-text">
                  {(result.stats.size.output / 1024).toFixed(1)} <span className="text-sm font-bold text-text-muted">KB</span>
                </span>
                {options.mode === 'minify' && result.stats.size.original > 0 && (
                  <span className="text-xs font-bold text-green-500">
                    -{((1 - result.stats.size.output / result.stats.size.original) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : undefined
      }
    />
  );
}

