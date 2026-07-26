import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import IcoGeneratorClientWrapper from './IcoGeneratorClientWrapper';

const toolId = 'ico-generator';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="ICO Generator" description="Create Windows .ico icon files from standard images" category={cat} toolId={toolId}>
      <IcoGeneratorClientWrapper />

      <LearningHub title="Understanding Windows ICO Architecture">
        
        <LearningSection type="architecture" title="Multi-Image Containers">
          <p>Unlike a standard PNG or JPEG, an <code>.ico</code> file is a <strong>Container Format</strong>. It doesn't hold just one image; it is specifically designed to hold dozens of the exact same image at different resolutions simultaneously.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The Directory Header">
          <p>When this tool generates an ICO file, it first writes a binary "Icon Directory" header to the file buffer.</p>
          <p className="mt-2">This header acts like a table of contents, telling the operating system: <em>"Hey, inside this file, there is a 16x16 version, a 32x32 version, and a 256x256 version."</em> This allows Windows to instantly pull out the 16x16 version for a browser tab, but grab the 256x256 version if you drag the icon to your Desktop.</p>
        </LearningSection>

        <LearningSection type="api" title="Embedded PNGs">
          <p>Historically, the images inside the ICO file had to be encoded as raw, uncompressed Bitmaps (BMP), making ICO files quite large.</p>
          <p className="mt-2">However, since Windows Vista, you are allowed to simply embed standard, compressed PNG files directly inside the ICO container. Our tool takes your original image, resizes it using an <code>OffscreenCanvas</code> into your chosen resolutions, encodes them all as standard PNGs, and concatenates them behind the directory header into a single downloadable binary blob.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is an ICO file fundamentally different from a JPG or PNG?",
                options: [
                  "Because it uses AI compression.",
                  "Because it is a container format that holds multiple different sizes of the same image inside a single file.",
                  "Because it is vector-based.",
                  "Because it does not support transparency."
                ],
                correctIndex: 1,
                explanation: "An ICO file is an archive. It packages multiple resolutions so the OS doesn't have to awkwardly scale one image for both tiny taskbars and massive desktop shortcuts."
              },
              {
                question: "Why do modern ICO files take up less disk space than ICO files from the Windows 95 era?",
                options: [
                  "Because icons are smaller now.",
                  "Because modern ICO files can embed highly compressed PNGs inside the container, whereas old ICOs required uncompressed BMP data.",
                  "Because modern computers have more RAM.",
                  "Because Microsoft changed the file extension."
                ],
                correctIndex: 1,
                explanation: "Starting in Windows Vista, Microsoft allowed developers to slip standard PNG files into the ICO container, saving massive amounts of disk space compared to raw bitmaps."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
