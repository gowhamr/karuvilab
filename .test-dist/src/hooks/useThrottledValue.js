import { useState, useEffect, useRef } from 'react';
/**
 * Throttles a value to be updated at most once per limit ms.
 */
export function useThrottledValue(value, limit) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastUpdated = useRef(0);
    useEffect(() => {
        const now = Date.now();
        const elapsed = now - lastUpdated.current;
        if (elapsed >= limit) {
            setThrottledValue(value);
            lastUpdated.current = now;
        }
        else {
            const timer = setTimeout(() => {
                setThrottledValue(value);
                lastUpdated.current = Date.now();
            }, limit - elapsed);
            return () => clearTimeout(timer);
        }
    }, [value, limit]);
    return throttledValue;
}
