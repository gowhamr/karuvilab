import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import ImagePaddingClientWrapper from './ImagePaddingClientWrapper';

const toolId = 'image-padding';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Padding"
      description="Add uniform or per-side padding around your images"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Add custom padding around your images instantly. This tool provides fine-grained control over top, right, bottom, and left margins. All processing is securely executed in your browser without any server uploads.",
        useCases: ["Formatting product photos for e-commerce","Adding margins to logos","Creating uniform galleries","Preventing edge-cropping on social media","Pre-processing images for framing"],
        howTo: ["Upload an image file.","Specify padding values (in pixels) for each side.","Choose a background color for the padded area.","Instantly preview the padded result.","Export the image in your preferred format."],
        faq: [{"question":"Are my photos uploaded?","answer":"No, all padding and rendering happens locally on your computer."},{"question":"Can I pad with transparency?","answer":"Yes, just select the transparent color option and export as PNG or WebP."},{"question":"Is the original aspect ratio preserved?","answer":"The inner image is preserved, but the final aspect ratio will change depending on the padding values you apply."},{"question":"Can I apply negative padding?","answer":"Negative padding acts like cropping. For actual cropping, use our Image Crop tool."},{"question":"Is this free to use?","answer":"Yes, all our local browser tools are 100% free and open."}],
        relatedTools: ["canvas-resize","border-generator","aspect-ratio-converter"]
      }}
>
      <ImagePaddingClientWrapper />
    </ToolShell>
  );
}
