import { useEffect, useRef, useCallback } from "react";
import { debounce } from "@/src/utils";
import { AUTO_SAVE_DELAY } from "../constants";

export function useAutoSave<T>(data: T, onSave: (data: T) => void, delay: number = AUTO_SAVE_DELAY) {
  const onSaveRef = useRef(onSave);
  
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const debouncedSave = useCallback(
    debounce((d: any) => {
      onSaveRef.current(d as T);
    }, delay),
    [delay]
  );

  useEffect(() => {
    debouncedSave(data);
  }, [data, debouncedSave]);
}
