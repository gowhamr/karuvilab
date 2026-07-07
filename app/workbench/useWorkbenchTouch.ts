import { useState } from 'react';

interface UseWorkbenchTouchOptions {
  tabs: { id: string }[];
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
}

export function useWorkbenchTouch({ tabs, activeTabId, setActiveTabId }: UseWorkbenchTouchOptions) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0]!.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0]!.clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      if (tabs.length > 1) {
        const currentIndex = tabs.findIndex(t => t.id === activeTabId);
        if (currentIndex === -1) return;
        
        let newIndex = currentIndex;
        if (isLeftSwipe && currentIndex < tabs.length - 1) {
          newIndex = currentIndex + 1; // Next tab
        } else if (isRightSwipe && currentIndex > 0) {
          newIndex = currentIndex - 1; // Prev tab
        }
        
        if (newIndex !== currentIndex) {
          setActiveTabId(tabs[newIndex]!.id);
        }
      }
    }
    setTouchStart(null);
  };

  return { handleTouchStart, handleTouchEnd };
}
