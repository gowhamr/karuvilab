"use client";

import { useEffect, useRef, useState } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { useBatchStore } from '../store/useBatchStore';
import { findToolById, DataType } from '../tool-registry';

export function useWorkflowIntegration(toolId: string) {
  const { activeItems, clearWorkflow } = useWorkflowStore();
  const { addItems, items } = useBatchStore();
  const [suggestedText, setSuggestedText] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    if (activeItems.length === 0) return;

    const tool = findToolById(toolId);
    if (!tool || !tool.input) return;

    const inputTypes = Array.isArray(tool.input) ? tool.input : [tool.input];
    
    // 1. Handle File-based items
    const compatibleFiles = activeItems.filter(item => 
      item.blob && (inputTypes.includes(item.type) || inputTypes.includes('any-file'))
    );

    if (compatibleFiles.length > 0) {
      const currentFiles = items[toolId] || [];
      const alreadyLoaded = compatibleFiles.every(ci => 
        currentFiles.some(cf => cf.file.name === ci.name && cf.file.size === ci.blob?.size)
      );

      if (!alreadyLoaded) {
        const files = compatibleFiles
          .filter(ci => ci.blob)
          .map(ci => new File([ci.blob!], ci.name, { type: ci.blob!.type }));
        
        addItems(toolId, files);
        loadedRef.current = true;
      }
    }

    // 2. Handle Text-based items
    const compatibleText = activeItems.find(item => 
      item.text && (inputTypes.includes(item.type) || (item.type === 'text' && inputTypes.includes('text')))
    );

    if (compatibleText && !loadedRef.current) {
      setSuggestedText(compatibleText.text!);
      loadedRef.current = true;
    }
  }, [toolId, activeItems, addItems, items]);

  return { activeItems, suggestedText };
}
