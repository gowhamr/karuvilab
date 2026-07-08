"use client";

import React from "react";
import Script from "next/script";
import { EngineLoader } from "@/components/system/EngineLoader";
import { MarkdownEditor } from "./components/MarkdownEditor";
import "./markdown.css";

export default function MarkdownEditorWrapper() {
  const checkInit = () => {
    return typeof window !== 'undefined' && typeof (window as any).mermaid !== 'undefined' && typeof (window as any).hljs !== 'undefined';
  };

  const isGithubPages = typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/karuvilab'));
  const basePath = isGithubPages ? '/karuvilab' : '';

  return (
    <>
      <link rel="stylesheet" id="hljs-style" href={`${basePath}/lib/markdown/github.min.css`} />
      
      <Script 
        src={`${basePath}/lib/markdown/highlight.min.js`} 
        strategy="lazyOnload"
      />
      
      <Script 
        src={`${basePath}/lib/markdown/mermaid.min.js`} 
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).mermaid) {
            try {
              (window as any).mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
                securityLevel: 'loose',
              });
            } catch (e) {
              console.error("Mermaid init error:", e);
            }
          }
        }}
      />
      
      <EngineLoader 
        checkInit={checkInit}
        loadingMessage="Initializing Markdown Engine..."
      >
        <MarkdownEditor />
      </EngineLoader>
    </>
  );
}
