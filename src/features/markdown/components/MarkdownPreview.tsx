import React, { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { CopyButton } from "@/components/ui/CopyButton";
import { Copy, Loader2 } from "lucide-react";
import { sanitizeHtml } from "@/src/lib/security";
import { MermaidDiagramBlock } from "../mermaid/components/MermaidDiagramBlock";
import { MermaidPreflightAnalyzer } from "../mermaid/MermaidPreflight";
import { MermaidBlock } from "../mermaid/types";

interface MarkdownPreviewProps {
  html: string;
  onCopyRaw: () => void;
  hideHeader?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  className?: string;
}

export const MarkdownPreview = React.forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ html, onCopyRaw, hideHeader = false, onScroll, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const win = window as unknown as {
        hljs?: { highlightElement: (el: Element) => void };
      };
      
      const cleanups: (() => void)[] = [];
      const mountedRoots: Root[] = [];

      // 1. Handle Syntax Highlighting
      const hljs = win.hljs;
      if (hljs) {
        containerRef.current.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      }

      // 2. Handle Mermaid Diagrams through isolated MermaidDiagramBlock lifecycle
      const placeholders = containerRef.current.querySelectorAll('.mermaid-placeholder');
      placeholders.forEach((ph, idx) => {
        const src = decodeURIComponent(ph.getAttribute('data-src') || '');
        const lang = ph.getAttribute('data-lang') || 'mermaid';
        const isDark =
          document.documentElement.getAttribute('data-theme') === 'dark' ||
          document.documentElement.classList.contains('dark') ||
          (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
        const theme = isDark ? 'dark' : 'light';
        const hash = MermaidPreflightAnalyzer.computeHash(src, theme);

        const block: MermaidBlock = {
          id: `mmd-${hash.substring(0, 8)}-${idx}`,
          source: src,
          hash,
          index: idx,
          lang,
        };

        const mountPoint = document.createElement('div');
        mountPoint.className = 'mermaid-mount-container';
        ph.replaceWith(mountPoint);

        const root = createRoot(mountPoint);
        root.render(<MermaidDiagramBlock block={block} />);
        mountedRoots.push(root);
      });

      cleanups.push(() => {
        mountedRoots.forEach(root => {
          try {
            root.unmount();
          } catch {
            // Ignore unmount race condition
          }
        });
      });

      // 3. Inject Copy buttons to standard code blocks
      containerRef.current.querySelectorAll('pre').forEach(pre => {
        if (pre.querySelector('.copy-code-btn') || pre.closest('.mermaid-container')) return;
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
    <div className={`flex flex-col h-full bg-bg border border-border rounded-xl overflow-hidden shadow-sm ${className || ''}`}>
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border shrink-0">
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
      <div 
        className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 scroll-smooth markdown-body custom-scrollbar min-w-0 max-w-full select-text" 
        ref={ref}
        onScroll={onScroll}
      >
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
