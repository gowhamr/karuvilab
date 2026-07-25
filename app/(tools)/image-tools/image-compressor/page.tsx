import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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
        detailedDescription: "Professional-grade image optimization suite. Lossless compression, batch processing, and format conversion — all 100% private in your browser. All image processing happens entirely within your browser using Web Workers and OffscreenCanvas. No image data is ever uploaded to our servers. Zero-Disk Architecture ensures images are processed exclusively in browser memory and never uploaded. References are cleared immediately on removal, though JavaScript cannot guarantee instant physical memory erasure — full clearing depends on the browser's garbage collector.",
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
            answer: "We use a Zero-Disk Architecture: Images are processed exclusively in browser memory and never uploaded. References are cleared immediately on removal, though JavaScript cannot guarantee instant physical memory erasure — full clearing depends on the browser's garbage collector."
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-compression"
          title="How it Works: Lossy vs Lossless Encoding"
          preview="Learn how algorithms throw away data your eyes can't see."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              An uncompressed 4K image contains over 8 million pixels. Storing the exact RGB value for every single pixel takes about 25 Megabytes of data. Compression reduces this footprint.
            </p>
            <h3>Lossy Compression (JPEG / WebP)</h3>
            <p>
              Lossy algorithms exploit human biology. The human eye is much more sensitive to changes in brightness (luma) than color (chroma). Algorithms like JPEG use <strong>Chroma Subsampling</strong> to average out the color of neighboring pixels, effectively throwing away data you wouldn't notice anyway. It then uses the <strong>Discrete Cosine Transform (DCT)</strong> to group pixels into 8x8 frequency blocks.
            </p>
            <h3>Lossless Compression (PNG)</h3>
            <p>
              Lossless compression never throws away visual data. Instead, it uses mathematical techniques (like <strong>Deflate</strong> or <strong>LZ77</strong>) to find repeating patterns. If a completely white background has 1,000 identical white pixels in a row, the algorithm just writes <em>"repeat white 1,000 times"</em> instead of saving 1,000 individual pixels.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
