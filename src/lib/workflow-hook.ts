"use client";

import { useEffect, useRef, useState } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { useBatchStore } from '../store/useBatchStore';
import { findToolById, DataType } from '../tool-registry';

const EMPTY_ARRAY: any[] = [];

export function useWorkflowIntegration(toolId: string) {
  // We expose activeItems for UI components that might want to display the current chain output,
  // but we NO LONGER auto-feed files from it. Files are explicitly pushed to useBatchStore 
  // via routeToTarget in useWorkflowStore.
  const activeItems = useWorkflowStore(state => state.activeItems); 
  const pendingTextMap = useWorkflowStore(state => state.pendingText);
  const consumePendingText = useWorkflowStore(state => state.consumePendingText);
  
  const [suggestedText, setSuggestedText] = useState<string | null>(null);

  useEffect(() => {
    const text = pendingTextMap[toolId];
    if (text) {
      setSuggestedText(text);
      consumePendingText(toolId);
    }
  }, [toolId, pendingTextMap, consumePendingText]);

  return { activeItems, suggestedText };
}

