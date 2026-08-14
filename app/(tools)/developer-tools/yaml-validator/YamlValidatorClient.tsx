"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { workerOrchestrator } from '@/src/engine/workers/WorkerOrchestrator';
import { ToolWorkspace } from '@/components/ui/ToolWorkspace';
import { ToolInput } from '@/components/ui/ToolInput';
import { ToolResultArea } from '@/components/ui/ToolResultArea';
import { Loader2 } from 'lucide-react';

type Action = 'validate' | 'json_to_yaml' | 'yaml_to_json';

export default function YamlValidatorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Action>('validate');
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
        setMode('json_to_yaml');
        handleProcess('json_to_yaml', decoded);
      } catch (e) {
        console.error("Failed to decode URL input:", e);
      }
    }
  }, [searchParams, handleProcess]);

  return (
    <ToolWorkspace
      tabs={{
        activeId: mode,
        onChange: (t) => {
          setMode(t as Action);
          setOutput('');
          setError('');
        },
        options: [
          { id: 'validate', label: 'Validate YAML' },
          { id: 'yaml_to_json', label: 'YAML to JSON' },
          { id: 'json_to_yaml', label: 'JSON to YAML' },
        ],
      }}
      input={
        <ToolInput
          label="Input (YAML or JSON)"
          value={input}
          onChange={(v) => {
            setInput(v);
            if (error) setError('');
          }}
          placeholder="Paste your YAML or JSON here..."
          rows={15}
          mono
        />
      }
      optionsPanel={
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleProcess(mode)}
            disabled={isLoading || !input.trim()}
            className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-blue/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Process'
            )}
          </button>
        </div>
      }
      output={
        <ToolResultArea
          label="Output / Result"
          value={output}
          error={error}
          language={
            mode === 'yaml_to_json' ? 'JSON' : mode === 'json_to_yaml' ? 'YAML' : undefined
          }
          onClear={() => {
            setInput('');
            setOutput('');
            setError('');
          }}
        />
      }
    />
  );
}
