import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
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
    </ToolShell>
  );
}