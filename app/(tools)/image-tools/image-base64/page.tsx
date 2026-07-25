import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageBase64ClientWrapper from './ImageBase64ClientWrapper';

const toolId = 'image-base64';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image to Base64"
      description="Encode images as Base64 data URIs or decode data URIs back to images."
      category={cat}
      toolId={toolId}
    >
      <ImageBase64ClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-base64"
          title="How it Works: The 33% Penalty"
          preview="Learn why encoding an image as Base64 text makes it larger."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Base64 is a way to take raw binary data (like an image) and convert it into a safe, ASCII string that can be pasted directly into an HTML or CSS file.
            </p>
            <h3>The Math of Base64</h3>
            <p>
              Computers store data in bytes (8 bits). However, the standard text characters (A-Z, a-z, 0-9, +, /) only provide 64 distinct values, which can only represent 6 bits of data.
            </p>
            <p>
              To encode 8-bit binary data into 6-bit text characters, the algorithm has to take every 3 bytes of the original image (24 bits total) and split them into 4 Base64 characters (6 bits each). Because 3 bytes of binary data become 4 bytes of text data, <strong>Base64 encoding mathematically increases the file size of your image by exactly 33%.</strong>
            </p>
            <p>
              This is why you should only use Base64 for very small images (like icons or tiny placeholders). Using it for large photographs will massively bloat your HTML/CSS file size and slow down the page load.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
