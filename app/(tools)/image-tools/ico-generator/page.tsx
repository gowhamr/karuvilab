import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-ico"
          title="How it Works: Multi-Image Containers"
          preview="Learn why an ICO file isn't just a single image."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike a standard PNG or JPEG, an <code>.ico</code> file is a <strong>Container Format</strong>. It doesn't hold just one image; it can hold dozens of the exact same image at different resolutions.
            </p>
            <h3>The Directory Header</h3>
            <p>
              When this tool generates an ICO file, it first creates an "Icon Directory" header. This header acts like a table of contents, telling the operating system: "Hey, inside this file, there is a 16x16 version, a 32x32 version, and a 256x256 version."
            </p>
            <h3>Embedded PNGs</h3>
            <p>
              Historically, the images inside the ICO file had to be encoded as raw Bitmaps (BMP). However, since Windows Vista, you are allowed to simply embed standard, compressed PNG files inside the ICO container. Our tool takes your original image, resizes it using an HTML5 Canvas into your chosen resolutions, encodes them as PNGs, and packages them all into a single binary file.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
