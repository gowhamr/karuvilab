import React, { useRef, useState } from 'react';
import { ScanText, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface OCRButtonProps {
  onResult: (text: string) => void;
}

export function OCRButton({ onResult }: OCRButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    toast("Starting text extraction from image...", "info");

    try {
      // Dynamically load Tesseract from CDN
      if (!(window as any).Tesseract) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/tesseract.js@v5.0.3/dist/tesseract.min.js';
          script.integrity = 'sha384-5KTRRh2s/UMauLg1EmP0LM9mOjREcgOtVWsQVVSVdaFEOWhFTw7VtuyPShsw+uHg';
          script.crossOrigin = 'anonymous';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const Tesseract = (window as any).Tesseract;
      
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m: any) => {
          // OCR Progress reporting disabled in production
        }
      });

      const ret = await worker.recognize(file);
      await worker.terminate();

      if (ret.data.text) {
        onResult(ret.data.text);
        toast("Text extracted successfully!", "success");
      } else {
        toast("No text could be found in the image.", "warn");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      toast("Failed to extract text from image.", "error");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className={cn(
          "p-2 rounded-xl backdrop-blur-md transition-all",
          isProcessing 
            ? "bg-blue/20 border border-blue/50 text-blue cursor-wait" 
            : "bg-surface/50 border border-border text-text-muted hover:text-text hover:bg-surface"
        )}
        title="Extract text from image (OCR)"
      >
        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <ScanText size={16} />}
      </button>
    </>
  );
}
