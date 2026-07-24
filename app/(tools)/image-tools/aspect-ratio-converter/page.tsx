import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
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
    </ToolShell>
  );
}
