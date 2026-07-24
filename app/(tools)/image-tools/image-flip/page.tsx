import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ImageFlipClientWrapper from './ImageFlipClientWrapper';

const toolId = 'image-flip';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Flip"
      description="Flip images horizontally, vertically, or both directions instantly"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Our Image Flip tool allows you to instantly mirror images horizontally or vertically in your browser. With no server uploads, it ensures complete privacy. Perfect for designers correcting orientation or creating symmetric patterns.",
        useCases: ["Correcting selfie orientation","Creating mirrored design elements","Fixing upside-down photos","Preparing textures for symmetry","Batch flipping images offline"],
        howTo: ["Click or drag an image into the drop zone.","Select the direction: Horizontal, Vertical, or Both.","Preview the flipped result instantly.","Choose your output format (PNG, JPEG, WebP).","Click Download to save the flipped image."],
        faq: [{"question":"Are my images uploaded to any server?","answer":"No. The flipping process happens entirely within your browser using the local Canvas API."},{"question":"Can I flip multiple images at once?","answer":"Currently, this tool flips one image at a time. Use our Batch Processor for multiple images."},{"question":"Does flipping reduce image quality?","answer":"No, flipping is a lossless structural operation, though format conversion might apply minor compression depending on your settings."},{"question":"Is this tool free?","answer":"Yes, KaruviLab tools are completely free and work offline."},{"question":"What formats are supported?","answer":"You can upload JPEG, PNG, WebP, GIF, and SVG, and export as PNG, JPEG, or WebP."}],
        relatedTools: ["image-mirror","advanced-rotate","canvas-resize"]
      }}
>
      <ImageFlipClientWrapper />
    </ToolShell>
  );
}
