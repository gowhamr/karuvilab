import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ImageCompressorClientWrapper from './ImageCompressorClientWrapper';

const toolId = 'image-compress';
const cat = CATEGORIES.find(c => c.id === 'image')!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ImageCompressorPage() {
  return (
    <ToolShell
      title="Image Compressor"
      description="Professional-grade image optimization suite. Lossless compression, batch processing, and format conversion — all 100% private in your browser."
      category={cat}
      toolId={toolId}
    >
      <ImageCompressorClientWrapper />

      <LearningHub title="Understanding Image Compression">
        
        <LearningSection type="architecture" title="Lossy vs Lossless Encoding">
          <p>An uncompressed 4K image contains over 8 million pixels. Storing the exact RGB value for every single pixel takes about 25 Megabytes of data. Compression reduces this massive footprint using one of two strategies: throwing data away (Lossy) or finding patterns (Lossless).</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Lossy Compression (JPEG / WebP)">
          <p>Lossy algorithms exploit human biology. The human eye is much more sensitive to changes in brightness (luma) than it is to color (chroma).</p>
          <p className="mt-2">Algorithms like JPEG use <strong>Chroma Subsampling</strong> to average out the color of neighboring pixels, effectively throwing away color data you wouldn't notice anyway. It then uses the <strong>Discrete Cosine Transform (DCT)</strong> to group pixels into 8x8 blocks of frequency patterns.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="Lossless Compression (PNG)">
          <p>Lossless compression never throws away visual data. Every pixel is perfectly reconstructed. Instead, it uses mathematical techniques (like <strong>Deflate</strong> or <strong>LZ77</strong>) to find repeating patterns.</p>
          <p className="mt-2">If an image has a completely white background with 1,000 identical white pixels in a row, the algorithm just writes <em>"repeat white 1,000 times"</em> to the disk instead of individually saving the RGB values for all 1,000 pixels.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do JPEG images often look blocky or artifacted when heavily compressed?",
                options: [
                  "Because it drops the resolution.",
                  "Because JPEG uses the Discrete Cosine Transform to group pixels into 8x8 blocks, and heavy compression discards the high-frequency detail within those blocks.",
                  "Because browsers struggle to read them.",
                  "Because it forces a 256-color palette."
                ],
                correctIndex: 1,
                explanation: "The blocky artifacts (often seen around text) are the literal 8x8 mathematical DCT blocks that JPEG uses to average out the visual information."
              },
              {
                question: "If you want to compress a photo of a grassy field without losing any pixel detail, which method should you use?",
                options: [
                  "Lossless (e.g. PNG)",
                  "Lossy (e.g. JPEG)",
                  "Base64",
                  "GIF"
                ],
                correctIndex: 0,
                explanation: "Lossless compression guarantees 100% pixel-perfect recreation of the original file, though it will result in a much larger file size than Lossy compression."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
