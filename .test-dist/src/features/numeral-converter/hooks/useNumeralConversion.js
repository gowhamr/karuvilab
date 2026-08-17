import { useState, useEffect } from 'react';
import { useDebounce } from '@/src/hooks/useDebounce';
export function useNumeralConversion(inputValue, fromFormat, toFormat, options) {
    const [result, setResult] = useState({ output: '', error: '' });
    const [isConverting, setIsConverting] = useState(false);
    const debouncedInput = useDebounce(inputValue, 400);
    useEffect(() => {
        // ... extraction of conversion logic from useEffect ...
    }, [debouncedInput, fromFormat, toFormat, options]);
    return { ...result, isConverting };
}
