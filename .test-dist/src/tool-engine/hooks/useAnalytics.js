// src/tool-engine/hooks/useAnalytics.ts
import { useEffect, useRef } from "react";
import { useAnalyticsStore } from "@/src/store/analyticsStore";
export function useAnalytics(toolId) {
    const recordView = useAnalyticsStore(s => s.recordView);
    const recordEngagement = useAnalyticsStore(s => s.recordEngagement);
    const recordConversion = useAnalyticsStore(s => s.recordConversion);
    const recordBounce = useAnalyticsStore(s => s.recordBounce);
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
