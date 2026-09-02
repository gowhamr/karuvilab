"use client";

import React, { useEffect, useState } from "react";
import { loader, useMonaco } from "@monaco-editor/react";
import { configureMonacoLoader } from "./MonacoLoader";
import { configureMonacoWorkers } from "./MonacoWorkers";
import { defineMonacoThemes } from "./MonacoTheme";
import { configureJsonLanguageService } from "./schemas";
import { configureLanguageDefaults } from "./MonacoLanguages";
import { configureMermaidLanguage } from "./MonacoMermaid";

// Configure the loader immediately with dynamic base path detection
configureMonacoLoader();
configureMonacoWorkers();

export function MonacoProvider({ children }: { children: React.ReactNode }) {
  const monaco = useMonaco();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (monaco) {
      // Define our KaruviLab themes
      defineMonacoThemes(monaco);
      // Initialize Language Services
      configureJsonLanguageService(monaco);
      configureLanguageDefaults(monaco);
      configureMermaidLanguage(monaco);
      
      setIsReady(true);
    }
  }, [monaco]);

  // We render children immediately because @monaco-editor/react handles its own loading state.
  // But we can wrap it if we need to provide context. For now, it's a simple lifecycle wrapper.
  return <>{children}</>;
}
