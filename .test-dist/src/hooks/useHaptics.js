"use client";
import { useCallback } from "react";
export function useHaptics() {
    const trigger = useCallback((type = "light") => {
        if (typeof navigator === "undefined" || !navigator.vibrate)
            return;
        try {
            switch (type) {
                case "light":
                    navigator.vibrate(10);
                    break;
                case "medium":
                    navigator.vibrate(15);
                    break;
                case "heavy":
                    navigator.vibrate(25);
                    break;
                case "success":
                    navigator.vibrate([10, 30, 20]);
                    break;
                case "error":
                    navigator.vibrate([20, 40, 20, 40, 30]);
                    break;
            }
        }
        catch (e) {
            // Ignore vibration errors
        }
    }, []);
    return trigger;
}
