import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-stroke"
          title="How it Works: Canvas Stroke vs Padding"
          preview="Learn the difference between drawing a border inside vs outside an image."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When applying a border, graphic software must make a decision: do we draw the border over the edges of the image (Inset), or do we expand the image to make room for it (Outset)?
            </p>
            <h3>Outset Canvas Math</h3>
            <p>
              This tool uses an <strong>Outset</strong> model. If you have a 1000x1000 pixel image and request a 50px border, the tool physically expands the underlying HTML5 Canvas to 1100x1100 pixels. It draws the solid border color across the entire new canvas, and then paints your original image exactly in the center.
            </p>
            <p>
              By expanding the canvas (rather than using the Canvas API's native <code>strokeRect</code> function over the image), we ensure that absolutely zero pixels of your original photograph are covered up by the border.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
