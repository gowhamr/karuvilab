import { useState, useEffect } from 'react';
import type { ToolEntry } from '@/src/tool-registry';

let registryCache: ToolEntry[] | null = null;
let registryPromise: Promise<ToolEntry[]> | null = null;

export function useToolRegistry() {
  const [tools, setTools] = useState<ToolEntry[]>(registryCache || []);

  useEffect(() => {
    if (registryCache) return;
    if (!registryPromise) {
      // Dynamically import the core tools to prevent bundle bloat
      registryPromise = import('@/src/registry/core-registry').then(m => {
        registryCache = m.CORE_TOOLS;
        return m.CORE_TOOLS;
      });
    }
    registryPromise.then(res => {
      setTools(res);
    });
  }, []);

  return tools;
}
