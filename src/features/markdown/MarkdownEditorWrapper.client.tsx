"use client";

import React from "react";
import Script from "next/script";
import { EngineLoader } from "@/components/system/EngineLoader";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { configureMonacoLoader } from "@/src/core/monaco/MonacoLoader";
import { logger } from "@/src/lib/logger";
import "./markdown.css";

configureMonacoLoader();

export default function MarkdownEditorWrapper() {
  const checkInit = () => {
    return typeof window !== 'undefined' && typeof (window as any).hljs !== 'undefined';
  };

  const isGithubPages = typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/karuvilab'));
  const basePath = isGithubPages ? '/karuvilab' : '';

  return (
    <>
      <link rel="stylesheet" id="hljs-style" href={`${basePath}/lib/markdown/github.min.css`} />
      
      <Script 
        src={`${basePath}/lib/markdown/highlight.min.js`} 
        strategy="afterInteractive"
      />
      
      <EngineLoader 
        checkInit={checkInit}
        loadingMessage="Initializing Markdown Engine..."
        errorMessage="Failed to load Markdown engine. Check your connection and retry."
      >
        <MarkdownEditor />
      </EngineLoader>
    </>
  );
}
