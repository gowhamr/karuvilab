import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import TiffConverterClientWrapper from './TiffConverterClientWrapper';

const toolId = 'tiff-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="TIFF Converter"
      description="Convert to and from the professional TIFF image format"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Convert heavy TIFF graphics and scanned documents into standard JPEG or PNG formats offline. Our client-side TIFF decoder handles high-resolution images privately and securely in your browser.",
        useCases: ["Converting scanned documents for email","Extracting images from print-ready TIFFs","Viewing legacy TIFF files offline","Preparing medical or scientific imagery for web","Batch processing scanned archives locally"],
        howTo: ["Select your TIFF file to upload.","The local decoder will read the image data.","Select JPEG or PNG as the target format.","Adjust the quality if needed.","Click Download to export."],
        faq: [{"question":"Is the decoding done on a server?","answer":"No, we use local JavaScript (UTIF) to parse and decode the TIFF file right in your browser."},{"question":"Are multi-page TIFFs supported?","answer":"Currently, this tool extracts the first page of the TIFF file."},{"question":"Does the quality decrease?","answer":"Converting a lossless TIFF to a lossy JPEG will reduce quality. Export as PNG for a lossless conversion."},{"question":"Is there a file size limit?","answer":"TIFF files can be massive. If a file is too large for your browser's RAM, the tab may crash. We recommend files under 50MB."},{"question":"Is it free to use?","answer":"Yes, all KaruviLab tools are completely free and private."}],
        relatedTools: ["bmp-converter","heic-converter","image-converter"]
      }}
>
      <TiffConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-lzw"
          title="How it Works: LZW Lossless Compression"
          preview="Learn the math behind how TIFFs compress files without losing data."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike JPEGs which throw away visual data to save space (Lossy), TIFF files are usually compressed using <strong>LZW (Lempel-Ziv-Welch)</strong> compression, which is completely Lossless.
            </p>
            <h3>The Dictionary Algorithm</h3>
            <p>
              Imagine an image with a solid blue sky. Instead of writing "Blue, Blue, Blue, Blue, Blue" a thousand times, the LZW algorithm creates a dictionary. It assigns a short code (like <code>#1</code>) to the pattern "Blue, Blue", and then an even shorter code for larger patterns.
            </p>
            <p>
              When this tool decodes your TIFF, it reads these shorthand dictionary codes, rebuilds the original dictionary in your browser's memory, and perfectly reconstructs every single original pixel of the image, exactly as it was scanned or photographed.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
