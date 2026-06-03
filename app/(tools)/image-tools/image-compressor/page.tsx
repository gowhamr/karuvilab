import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageCompressorClientWrapper from './ImageCompressorClientWrapper';

const toolId = 'image-compress';
const cat = CATEGORIES.find(c => c.id === 'image')!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ImageCompressorPage() {
  return (
    <ToolShell
      title="Image Compressor"
      description="Professional-grade image optimization suite. Lossless compression, batch processing, and format conversion — all 100% private in your browser."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Professional-grade image optimization suite. Lossless compression, batch processing, and format conversion — all 100% private in your browser. All image processing happens entirely within your browser using Web Workers and OffscreenCanvas. No image data is ever uploaded to our servers. Your privacy is 100% guaranteed as everything stays local to your device.",
        useCases: [
          "Optimizing website assets for faster load times",
          "Reducing attachment sizes for emails and messaging",
          "Converting images to next-gen formats like WebP and AVIF",
          "Batch resizing large photo collections",
          "Creating privacy-conscious previews without server uploads"
        ],
        howTo: [
          "Upload a single image or switch to 'Batch' mode for multiple files.",
          "Choose your desired output format (JPEG, PNG, WebP, or AVIF).",
          "Adjust the quality slider (lossy) or enable lossless mode.",
          "Preview the estimated file size and quality before processing.",
          "Click 'Download' for single items or 'Download ZIP' for batches."
        ],
        faq: [
          {
            question: "How does your image compressor protect my privacy?",
            answer: "All image processing happens entirely within your browser using Web Workers and OffscreenCanvas. No image data is ever uploaded to our servers. Your privacy is 100% guaranteed as everything stays local to your device."
          },
          {
            question: "What’s the difference between lossy and lossless compression?",
            answer: "Lossy compression (like JPEG) removes some image data to significantly reduce file size, which might slightly affect quality. Lossless compression (available for PNG) reduces file size without any quality loss by using more efficient encoding."
          },
          {
            question: "Can I compress multiple images at once?",
            answer: "Yes! Use our 'Batch' mode to drag and drop multiple images. You can apply global settings or adjust them individually, then download all compressed files as a single ZIP."
          },
          {
            question: "Which format gives the best compression?",
            answer: "WebP and AVIF generally provide much better compression than JPEG or PNG while maintaining high visual quality. AVIF is the most modern and efficient format."
          }
        ],
        relatedTools: ["image-converter", "image-resizer", "bg-remover"]
      }}
    >
      <ImageCompressorClientWrapper />
    </ToolShell>
  );
}
