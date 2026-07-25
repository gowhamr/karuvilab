import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import AspectRatioConverterClientWrapper from './AspectRatioConverterClientWrapper';

const toolId = 'aspect-ratio-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Aspect Ratio Converter"
      description="Convert images to standard aspect ratios like 1:1, 16:9, 4:3"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Convert your images to exact aspect ratios like 16:9, 4:3, or 1:1. Our tool dynamically crops or pads your image to fit the target ratio perfectly, all processed privately on your local device.",
        useCases: ["Converting photos for Instagram (1:1 or 4:5)","Preparing YouTube thumbnails (16:9)","Formatting presentation slides (4:3)","Creating Pinterest pins (9:16)","Standardizing blog post headers"],
        howTo: ["Upload your image.","Select a target aspect ratio from the presets or enter a custom one.","Choose whether to 'Crop to fill' or 'Pad to fit'.","Adjust the focal point if cropping.","Download the formatted image."],
        faq: [{"question":"What happens if my image doesn't match the ratio?","answer":"You can choose to either crop the excess edges (Fill) or add background padding (Fit) to achieve the exact ratio."},{"question":"Does this tool upload my image?","answer":"No, all ratio calculations and canvas rendering happen offline in your browser."},{"question":"Will the resolution change?","answer":"The tool attempts to preserve the maximum original resolution while adjusting the bounding box to match the ratio."},{"question":"Can I use custom ratios?","answer":"Yes, you can input any width:height custom ratio alongside the common presets."},{"question":"Is this free?","answer":"Yes, it is entirely free and runs locally."}],
        relatedTools: ["canvas-resize","image-crop","image-resizer"]
      }}
>
      <AspectRatioConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-aspect"
          title="How it Works: Object-Fit Mathematics"
          preview="Learn the math behind 'Crop to Fill' vs 'Pad to Fit'."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When forcing an image into a new aspect ratio, you have two choices: lose content or gain empty space. This is governed by the mathematics of CSS `object-fit`.
            </p>
            <h3>Cover (Crop to Fill)</h3>
            <p>
              The algorithm calculates two scale factors: <code>WidthScale</code> and <code>HeightScale</code>. To "cover" the new ratio without stretching the image, it takes the <strong>maximum</strong> of the two scales. This ensures the canvas is completely filled, but the overflow (the parts of the image that stick out of the new bounding box) is permanently clipped off.
            </p>
            <h3>Contain (Pad to Fit)</h3>
            <p>
              Conversely, to "contain" the image, the algorithm takes the <strong>minimum</strong> of the two scale factors. This ensures the entire original image fits inside the new bounds. However, because the ratios don't match, this creates "letterboxing" or "pillarboxing"—empty padding on the sides or top/bottom that must be filled with a solid color or blur.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
