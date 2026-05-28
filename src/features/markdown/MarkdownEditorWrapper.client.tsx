"use client";

import React, { useEffect, useState } from "react";
import { EngineLoader } from "@/components/system/EngineLoader";
import { MarkdownEditor } from "./components/MarkdownEditor";
import "./markdown.css";

export default function MarkdownEditorWrapper() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    async function loadScripts() {
      if (typeof window === 'undefined') return;
      
      const isGithubPages = window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/karuvilab');
      const basePath = isGithubPages ? '/karuvilab' : '';

      // Load Highlight.js CSS
      if (!document.getElementById('hljs-style')) {
        const link = document.createElement('link');
        link.id = 'hljs-style';
        link.rel = 'stylesheet';
        link.href = `${basePath}/lib/markdown/github.min.css`;
        link.onerror = () => {
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
        };
        document.head.appendChild(link);
      }

      // Load Highlight.js Script
      const loadHljs = new Promise((resolve) => {
        if ((window as any).hljs) return resolve(true);
        const script = document.createElement('script');
        script.src = `${basePath}/lib/markdown/highlight.min.js`;
        script.onload = () => resolve(true);
        script.onerror = () => {
          // Fallback to CDN
          const fallback = document.createElement('script');
          fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
          fallback.onload = () => resolve(true);
          fallback.onerror = () => resolve(false); // Still resolve to not block forever
          document.head.appendChild(fallback);
        };
        document.head.appendChild(script);
      });

      // Load Mermaid Script
      const loadMermaid = new Promise((resolve) => {
        if ((window as any).mermaid) return resolve(true);
        const script = document.createElement('script');
        script.src = `${basePath}/lib/markdown/mermaid.min.js`;
        script.onload = () => {
          try {
            (window as any).mermaid.initialize({
              startOnLoad: false,
              theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
              securityLevel: 'loose',
            });
          } catch (e) {
            console.error("Mermaid init error:", e);
          }
          resolve(true);
        };
        script.onerror = () => {
          // Fallback to CDN
          const fallback = document.createElement('script');
          fallback.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
          fallback.onload = () => {
            try {
              (window as any).mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
                securityLevel: 'loose',
              });
            } catch (e) {
              console.error("Mermaid fallback init error:", e);
            }
            resolve(true);
          };
          fallback.onerror = () => resolve(false);
          document.head.appendChild(fallback);
        };
        document.head.appendChild(script);
      });

      await Promise.all([loadHljs, loadMermaid]);
      setScriptsLoaded(true);
    }

    loadScripts();
  }, []);

  const checkInit = () => {
    return typeof (window as any).mermaid !== 'undefined' && typeof (window as any).hljs !== 'undefined';
  };

  return (
    <EngineLoader 
      checkInit={checkInit}
      loadingMessage="Initializing Markdown Engine..."
    >
      <MarkdownEditor />
    </EngineLoader>
  );
}
