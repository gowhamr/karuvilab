import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageCropClientWrapper from './ImageCropClientWrapper';

const toolId = 'image-crop';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Crop"
      description="Crop images to exact dimensions or preset aspect ratios."
      category={cat}
      toolId={toolId}
    >
      <ImageCropClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-drawimage"
          title="How it Works: Source vs Destination Coordinates"
          preview="Learn the 9-parameter canvas drawing API used to crop images."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Cropping an image in the browser doesn't actually delete data from the original file; instead, it paints a specific section of the original image onto a brand new, smaller Canvas.
            </p>
            <h3>The 9-Parameter API</h3>
            <p>
              To do this, the tool uses the 9-parameter version of the HTML5 Canvas <code>drawImage</code> API:
            </p>
            <pre><code>ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)</code></pre>
            <p>
              When you drag the crop box, you are defining the <strong>Source Coordinates</strong> (<code>sx, sy, sWidth, sHeight</code>). This tells the browser exactly which rectangle of pixels to "cut out" of the original image.
            </p>
            <p>
              It then paints those pixels onto the new canvas at the <strong>Destination Coordinates</strong> (usually starting at <code>0, 0</code>). The resulting canvas is then encoded into a new JPG or PNG file.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
