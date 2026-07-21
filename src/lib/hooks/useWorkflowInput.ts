import { useEffect, useRef } from 'react';
import { useWorkflowStore } from '@/src/store/useWorkflowStore';

/**
 * Consumes workflow items (files/text) from the workflow store on mount.
 * Uses refs to avoid re-triggering when callback references change.
 * Consumes only once per component lifecycle.
 */
export function useWorkflowInput(
  onFiles?: (files: File[]) => void,
  onText?: (text: string) => void
) {
  // Store callbacks in refs to prevent re-triggering the effect
  // when the parent re-renders with a new callback reference
  const onFilesRef = useRef(onFiles);
  const onTextRef = useRef(onText);
  // Track whether we've already consumed workflow items in this mount cycle
  const hasConsumedRef = useRef(false);

  // Keep refs up-to-date on every render
  onFilesRef.current = onFiles;
  onTextRef.current = onText;

  // Consume workflow items once on mount.
  // Refs don't need to be listed as deps — they are stable objects.
  // hasConsumedRef gates re-execution even in StrictMode double-mount.
  useEffect(() => {
    if (hasConsumedRef.current) return;

    const activeItems = useWorkflowStore.getState().activeItems;
    if (activeItems.length === 0) return;

    let handled = false;
    const files: File[] = [];

    for (const item of activeItems) {
      if (item.blob && onFilesRef.current) {
        files.push(new File([item.blob], item.name, { type: item.blob.type }));
        handled = true;
      } else if (item.text && onTextRef.current) {
        onTextRef.current(item.text);
        handled = true;
        break;
      }
    }

    if (files.length > 0 && onFilesRef.current) {
      onFilesRef.current(files);
    }

    if (handled) {
      hasConsumedRef.current = true;
      useWorkflowStore.getState().clearWorkflow();
    }
  }, [onFilesRef, onTextRef, hasConsumedRef]);
}
