import React from 'react';
import { useImageCompressStore } from '../hooks/useImageCompressStore';
import { DropZone } from '@/components/ui/DropZone';
import { SettingsPanel } from './SettingsPanel';
import { ComparisonView } from './ComparisonView';
import { batchCoordinator } from '@/src/workers/batch-coordinator';
import { Loader2 } from 'lucide-react';
import { useObjectUrlManager } from '@/src/lib/hooks';

export const SingleTab: React.FC = () => {
  const { items, addFiles, setItemStatus, setItemResult, setItemError, isProcessing, setIsProcessing } = useImageCompressStore();
  const { createUrl } = useObjectUrlManager();
  const activeItem = items[0];

  const handleFiles = (files: File[] | FileList) => {
    const fileArray = files instanceof FileList ? Array.from(files) : files;
    addFiles(fileArray);
  };

  const handleCompress = async () => {
    if (!activeItem) return;

    try {
      setIsProcessing(true);
      setItemStatus(activeItem.id, 'processing', 0);

      const buffer = await activeItem.file.arrayBuffer();
      const resultBytes = await batchCoordinator.enqueue(
        buffer,
        activeItem.settings,
        (p) => setItemStatus(activeItem.id, 'processing', p.percent)
      );

      const blob = new Blob([resultBytes as any], { type: activeItem.settings.format });
      const url = createUrl(blob);
      setItemResult(activeItem.id, blob, url);
    } catch (error: any) {
      setItemError(activeItem.id, error.message || 'Compression failed');
    } finally {
      setIsProcessing(false);
    }
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
