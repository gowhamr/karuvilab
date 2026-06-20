import { useEffect } from 'react';
import { useWorkflowStore } from '@/src/store/useWorkflowStore';

export function useWorkflowInput(
  onFiles?: (files: File[]) => void,
  onText?: (text: string) => void
) {
  useEffect(() => {
    const activeItems = useWorkflowStore.getState().activeItems;
    if (activeItems.length > 0) {
      let handled = false;
      const files: File[] = [];

      for (const item of activeItems) {
        if (item.blob && onFiles) {
          files.push(new File([item.blob], item.name, { type: item.blob.type }));
          handled = true;
        } else if (item.text && onText) {
          onText(item.text);
          handled = true;
          break; // Usually text tools take one input at a time
        }
      }

      if (files.length > 0 && onFiles) {
        onFiles(files);
      }

      if (handled) {
        useWorkflowStore.getState().clearWorkflow();
      }
    }
  }, [onFiles, onText]);
}
