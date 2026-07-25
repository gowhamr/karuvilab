import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import ClientWrapper from './ClientWrapper';

const toolId = 'image-watermark';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Watermark"
      description="Add text or image watermarks to multiple photos securely offline."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Protect your intellectual property by applying customizable text or image watermarks directly in your browser. This tool handles batch processing effortlessly, letting you watermark hundreds of images instantly without waiting for slow server uploads.",
        useCases: ["Protecting portfolio images", "Branding social media posts", "Watermarking e-commerce product photos", "Batch applying company logos", "Adding copyright notices"],
        howTo: ["Upload one or more images into the secure drop zone.", "Select whether you want to apply a Text or Image watermark.", "Customize the font, size, opacity, position, and margins.", "Click 'Apply Watermark' to process them instantly via Web Workers.", "Download the watermarked images individually or as a batch."],
        faq: [
          { question: "Are my images uploaded to a server?", answer: "No, all watermarking is strictly processed locally on your device using WebAssembly and OffscreenCanvas." },
          { question: "Can I watermark multiple images at once?", answer: "Yes, this tool fully supports batch processing." },
          { question: "Can I use a custom logo?", answer: "Absolutely. Select the 'Image' mode and upload a transparent PNG of your logo." }
        ],
        relatedTools: ["batch-image-converter", "image-resizer", "image-crop"]
      }}
    >
      <ClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-alpha"
          title="How it Works: Global Alpha Compositing"
          preview="Learn how browsers calculate transparency when overlapping images."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When applying a watermark, you usually want it to be slightly see-through (e.g., 50% opacity) so it doesn't completely destroy the underlying image. But how does the computer calculate "see-through"?
            </p>
            <h3>Alpha Blending Math</h3>
            <p>
              Every pixel has Red, Green, Blue, and Alpha (transparency) values. When you use the HTML5 Canvas <code>globalAlpha = 0.5</code> property and draw a watermark over a photo, the browser executes the standard Alpha Blending formula for every single overlapping pixel:
            </p>
            <pre><code>Final_Color = (Watermark_Color * 0.5) + (Photo_Color * (1.0 - 0.5))</code></pre>
            <p>
              It mathematically averages the overlapping colors in real-time. Because doing this on a 20-megapixel photo requires millions of calculations, we execute this off the main thread using an <code>OffscreenCanvas</code> inside a Web Worker.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}