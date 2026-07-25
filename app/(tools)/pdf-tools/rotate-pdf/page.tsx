import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import RotatePdfClientWrapper from './RotatePdfClientWrapper';

const toolId = 'rotate-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Rotate PDF"
      description="Rotate one or all pages of a PDF by 90°, 180°, or 270°."
      category={cat}
      toolId={toolId}
    >
      <RotatePdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-rotation"
          title="How it Works: The /Rotate Attribute"
          preview="Learn why rotating a PDF takes milliseconds instead of minutes."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If you rotate a JPEG image, the software has to recalculate the position of every single pixel and save a completely new file. When you rotate a PDF, <strong>nothing is actually recalculated or moved</strong>.
            </p>
            <h3>The Page Dictionary</h3>
            <p>
              Every page in a PDF is defined by a dictionary object. This dictionary contains an attribute called <code>/Rotate</code>, which can hold values like 90, 180, or 270.
            </p>
            <p>
              When you use this tool to rotate a page, all it does is update that single integer in the dictionary. The underlying text, vectors, and images remain completely untouched. When you open the file in Adobe Acrobat or Chrome, the viewer software sees the <code>/Rotate 90</code> flag and handles the visual rotation dynamically on your screen.
            </p>
            <p>
              This is why rotating a 5,000-page PDF takes only milliseconds!
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Privacy & Offline Security"
          preview="Client-side dictionary updates."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Because this tool only needs to flip a few integer values inside the file structure, it is incredibly lightweight. The file never leaves your computer, and no network connection is required once the page has loaded. This guarantees absolute privacy for your sensitive documents.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
