import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import IcoGeneratorClientWrapper from './IcoGeneratorClientWrapper';

const toolId = 'ico-generator';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="ICO Generator" description="Create Windows .ico icon files from standard images" category={cat} toolId={toolId}

      content={{
        detailedDescription: "Create professional multi-resolution ICO files for website favicons or Windows applications. Process your images privately in the browser to instantly generate standard ICO formats.",
        useCases: ["Creating website favicons","Generating Windows app icons","Converting PNG logos to ICO","Standardizing branding assets","Developing offline desktop apps"],
        howTo: ["Upload a square PNG or JPEG image.","Select the icon sizes you want to include (16x16, 32x32, 48x48, etc.).","Click Generate to combine them into an ICO file.","Download the final .ico file.","Upload it to your web server root."],
        faq: [{"question":"Why do I need multiple sizes in one ICO?","answer":"Browsers and operating systems pick different sizes depending on where the icon is displayed (tabs, taskbar, desktop). Packaging them ensures sharpness everywhere."},{"question":"Are my logos uploaded?","answer":"No. ICO generation happens 100% locally."},{"question":"Can I use a non-square image?","answer":"It's highly recommended to use a 1:1 square image to avoid stretching."},{"question":"Is transparency supported?","answer":"Yes, if your source image is a transparent PNG, the resulting ICO will preserve transparency."},{"question":"What is the maximum size?","answer":"ICO format generally supports sizes up to 256x256 pixels."}],
        relatedTools: ["svg-converter","image-resizer","aspect-ratio-converter"]
      }}
>
      <IcoGeneratorClientWrapper />
    </ToolShell>
  );
}
