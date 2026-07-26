import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
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
    >
      <TiffConverterClientWrapper />

      <LearningHub title="Understanding TIFF and LZW Compression">
        
        <LearningSection type="architecture" title="Lossy vs Lossless">
          <p>Unlike JPEGs which permanently throw away microscopic visual details to save hard drive space (Lossy Compression), TIFF files are usually compressed using algorithms that preserve every single byte (Lossless).</p>
          <p className="mt-2">This makes TIFF the standard for print-ready graphics, medical imaging, and archival document scanning.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The LZW Dictionary Algorithm">
          <p>TIFF files typically use <strong>LZW (Lempel-Ziv-Welch)</strong> compression to save space without losing data.</p>
          <p className="mt-2">Imagine an image with a massive solid blue sky. Instead of writing "Blue, Blue, Blue, Blue" a thousand times in the file, the LZW algorithm creates a dictionary. It assigns a short code (like <code>#1</code>) to the pattern "Blue, Blue", and then an even shorter code for larger blocks of identical colors.</p>
        </LearningSection>

        <LearningSection type="performance" title="In-Browser Decoding">
          <p>When this tool decodes your TIFF, it reads these shorthand dictionary codes, rebuilds the original dictionary in your browser's RAM, and mathematically reconstructs every single original pixel of the image exactly as it was scanned.</p>
          <p className="mt-2">Because a heavy multi-layered TIFF can instantly consume gigabytes of RAM when decompressed, this decoding process is strictly isolated to prevent crashing your main browser tab.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why are TIFF files usually much larger than JPEGs?",
                options: [
                  "Because they contain computer viruses.",
                  "Because TIFF is a lossless format, meaning it preserves every single pixel's data without throwing anything away to save space.",
                  "Because they are only used for 3D graphics.",
                  "Because browsers cannot read them."
                ],
                correctIndex: 1,
                explanation: "TIFF prioritizes absolute perfect quality over small file sizes, whereas JPEG aggressively deletes hard-to-see details to make the file smaller."
              },
              {
                question: "How does LZW compression make a TIFF file smaller without losing data?",
                options: [
                  "By replacing repetitive patterns (like a solid blue sky) with short dictionary codes instead of writing the color out thousands of times.",
                  "By blurring the image slightly.",
                  "By resizing the image to a smaller resolution.",
                  "By deleting the alpha channel."
                ],
                correctIndex: 0,
                explanation: "LZW creates a shorthand dictionary for repeated sequences of data, drastically shrinking the file size while allowing 100% perfect mathematical reconstruction."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
