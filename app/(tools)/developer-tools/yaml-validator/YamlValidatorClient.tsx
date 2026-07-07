"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { workerOrchestrator } from '@/src/engine/workers/WorkerOrchestrator';
import { CopyButton } from '@/components/ui/CopyButton';
import { AlertTriangle, CheckCircle } from 'lucide-react';

type Action = 'validate' | 'json_to_yaml' | 'yaml_to_json';

export default function YamlValidatorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleProcess = useCallback(async (action: Action, currentInput = input) => {
    if (!currentInput.trim()) {
      setError('Input is empty.');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const result = await workerOrchestrator.run<{ result?: string; error?: string }>(
        'processYaml',
        [currentInput, action]
      );

      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.result || '');
        if (action === 'validate') {
          setOutput('✅ YAML is valid and well-formed.');
        }
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  useEffect(() => {
    const initialInput = searchParams.get('input');
    if (initialInput) {
      try {
        const decoded = decodeURIComponent(initialInput);
        setInput(decoded);
        handleProcess('json_to_yaml', decoded);
      } catch (e) {
        console.error("Failed to decode URL input:", e);
      }
    }
  }, [searchParams, handleProcess]);

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 bg-surface border border-border p-4 rounded-2xl">
        <button
          onClick={() => handleProcess('yaml_to_json')}
          disabled={isLoading}
          className="px-4 py-2 bg-blue text-white font-bold rounded-lg disabled:opacity-50"
        >
          YAML to JSON
        </button>
        <button
          onClick={() => handleProcess('json_to_yaml')}
          disabled={isLoading}
          className="px-4 py-2 bg-blue text-white font-bold rounded-lg disabled:opacity-50"
        >
          JSON to YAML
        </button>
        <button
          onClick={() => handleProcess('validate')}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg disabled:opacity-50"
        >
          Validate YAML
        </button>
      </div>

      {/* Input / Output Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-3">Input (YAML or JSON)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your YAML or JSON here..."
            className="w-full h-96 p-4 bg-surface border border-border rounded-xl font-mono text-sm focus:border-blue outline-none transition-colors"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-3">Output / Result</label>
          <div className="relative w-full h-96 bg-surface border border-border rounded-xl">
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-full p-4 bg-transparent rounded-xl font-mono text-sm outline-none resize-none"
            />
            {output && !error && (
              <div className="absolute top-3 right-3">
                <CopyButton text={output} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Area */}
      <div className="h-16">
        {isLoading && <p className="text-blue">Processing...</p>}
        {error && (
          <div className="flex items-center gap-2 text-error bg-error/10 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-bold">{error}</p>
          </div>
        )}
        {output && !error && (
          <div className="flex items-center gap-2 text-success bg-success/10 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <p className="font-bold">Operation completed successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
}
