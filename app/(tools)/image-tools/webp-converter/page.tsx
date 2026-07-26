import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import WebPConverterClientWrapper from './WebPConverterClientWrapper';

const toolId = 'webp-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="WebP Converter" description="Convert any image to the highly optimized WebP format" category={cat} toolId={toolId}>
      <WebPConverterClientWrapper />

      <LearningHub title="Understanding WebP Compression">
        
        <LearningSection type="architecture" title="Derived from Video">
          <p>WebP isn't just a random image format; it is actually a direct byproduct of modern video compression technology.</p>
          <p className="mt-2">Just like AVIF is a single frame of an AV1 video, <strong>WebP</strong> is essentially a single extracted frame of a <strong>VP8 video</strong> (the open-source codec that powers WebM and early YouTube).</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Block Prediction">
          <p>Engineers realized that the algorithm used to compress a single "Keyframe" in a VP8 video was significantly better at compressing static photos than the ancient JPEG standard.</p>
          <p className="mt-2">WebP uses a mathematical technique called <strong>Block Prediction</strong>. It divides your image into tiny macroblocks (usually 16x16 pixels). Before saving the pixels for a new block, the algorithm looks at the blocks immediately above and to the left of it, and tries to mathematically guess what the current block looks like based on its neighbors.</p>
        </LearningSection>

        <LearningSection type="performance" title="Size Savings">
          <p>Because the WebP encoder only has to save the <em>difference</em> between its guess and the actual pixels (the mathematical "residual"), WebP files end up being roughly 25-30% smaller than JPEGs of the exact same visual quality.</p>
          <p className="mt-2">Unlike JPEG, WebP also supports full alpha transparency, making it a vastly superior replacement for heavy PNG files on modern websites.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Where did the WebP image format originally come from?",
                options: [
                  "It was invented by Apple for the iPhone.",
                  "It is a single frame extracted from the VP8 (WebM) video codec.",
                  "It is a zipped version of a JPEG.",
                  "It was created by Mozilla for Firefox."
                ],
                correctIndex: 1,
                explanation: "WebP is based entirely on the intra-frame compression algorithm from the VP8 video codec, acquired and open-sourced by Google."
              },
              {
                question: "How does WebP's 'Block Prediction' save file size?",
                options: [
                  "It mathematically guesses what a block of pixels looks like based on its neighbors, and only saves the difference between the guess and reality.",
                  "It deletes every other block of pixels.",
                  "It forces the entire image to be black and white.",
                  "It uses CSS to style the image."
                ],
                correctIndex: 0,
                explanation: "By predicting the contents of a block using surrounding data, the file only needs to store the small residuals (the errors in the prediction), which requires vastly fewer bytes."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
