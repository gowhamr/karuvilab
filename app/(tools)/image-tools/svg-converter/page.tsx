import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import SvgConverterClientWrapper from './SvgConverterClientWrapper';

const toolId = 'svg-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="SVG to PNG" description="Rasterize vector SVG files to transparent PNGs" category={cat} toolId={toolId}

      content={{
        detailedDescription: "Rasterize vector SVG files to high-quality PNG or JPEG images directly in your browser. Easily scale your vectors to any resolution before exporting without pixelation or server uploads.",
        useCases: ["Converting logos for non-vector platforms","Rasterizing web icons for email signatures","Generating high-res PNGs from SVG art","Previewing SVGs offline","Preparing SVGs for legacy software"],
        howTo: ["Upload your SVG file.","Specify the target export width and height (vectors scale flawlessly).","Choose PNG for transparency or JPEG for a solid background.","Preview the rasterized output.","Download your converted image."],
        faq: [{"question":"Will my SVG lose quality?","answer":"SVGs are vectors and scale infinitely. The exported PNG will be sharp at whatever resolution you choose."},{"question":"Is this done securely?","answer":"Yes, the SVG is drawn to a local HTML5 Canvas and exported, without any server interaction."},{"question":"Can I edit the SVG paths?","answer":"This tool is for format conversion. To edit vectors, use a dedicated vector graphics editor."},{"question":"Why did my SVG background turn black?","answer":"If your SVG is transparent and you export to JPEG, the background becomes black (or white). Export as PNG to keep it transparent."},{"question":"Are SVG animations supported?","answer":"No, only the static first frame of an SVG is rasterized."}],
        relatedTools: ["ico-generator","image-converter","image-resizer"]
      }}
>
      <SvgConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-raster"
          title="How it Works: Vector vs Raster"
          preview="Learn how math equations are turned into physical pixels."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              An SVG (Scalable Vector Graphic) is fundamentally different from a JPG or PNG. A JPG is a literal grid of pixels. An SVG is a text file containing math equations.
            </p>
            <h3>Rasterization</h3>
            <p>
              For example, an SVG might say <code>&lt;circle cx="50" cy="50" r="40" fill="red" /&gt;</code>. Because it's math, it can be drawn at the size of a postage stamp or the size of a billboard with perfect sharpness. But to save it as a PNG, we must <strong>Rasterize</strong> it (turn the math back into a grid of pixels).
            </p>
            <p>
              To do this in the browser securely, this tool reads your SVG text file, encodes it into a Data URI, and loads it into a virtual <code>&lt;img&gt;</code> tag in memory. We then draw that virtual image onto a physical HTML5 Canvas at your requested resolution, forcing the browser's rendering engine to calculate and freeze the math into hard pixels.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
