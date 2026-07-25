import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import BgRemoverClientWrapper from './BgRemoverClientWrapper';

const toolId = 'bg-remover';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Background Remover"
      description="Remove solid or near-solid backgrounds from images using color threshold matching."
      category={cat}
      toolId={toolId}
    >
      <BgRemoverClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-chroma"
          title="How it Works: Flood-Fill and Tolerance"
          preview="Learn the math behind 'magic wand' background removal."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              This tool doesn't use massive AI neural networks; it uses a classic computer vision algorithm called <strong>Flood-Fill</strong>. 
            </p>
            <h3>Color Distance</h3>
            <p>
              When you pick a background color to remove, the algorithm looks at the RGB values of that pixel. It then searches neighboring pixels. If the neighbor's color is within the <em>Tolerance</em> range (calculated using 3D Euclidean distance in the RGB color space), it sets the pixel's Alpha channel to 0 (transparent).
            </p>
            <p>
              This is why this tool works instantly entirely in your browser—it's executing simple math on a Canvas array, unlike AI models that require downloading 100MB+ models or uploading your photo to a cloud server.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
