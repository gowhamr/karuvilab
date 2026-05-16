import React from 'react';
import { useImageCompressStore } from '../hooks/useImageCompressStore';
import { DropZone } from '@/components/ui/DropZone';
import { SettingsPanel } from './SettingsPanel';
import { ImageQueue } from './ImageQueue';
import { batchCoordinator } from '@/src/workers/batch-coordinator';
import { createZip, downloadBlob } from '@/src/lib/zip';
import { LoaderCircle, Download, Trash2, Zap } from 'lucide-react';
import { blobManager } from '@/src/lib/blob-manager';

export const BatchTab: React.FC = () => {
  const { items, addFiles, clearFiles, setItemStatus, setItemResult, setItemError, isProcessing, setIsProcessing } = useImageCompressStore();

  const handleFiles = (files: File[] | FileList) => {
    const fileArray = files instanceof FileList ? Array.from(files) : files;
    addFiles(fileArray);
  };

  const compressAll = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    
    const toProcess = items.filter(item => item.status !== 'completed');
    
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const CONCURRENCY_LIMIT = isMobile ? 2 : 3;
    
    const queue = [...toProcess];
    const processItem = async (item: typeof items[0]) => {
      try {
        setItemStatus(item.id, 'processing', 0);
        const buffer = await item.file.arrayBuffer();
        const resultBytes = await batchCoordinator.enqueue(
          buffer,
          item.settings,
          (p) => setItemStatus(item.id, 'processing', p.percent)
        );

        const blob = new Blob([resultBytes as any], { type: item.settings.format });
        const url = blobManager.create(blob);
        setItemResult(item.id, blob, url);
      } catch (error: any) {
        setItemError(item.id, error.message || 'Failed');
      }
    };

    const workers = Array.from({ length: CONCURRENCY_LIMIT }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item) await processItem(item);
      }
    });

    await Promise.all(workers);
    setIsProcessing(false);
  };

  const downloadAllAsZip = async () => {
    const completedItems = items.filter(i => i.status === 'completed' && i.compressedBlob);
    if (completedItems.length === 0) return;

    try {
      setIsProcessing(true);
      
      const files: Record<string, Blob> = {};
      for (const item of completedItems) {
        const ext = item.settings.format.split('/')[1];
        const name = item.file.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`;
        files[name] = item.compressedBlob!;
      }

      const zipBlob = await createZip(files);
      downloadBlob(zipBlob, `karuvilab-compressed-${Date.now()}.zip`);
    } catch (error) {
      console.error("ZIP generation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-6">
        <DropZone
          onFilesSelected={handleFiles}
          accept="image/*"
          multiple
          title="Drop images here"
          description="Batch mode active. Process up to 100 images at once."
          maxSize={25 * 1024 * 1024}
        />

        <ImageQueue />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-6 space-y-4">
          <SettingsPanel isGlobal={true} />
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={compressAll}
              disabled={items.length === 0 || isProcessing}
              className="col-span-2 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Compress All
                </>
              )}
            </button>

            <button
              onClick={downloadAllAsZip}
              disabled={!items.some(i => i.status === 'completed') || isProcessing}
              className="py-3 bg-surface border border-border text-text-2 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:border-blue hover:text-blue transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download size={14} />
              ZIP All
            </button>

            <button
              onClick={clearFiles}
              disabled={items.length === 0 || isProcessing}
              className="py-3 bg-surface border border-border text-red-500 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:border-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
