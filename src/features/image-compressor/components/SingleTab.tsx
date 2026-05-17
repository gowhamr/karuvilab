import React from 'react';
import { useImageCompressStore } from '../hooks/useImageCompressStore';
import { DropZone } from '@/components/ui/DropZone';
import { SettingsPanel } from './SettingsPanel';
import { ComparisonView } from './ComparisonView';
import { batchCoordinator } from '@/src/workers/batch-coordinator';
import { Loader2 } from 'lucide-react';
import { blobManager } from '@/src/lib/blob-manager';
import { safeImageProcess } from '../utils/safe-process';

export const SingleTab: React.FC = () => {
  const { items, addFiles, setItemStatus, setItemResult, setItemError, isProcessing, setIsProcessing } = useImageCompressStore();
  const activeItem = items[0];

  const handleFiles = (files: File[] | FileList) => {
    const fileArray = files instanceof FileList ? Array.from(files) : files;
    addFiles(fileArray);
  };

  const handleCompress = async () => {
    if (!activeItem) return;

    setIsProcessing(true);
    setItemStatus(activeItem.id, 'processing', 0);

    const result = await safeImageProcess(async () => {
      const buffer = await activeItem.file.arrayBuffer();
      const resultBytes = await batchCoordinator.enqueue(
        buffer,
        activeItem.settings,
        (p) => setItemStatus(activeItem.id, 'processing', p.percent)
      );

      const blob = new Blob([resultBytes as any], { type: activeItem.settings.format });
      const url = blobManager.create(blob);
      return { blob, url };
    }, 'image-compress-single');

    if (result.success && result.data) {
      setItemResult(activeItem.id, result.data.blob, result.data.url);
    } else {
      setItemError(activeItem.id, result.error?.message || 'Compression failed');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-6">
        {!activeItem ? (
          <DropZone
            onFilesSelected={handleFiles}
            accept="image/*"
            title="Choose an image"
            description="Drag and drop or click to upload. JPEG, PNG, WebP, AVIF."
            maxSize={50 * 1024 * 1024}
            className="aspect-video"
          />
        ) : (
          <div className="space-y-6">
            <ComparisonView
              originalUrl={activeItem.previewUrl}
              compressedUrl={activeItem.compressedUrl}
              originalSize={activeItem.originalSize}
              compressedSize={activeItem.compressedSize}
              originalName={activeItem.file.name}
              onDownload={() => {
                if (activeItem.compressedUrl) {
                  const a = document.createElement('a');
                  a.href = activeItem.compressedUrl;
                  a.download = `compressed-${activeItem.file.name}`;
                  a.click();
                }
              }}
            />

            {activeItem.status === 'error' && (
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-[32px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <Loader2 className="w-6 h-6 rotate-45" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-red-600 mb-1">Compression Failed</h4>
                  <p className="text-[11px] font-bold text-red-500/80 uppercase leading-relaxed">
                    {activeItem.error || "An unexpected error occurred. Please try a different format or smaller image."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-4 space-y-6">
        <SettingsPanel isGlobal={true} />
        
        <button
          onClick={handleCompress}
          disabled={!activeItem || isProcessing}
          className="w-full py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Processing...
            </>
          ) : (
            'Compress Image'
          )}
        </button>
      </div>
    </div>
  );
};
