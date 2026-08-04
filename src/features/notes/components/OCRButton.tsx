import React, { useRef, useState } from 'react';
import { ScanText, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { workerManager } from '@/src/workers/manager';

interface OCRButtonProps {
  onResult: (text: string) => void;
}

export function OCRButton({ onResult }: OCRButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    abortControllerRef.current = new AbortController();
    toast("Starting text extraction from image...", "info");

    try {
      const buffer = await file.arrayBuffer();
      
      // Load model & verify checksum via KaruviLab AI SDK
      const { ai } = await import('@/src/ai/sdk');
      const imgBitmap = await createImageBitmap(file);

      const result = await ai.runOcrPipeline({
        model: 'ocr-paddle',
        imageBitmap: imgBitmap,
        abortSignal: abortControllerRef.current.signal
      });

      const text = result.fullText;

      if (text) {
        onResult(text);
        toast("Text extracted successfully!", "success");
      } else {
        toast("No text could be found in the image.", "warn");
      }
    } catch (err: any) {
      if (err.message === 'Task cancelled' || err.message === 'Task aborted') {
        toast("OCR text extraction cancelled.", "info");
      } else {
        console.error("OCR Error:", err);
        toast("Failed to extract text from image.", "error");
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (isProcessing) {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        onClick={handleClick}
        className={cn(
          "p-2 rounded-xl backdrop-blur-md transition-all",
          isProcessing 
            ? "bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20" 
            : "bg-surface/50 border border-border text-text-muted hover:text-text hover:bg-surface"
        )}
        title={isProcessing ? "Cancel OCR extraction" : "Extract text from image (OCR)"}
      >
        {isProcessing ? (
          <div className="relative flex items-center justify-center">
            <Loader2 size={16} className="animate-spin opacity-30 absolute" />
            <div className="w-1.5 h-1.5 bg-red-500 rounded-sm" />
          </div>
        ) : (
          <ScanText size={16} />
        )}
      </button>
    </>
  );
}
