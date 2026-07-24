import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import BorderGeneratorClientWrapper from './BorderGeneratorClientWrapper';

const toolId = 'border-generator';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Border Generator"
      description="Add decorative borders to your images with custom styles"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Generate professional borders and frames for your images locally. Add solid, dashed, or stylized borders with custom colors and thickness to enhance your photos instantly without compromising privacy.",
        useCases: ["Framing artwork for portfolios","Adding borders to Instagram posts","Creating polaroid-style photos","Highlighting UI screenshots","Standardizing avatar styles"],
        howTo: ["Drag and drop your image into the tool.","Select the border width and style.","Pick a border color from the color picker.","Adjust border radius if you want rounded corners.","Download the beautifully framed image."],
        faq: [{"question":"Is my image safe?","answer":"Yes. We process everything in your browser. No files are uploaded to any server."},{"question":"Can I add rounded borders?","answer":"Yes, you can adjust the border radius to create rounded corners. The background outside the curve will be transparent (if exporting as PNG)."},{"question":"Does the border go inside or outside the image?","answer":"The border is added to the outside, expanding the total dimensions of the image."},{"question":"Can I use gradient borders?","answer":"Currently, we support solid colors. Gradient support is planned for future updates."},{"question":"Are there predefined frame styles?","answer":"You can customize width, style (solid, dashed), and radius manually to match any style."}],
        relatedTools: ["image-padding","canvas-resize","image-filters"]
      }}
>
      <BorderGeneratorClientWrapper />
    </ToolShell>
  );
}
