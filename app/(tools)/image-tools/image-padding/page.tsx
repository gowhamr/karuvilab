import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-boxmodel"
          title="How it Works: Translating CSS to Canvas"
          preview="Learn how the CSS Box Model is manually calculated for images."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              In HTML/CSS, adding padding is easy: you just type <code>padding: 20px 40px</code> and the browser automatically pushes the content inward. But when dealing with raw image files on a Canvas, there is no automatic "Box Model". We have to calculate the math manually.
            </p>
            <h3>Calculating the New Bounding Box</h3>
            <p>
              If you have a 500x500 image, and you want 10px of top padding and 20px of bottom padding, the new Height is not 520; it is <code>Original Height + Top Padding + Bottom Padding</code> (530px).
            </p>
            <p>
              To render this, the tool creates a new 500x530 Canvas. It cannot just draw the image at <code>0,0</code>, because that would ignore the top padding. Instead, it must draw the original image exactly at the coordinate <code>(LeftPadding, TopPadding)</code>. By displacing the origin point of the drawing, it perfectly simulates the CSS padding effect on a flat, rasterized image.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
