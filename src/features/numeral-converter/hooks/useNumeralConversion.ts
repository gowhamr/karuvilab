import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/src/hooks/useDebounce';
import { workerOrchestrator } from '@/src/engine/workers/WorkerOrchestrator';

export function useNumeralConversion(inputValue: string, fromFormat: string, toFormat: string, options: any) {
  const [result, setResult] = useState({ output: '', error: '' });
  const [isConverting, setIsConverting] = useState(false);
  const debouncedInput = useDebounce(inputValue, 400);

  useEffect(() => {
    // ... extraction of conversion logic from useEffect ...
  }, [debouncedInput, fromFormat, toFormat, options]);

  return { ...result, isConverting };
}
