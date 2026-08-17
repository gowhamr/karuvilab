import { useEffect, useRef } from "react";
import { AUTO_SAVE_DELAY } from "../constants";
export function useAutoSave(data, onSave, delay = AUTO_SAVE_DELAY) {
    const onSaveRef = useRef(onSave);
    useEffect(() => {
        onSaveRef.current = onSave;
    }, [onSave]);
    useEffect(() => {
        const timer = setTimeout(() => {
            onSaveRef.current(data);
        }, delay);
        return () => clearTimeout(timer);
    }, [data, delay]);
}
