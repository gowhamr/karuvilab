import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import AdvancedRotateClientWrapper from './AdvancedRotateClientWrapper';

const toolId = 'advanced-rotate';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Advanced Rotate"
      description="Rotate images to any angle with precise degree control"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Rotate your images by precise degrees, not just 90-degree increments. Our Advanced Rotate tool recalculates the canvas bounds to ensure no corners are clipped, executing seamlessly in your browser.",
        useCases: ["Leveling crooked horizons in photos","Creating angled graphic design assets","Fixing skewed scanned documents","Designing dynamic tilted UI elements","Applying micro-rotations to artwork"],
        howTo: ["Upload the image you want to rotate.","Use the slider or input box to set the exact degree of rotation.","Choose a background color for the newly exposed corners.","Preview the expanded bounding box.","Download the correctly oriented image."],
        faq: [{"question":"Will the corners of my image get cut off?","answer":"No, the tool automatically expands the canvas (bounding box) to fit the rotated image perfectly."},{"question":"Can I just do a standard 90-degree rotate?","answer":"Yes, we have quick buttons for exactly 90, 180, and 270 degrees."},{"question":"Does the tool upload my data?","answer":"No, everything runs offline in your browser. Total privacy is guaranteed."},{"question":"Can the exposed corners be transparent?","answer":"Yes, just select transparent as the background and export as PNG or WebP."},{"question":"Will it reduce image quality?","answer":"Sub-pixel rotation requires re-interpolation of pixels, which might introduce very minor softening, but we use high-quality algorithms."}],
        relatedTools: ["image-flip","canvas-resize","image-crop"]
      }}
>
      <AdvancedRotateClientWrapper />
    </ToolShell>
  );
}
