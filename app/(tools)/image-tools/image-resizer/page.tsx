import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageResizerClientWrapper from './ImageResizerClientWrapper';

const toolId = 'image-resizer';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Resizer"
      description="Resize images to exact dimensions with aspect ratio lock."
      category={cat}
      toolId={toolId}
    >
      <ImageResizerClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-resizing"
          title="How it Works: Image Interpolation"
          preview="Learn how computers invent new pixels when you enlarge an image."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you take a 100x100 pixel image and resize it to 200x200, the computer has to invent 30,000 brand new pixels that didn't exist before. It does this using mathematical algorithms called <strong>Interpolation</strong>.
            </p>
            <h3>Bicubic Interpolation</h3>
            <p>
              By default, browsers use high-quality algorithms like <em>Bicubic</em> interpolation. To guess what color a new pixel should be, it looks at the 16 surrounding pixels (a 4x4 grid) from the original image and calculates a weighted average. This is why resized images often look smooth but can sometimes appear slightly blurry.
            </p>
            <h3>Nearest Neighbor</h3>
            <p>
              For pixel art, smoothing ruins the image. In those cases, you use <em>Nearest Neighbor</em> interpolation, which doesn't do any math at all—it simply duplicates the exact color of the closest original pixel, keeping edges perfectly sharp.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
