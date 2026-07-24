import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import CanvasResizeClientWrapper from './CanvasResizeClientWrapper';

const toolId = 'canvas-resize';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Canvas Resize"
      description="Resize the canvas workspace around your image without scaling"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Resize the canvas of your image without stretching or distorting the original content. This client-side tool allows you to expand or shrink the canvas bounds, perfectly anchoring your image and optionally filling the background.",
        useCases: ["Preparing images for social media","Adding white space around photos","Cropping out extra transparent space","Standardizing product image sizes","Adjusting dimensions for print"],
        howTo: ["Upload your image.","Enter the new canvas width and height.","Select the anchor point (e.g., center, top-left) for the original image.","Choose a background color (or transparent).","Click Download to export your resized canvas."],
        faq: [{"question":"Will this stretch my image?","answer":"No. Canvas resize changes the bounding box of the image, adding space or cropping edges without scaling the actual pixels."},{"question":"Can I use a transparent background?","answer":"Yes, by selecting PNG or WebP as the output format, you can maintain a transparent canvas background."},{"question":"Is there a limit to the canvas size?","answer":"Browser memory limits apply. Extremely large canvases (e.g., >8000px) might slow down or crash depending on your device RAM."},{"question":"Does this upload my image?","answer":"Never. All resizing is done locally on your device."},{"question":"How do I scale the image itself?","answer":"To scale the content, use our standard Image Resizer tool instead of Canvas Resize."}],
        relatedTools: ["image-resizer","image-padding","image-crop"]
      }}
>
      <CanvasResizeClientWrapper />
    </ToolShell>
  );
}
