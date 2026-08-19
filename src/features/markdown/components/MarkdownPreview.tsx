"use client";

import React, { useEffect, useRef } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Copy, Loader2 } from "lucide-react";
import { sanitizeHtml } from "@/src/lib/security";

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

    const win = window as unknown as {
      hljs?: { highlightElement: (el: Element) => void };
      mermaid?: { render: (id: string, src: string) => Promise<{ svg: string }> };
    };
    
    const cleanups: (() => void)[] = [];

    // Handle Syntax Highlighting
    const hljs = win.hljs;
    if (hljs) {
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }

    // Handle Mermaid Diagrams
    const mermaid = win.mermaid;
    if (mermaid) {
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.documentElement.classList.contains('dark') ||
        (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
      
      try {
        if (typeof (mermaid as any).initialize === 'function') {
          (mermaid as any).initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: isDark ? 'dark' : 'default',
            themeVariables: isDark ? {
              darkMode: true,
              background: '#0f172a',
              primaryColor: '#3b82f6',
              primaryTextColor: '#f8fafc',
              primaryBorderColor: '#60a5fa',
              lineColor: '#94a3b8',
              secondaryColor: '#1e293b',
              tertiaryColor: '#0f172a',
              textColor: '#f8fafc',
              nodeTextColor: '#f8fafc',
              mainBkg: '#1e293b',
              nodeBorder: '#3b82f6',
              clusterBkg: '#0f172a',
              clusterBorder: '#334155',
              titleColor: '#f8fafc',
              edgeLabelBackground: '#1e293b',
              actorTextColor: '#f8fafc',
              actorLineColor: '#94a3b8',
              signalColor: '#f8fafc',
              signalTextColor: '#f8fafc',
              labelTextColor: '#f8fafc',
              loopTextColor: '#f8fafc',
              noteBorderColor: '#60a5fa',
              noteBkgColor: '#1e293b',
              noteTextColor: '#f8fafc',
            } : {
              darkMode: false,
              background: '#ffffff',
              primaryColor: '#e0e7ff',
              primaryTextColor: '#0f172a',
              primaryBorderColor: '#6366f1',
              lineColor: '#475569',
              textColor: '#0f172a',
              nodeTextColor: '#0f172a',
              mainBkg: '#f8fafc',
              nodeBorder: '#6366f1',
              titleColor: '#0f172a',
              edgeLabelBackground: '#f8fafc',
            }
          });
        }
      } catch (e) {
        console.warn('Mermaid config notice:', e);
      }

      const placeholders = containerRef.current.querySelectorAll('.mermaid-placeholder');
      placeholders.forEach(async (ph, idx) => {
        const src = decodeURIComponent(ph.getAttribute('data-src') || '');
        const id = `mermaid-${Date.now()}-${idx}`;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'my-6 bg-surface border border-border rounded-xl overflow-hidden shadow-sm mermaid-container';
        wrapper.innerHTML = sanitizeHtml(`
          <div class="flex items-center justify-between px-3 py-2 bg-bg border-b border-border">
            <span class="text-xs font-black text-text-4 uppercase tracking-widest flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-blue animate-pulse"></span>
              Mermaid Diagram
            </span>
            <button class="mmd-copy flex items-center gap-1 px-2 py-1 bg-surface border border-border rounded-md text-text-muted hover:text-blue hover:border-blue transition-all cursor-pointer text-xs font-semibold" title="Copy Diagram Source" aria-label="Copy Diagram Source">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Source</span>
            </button>
          </div>
          <div id="${id}" class="p-6 overflow-x-auto flex justify-center bg-surface/50 text-text [&_svg]:max-w-full [&_svg]:h-auto [&_text]:fill-current [&_tspan]:fill-current [&_.nodeLabel]:text-current [&_.label]:text-current [&_.labelText]:text-current [&_.actor]:fill-current [&_.messageText]:fill-current">
            <div class="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        `, { ADD_TAGS: ['svg', 'rect', 'path', 'span'], ADD_ATTR: ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'stroke', 'rx', 'ry'] });
        
        ph.replaceWith(wrapper);
        
        const copyBtn = wrapper.querySelector('.mmd-copy');
        if (copyBtn) {
          const handler = () => {
            navigator.clipboard.writeText(src);
            copyBtn.innerHTML = sanitizeHtml('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>', { ADD_TAGS: ['svg', 'polyline', 'span'], ADD_ATTR: ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'stroke', 'points'] });
            setTimeout(() => {
              copyBtn.innerHTML = sanitizeHtml('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Source</span>', { ADD_TAGS: ['svg', 'rect', 'path', 'span'], ADD_ATTR: ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'stroke', 'rx', 'ry'] });
            }, 2000);
          };
          copyBtn.addEventListener('click', handler);
          cleanups.push(() => copyBtn.removeEventListener('click', handler));
        }

        try {
          const { svg } = await mermaid.render(`${id}-svg`, src);
          const body = wrapper.querySelector(`#${id}`);
          // Sanitize SVG output from mermaid before injection preserving foreignObject, style, text, and labels (KL-09)
          if (body) {
            body.innerHTML = sanitizeHtml(svg, {
              USE_PROFILES: { svg: true, svgFilters: true, html: true },
              ADD_TAGS: [
                'foreignObject', 'foreignobject', 'style', 'text', 'tspan',
                'defs', 'marker', 'use', 'clipPath', 'g', 'path', 'rect',
                'circle', 'line', 'polyline', 'polygon', 'div', 'span', 'p'
              ],
              ADD_ATTR: [
                'xmlns', 'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width',
                'transform', 'id', 'class', 'style', 'marker-end', 'marker-start',
                'd', 'x', 'y', 'dx', 'dy', 'text-anchor', 'dominant-baseline',
                'font-size', 'font-family', 'font-weight', 'rx', 'ry'
              ]
            });
          }
        } catch (err) {
          const body = wrapper.querySelector(`#${id}`);
          // Sanitize error message to prevent XSS
          const safeMessage = sanitizeHtml(String((err as Error).message || 'Invalid syntax'));
          if (body) body.innerHTML = sanitizeHtml(`<div class="text-error text-xs p-4 bg-error/5 border border-error/10 rounded-lg">⚠ Mermaid Error: ${safeMessage}</div>`);
        }
      });
    }

    // Inject Copy buttons to code blocks
    containerRef.current.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-code-btn')) return;
      pre.className = (pre.className || '') + ' relative group';
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn absolute right-2.5 top-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-surface/90 backdrop-blur-sm border border-border rounded-lg text-text-3 hover:text-blue hover:border-blue text-xs font-semibold shadow-xs opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer select-none';
      btn.innerHTML = sanitizeHtml('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>', { ADD_TAGS: ['svg', 'rect', 'path', 'span'], ADD_ATTR: ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'stroke', 'rx', 'ry'] });
      btn.setAttribute('aria-label', 'Copy code snippet');
      const clickHandler = (e: MouseEvent) => {
        e.stopPropagation();
        const code = (pre.querySelector('code') as HTMLElement)?.innerText || '';
        navigator.clipboard.writeText(code);
        btn.innerHTML = sanitizeHtml('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span class="text-green-500 font-bold">Copied!</span>', { ADD_TAGS: ['svg', 'polyline', 'span'], ADD_ATTR: ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'stroke', 'points', 'class'] });
        setTimeout(() => {
          btn.innerHTML = sanitizeHtml('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>', { ADD_TAGS: ['svg', 'rect', 'path', 'span'], ADD_ATTR: ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'stroke', 'rx', 'ry'] });
        }, 2000);
      };
      btn.addEventListener('click', clickHandler);
      cleanups.push(() => btn.removeEventListener('click', clickHandler));
      pre.appendChild(btn);
    });

    return () => {
      cleanups.forEach(fn => fn());
    };
  }, [html]);

  return (
    <div className="flex flex-col h-full bg-bg border border-border rounded-xl overflow-hidden shadow-sm">
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
          <span className="text-xs font-black text-text-4 uppercase tracking-widest-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
            Live Preview
          </span>
          <button 
            onClick={onCopyRaw}
            aria-label="Copy raw markdown"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-tiny font-bold uppercase tracking-widest-sm text-text-3 hover:text-blue hover:bg-blue/5 rounded-lg transition-all"
          >
            <Copy className="w-3 h-3" aria-hidden="true" />
            Copy MD
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth markdown-body" ref={ref}>
        <div 
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
        {!html.trim() && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-16 h-16 bg-surface rounded-4xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-text-4 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs uppercase tracking-widest">Nothing to preview</h4>
              <p className="text-xs font-bold text-text-4 uppercase max-w-52">
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

MarkdownPreview.displayName = "MarkdownPreview";
