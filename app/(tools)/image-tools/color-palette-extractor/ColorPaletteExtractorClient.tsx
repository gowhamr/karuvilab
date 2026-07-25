"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { workerOrchestrator } from '@/src/engine/workers/WorkerOrchestrator';
import { DropZone } from '@/components/ui/DropZone';
import { CopyButton } from '@/components/ui/CopyButton';
import { useObjectUrlManager } from '@/src/lib/hooks';
import { Image as ImageIcon, Loader, Palette } from 'lucide-react';
import { m } from 'framer-motion';

export default function ColorPaletteExtractorClient() {
  const [palette, setPalette] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ percent: number; message?: string }>({ percent: 0, message: '' });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);
    setPalette([]);
    if (imageUrl) revokeUrl(imageUrl);
    const url = createUrl(file);
    setImageUrl(url);

    try {
      const buffer = await file.arrayBuffer();
      const colors = await workerOrchestrator.run<string[]>(
        'extractColorPalette',
        [buffer, 5],
        [buffer],
        (p) => setProgress(p),
        abortController.signal
      );
      setPalette(colors);
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      setError(e.message || 'Failed to extract colors.');
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, createUrl, revokeUrl]);

  return (
    <div className="space-y-8">
      <DropZone onFilesSelected={(files) => handleFile(files[0])} accept="image/*" />

      {isLoading && (
        <div className="text-center">
          <Loader className="animate-spin inline-block mb-2" />
          <p className="text-sm font-bold text-text-3">{progress.message} ({progress.percent}%)</p>
        </div>
      )}
      
      {error && <p className="text-center text-red-500">{error}</p>}

      {imageUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <img src={imageUrl} alt="Preview" className="rounded-2xl shadow-lg w-full h-auto object-contain" />
          </m.div>
          
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue"/>
                <h2 className="text-lg font-bold">Extracted Palette</h2>
             </div>
            {palette.length > 0 && (
              <m.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {palette.map((color, idx) => (
                  <div key={`${color}-${idx}`} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                    <div
                      className="w-10 h-10 rounded-md border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <div className="font-mono text-sm">{color}</div>
                    <CopyButton text={color} />
                  </div>
                ))}
              </m.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
