import { useState, useEffect, useRef } from 'react';

/**
 * Throttles a value to be updated at most once per limit ms.
 */
export function useThrottledValue<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= limit) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, limit - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}
