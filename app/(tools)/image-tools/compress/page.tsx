import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import ImageCompressorClientWrapper from '../image-compressor/ImageCompressorClientWrapper';

const toolId = 'compress';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Compressor"
      description="Professional image optimization tool. 100% private, browser-based compression."
      category={cat}
      toolId={toolId}
    >
      <ImageCompressorClientWrapper />
      
      <LearningHub title="Understanding Image Compression">
        
        <LearningSection type="architecture" title="Lossy vs Lossless">
          <p>Image compression fundamentally falls into two categories: <strong>Lossless</strong> and <strong>Lossy</strong>.</p>
          <p className="mt-2">Lossless formats (like PNG) find clever mathematical ways to store data without throwing a single pixel away. Lossy formats (like JPEG or WebP on low settings) aggressively delete visual information that human eyes struggle to notice, drastically reducing file size at the cost of microscopic detail.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="How JPEG Compression Works">
          <p>When you compress a JPEG, the algorithm splits the image into 8x8 pixel blocks. It then uses the <strong>Discrete Cosine Transform (DCT)</strong> to analyze the frequencies of colors within that block.</p>
          <p className="mt-2">Humans are very bad at seeing fine details in bright areas (high frequency), but very good at seeing broad changes in color (low frequency). The compression algorithm permanently deletes the high-frequency data. This is why highly compressed JPEGs look "blocky" or have strange rings around sharp edges (called compression artifacts).</p>
        </LearningSection>

        <LearningSection type="performance" title="Browser-Native Encoders">
          <p>Compressing high-resolution images is mathematically expensive. Previously, this required uploading files to a cloud server to run backend tools like ImageMagick.</p>
          <p className="mt-2">Today, we can tap into the browser's native C++ rendering engine using <code>OffscreenCanvas</code>. When you click compress, the browser's own highly optimized encoders execute the DCT math locally in milliseconds, entirely offline.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does an image get smaller when you lower the JPEG quality?",
                options: [
                  "The image is physically resized to smaller dimensions.",
                  "The algorithm permanently deletes fine detail (high-frequency data) that human eyes struggle to see.",
                  "The colors are inverted to save space.",
                  "The file is zipped."
                ],
                correctIndex: 1,
                explanation: "Lossy compression works by literally throwing away visual data. It targets fine details and color shifts that the human brain normally ignores."
              },
              {
                question: "If you take a heavily compressed, blocky JPEG and save it again at 100% quality, what happens?",
                options: [
                  "The blocky artifacts are fixed and the image is sharp again.",
                  "The file gets larger, but the blocky artifacts remain permanently.",
                  "The image becomes a PNG.",
                  "The file size stays exactly the same."
                ],
                correctIndex: 1,
                explanation: "Lossy compression permanently destroys data. Saving at 100% quality cannot restore deleted pixels; it just creates a larger file that faithfully preserves the ugly blocky artifacts."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
