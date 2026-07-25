import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ExtractImagesClientWrapper from './ExtractImagesClientWrapper';

const toolId = 'extract-images';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract Images"
      description="Extract all embedded images from a PDF file."
      category={cat}
      toolId={toolId}
    >
      <ExtractImagesClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-extraction"
          title="How it Works: XObjects & DCTDecode"
          preview="Learn how images are mathematically embedded inside PDF documents."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A PDF does not have a "folder" of images inside it. Instead, images are stored as binary streams called <strong>XObjects (External Objects)</strong> within the PDF's internal database.
            </p>
            <h3>Image Filters</h3>
            <p>
              When a PDF is created, images are encoded using specific filters. To extract them, this tool reads the XObject dictionary and applies the correct decoding algorithm:
            </p>
            <ul>
              <li><strong>DCTDecode:</strong> This is standard JPEG compression. If an image is stored this way, we can extract the raw binary stream and instantly save it as a <code>.jpg</code> without any loss of quality.</li>
              <li><strong>FlateDecode / LZWDecode:</strong> These are lossless compression algorithms (similar to ZIP). Images stored this way are often extracted and saved as <code>.png</code> files to preserve their transparency and pixel perfection.</li>
              <li><strong>CCITTFaxDecode:</strong> A legacy 1-bit monochrome compression used for scanned faxes and black-and-white documents.</li>
            </ul>
            <p>
              By directly dumping the raw binary streams, this tool achieves <strong>zero-loss extraction</strong>. The images you get are byte-for-byte identical to what was originally embedded.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Architecture & Memory Limits"
          preview="Handling memory constraints when extracting thousands of images."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Extracting images from a 500-page catalog can quickly consume gigabytes of RAM, which crashes mobile browsers.
            </p>
            <ul>
              <li><strong>Zero-Copy Transfers:</strong> We use <code>ArrayBuffer</code> transfers to pass data between the Web Worker and the main thread without duplicating memory.</li>
              <li><strong>Streaming ZIP Creation:</strong> Instead of holding all extracted images in memory, they are streamed directly into a compressed <code>.zip</code> file chunk by chunk using <code>fflate</code>.</li>
              <li><strong>Offline Security:</strong> All parsing and extraction happens securely on your local device.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
