import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-scale"
          title="How it Works: Negative Scaling"
          preview="Learn the math trick used to flip an image on a canvas."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The HTML5 Canvas API doesn't actually have a <code>flip()</code> function. To mirror an image, we have to use a mathematical trick with the <code>scale()</code> transformation.
            </p>
            <h3>Flipping Math</h3>
            <p>
              Normally, <code>scale(1, 1)</code> means draw the image at 100% width and 100% height. If we want to flip the image horizontally, we apply <code>scale(-1, 1)</code>. This tells the canvas to draw the image at <strong>negative 100% width</strong>.
            </p>
            <p>
              However, drawing at a negative width means the entire image gets drawn <em>off the left side of the screen</em> (into negative coordinate space). To fix this, we first have to mathematically <code>translate()</code> the origin point of the canvas to the far right edge, and <em>then</em> draw it backwards.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
