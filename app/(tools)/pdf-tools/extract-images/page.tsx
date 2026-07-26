import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding XObjects & PDF Image Filters">
        
        <LearningSection type="architecture" title="No Folders Inside">
          <p>A PDF does not have a "folder" of images inside it. Instead, images are stored as raw binary streams called <strong>XObjects (External Objects)</strong> within the PDF's internal database.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Image Decoding Filters">
          <p>When a PDF is created, images are encoded using specific filters to save space. To extract them, this tool reads the XObject dictionary and applies the correct decoding algorithm:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>DCTDecode:</strong> This is standard JPEG compression. If an image is stored this way, we can extract the raw binary stream and instantly save it as a <code>.jpg</code> without any loss of quality.</li>
            <li><strong>FlateDecode / LZWDecode:</strong> These are lossless compression algorithms (similar to ZIP). Images stored this way are often extracted and saved as <code>.png</code> files to preserve their transparency and exact pixel data.</li>
            <li><strong>CCITTFaxDecode:</strong> A legacy 1-bit monochrome compression used for scanned faxes and black-and-white documents.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Zero-Loss Extraction">
          <p>Unlike taking a screenshot of the PDF or using a rasterizing tool, by directly dumping these raw binary streams, this tool achieves <strong>zero-loss extraction</strong>. The images you get out are byte-for-byte identical to the files that were originally embedded by the creator.</p>
        </LearningSection>

        <LearningSection type="security" title="Memory Constraints">
          <p>Extracting high-resolution images from a 500-page catalog can quickly consume gigabytes of RAM, which crashes mobile browsers.</p>
          <p className="mt-2">To prevent this, we use <code>ArrayBuffer</code> transfers to pass data between the Web Worker and the main thread without duplicating memory. Furthermore, instead of holding all extracted images in memory at once, they are streamed directly into a compressed <code>.zip</code> file chunk by chunk using <code>fflate</code>.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the PDF standard name for an embedded image object?",
                options: [
                  "MediaBox",
                  "XObject",
                  "ImageStream",
                  "DCTImage"
                ],
                correctIndex: 1,
                explanation: "Images (and sometimes forms or other self-contained graphics) are stored as XObjects (External Objects) in a PDF."
              },
              {
                question: "If an image in a PDF is compressed using 'DCTDecode', what file format is it natively?",
                options: [
                  "PNG",
                  "GIF",
                  "JPEG",
                  "TIFF"
                ],
                correctIndex: 2,
                explanation: "DCTDecode stands for Discrete Cosine Transform, which is the exact mathematical algorithm used by the JPEG compression standard."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
