// src/tool-engine/hooks/useAnalytics.ts
import { useEffect, useRef } from "react";
import { useAnalyticsStore } from "@/src/store/analyticsStore";

export function useAnalytics(toolId: string) {
  const { recordView, recordEngagement, recordConversion, recordBounce } = useAnalyticsStore();
  const hasEngaged = useRef(false);
  const viewRecorded = useRef(false);

  const trackView = () => {
    if (!viewRecorded.current) {
      recordView(toolId);
      viewRecorded.current = true;
    }
  };

  const trackEngagement = () => {
    if (!hasEngaged.current) {
      recordEngagement(toolId);
      hasEngaged.current = true;
    }
  };

  const trackConversion = () => {
    recordConversion(toolId);
  };

  useEffect(() => {
    const handleExit = () => {
      if (viewRecorded.current && !hasEngaged.current) {
        recordBounce(toolId);
      }
    };
    window.addEventListener("pagehide", handleExit);
    return () => {
      handleExit();
      window.removeEventListener("pagehide", handleExit);
    };
  }, [toolId, recordBounce]);

  return { trackView, trackEngagement, trackConversion };
}
