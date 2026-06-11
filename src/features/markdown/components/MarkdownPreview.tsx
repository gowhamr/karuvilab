"use client";

import React, { useEffect, useRef } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Copy, Maximize2, Check, Loader2 } from "lucide-react";

interface MarkdownPreviewProps {
  html: string;
  onCopyRaw: () => void;
  hideHeader?: boolean;
}

export const MarkdownPreview = React.forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ html, onCopyRaw, hideHeader = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (!containerRef.current) return;

    const win = window as any;

    // Handle Syntax Highlighting
    if (win.hljs) {
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        win.hljs.highlightElement(block);
      });
    }

    // Handle Mermaid Diagrams
    if (win.mermaid) {
      const placeholders = containerRef.current.querySelectorAll('.mermaid-placeholder');
      placeholders.forEach(async (ph, idx) => {
        const src = decodeURIComponent(ph.getAttribute('data-src') || '');
        const id = `mermaid-${Date.now()}-${idx}`;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'my-6 bg-surface border border-border rounded-xl overflow-hidden shadow-sm';
        wrapper.innerHTML = `
          <div class="flex items-center justify-between px-3 py-2 bg-bg border-b border-border">
            <span class="text-[10px] font-black text-text-4 uppercase tracking-widest flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-blue animate-pulse"></span>
              Diagram
            </span>
            <div class="flex gap-1">
              <button class="mmd-copy p-1 hover:bg-surface rounded text-text-4 hover:text-blue transition-all" title="Copy Source">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>
          <div id="${id}" class="p-4 flex justify-center bg-white dark:bg-surface transition-colors">
            <div class="flex items-center gap-2 text-xs text-text-4 font-bold uppercase tracking-wider">
               <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Rendering Diagram...
            </div>
          </div>
        `;
        
        ph.replaceWith(wrapper);
        
        const copyBtn = wrapper.querySelector('.mmd-copy');
        copyBtn?.addEventListener('click', () => {
          navigator.clipboard.writeText(src);
          copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          setTimeout(() => {
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          }, 2000);
        });

        try {
          const { svg } = await win.mermaid.render(`${id}-svg`, src);
          const body = wrapper.querySelector(`#${id}`);
          if (body) body.innerHTML = svg;
        } catch (err) {
          const body = wrapper.querySelector(`#${id}`);
          if (body) body.innerHTML = `<div class="text-error text-xs p-4 bg-error/5 border border-error/10 rounded-lg">⚠ Mermaid Error: ${(err as any).message || 'Invalid syntax'}</div>`;
        }
      });
    }

    // Inject Copy buttons to code blocks
    containerRef.current.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-code-btn')) return;
      pre.className = (pre.className || '') + ' relative group';
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn absolute right-2 top-2 p-1.5 bg-surface/80 backdrop-blur-sm border border-border rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:text-blue hover:scale-105';
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      btn.onclick = (e) => {
        e.stopPropagation();
        const code = (pre.querySelector('code') as HTMLElement)?.innerText || '';
        navigator.clipboard.writeText(code);
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        }, 2000);
      };
      pre.appendChild(btn);
    });

  }, [html]);

  return (
    <div className="flex flex-col h-full bg-bg border border-border rounded-xl overflow-hidden shadow-sm">
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
          <span className="text-xs font-black text-text-4 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue" />
            Live Preview
          </span>
          <button 
            onClick={onCopyRaw}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-text-3 hover:text-blue hover:bg-blue/5 rounded-lg transition-all"
          >
            <Copy className="w-3 h-3" />
            Copy MD
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth markdown-body" ref={ref}>
        <div 
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!html.trim() && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-16 h-16 bg-surface rounded-4xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-text-4 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs uppercase tracking-widest">Nothing to preview</h4>
              <p className="text-[10px] font-bold text-text-4 uppercase max-w-[200px]">
                Start typing markdown in the editor to see it rendered here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    );
    }
    );
