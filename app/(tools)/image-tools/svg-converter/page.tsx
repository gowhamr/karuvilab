import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
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
    </ToolShell>
  );
}
