import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import AvifConverterClientWrapper from './AvifConverterClientWrapper';

const toolId = 'avif-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AVIF Converter"
      description="Convert images to the next-gen AVIF format for maximum compression"
      category={cat}
      toolId={toolId}
    >
      <AvifConverterClientWrapper />

      <LearningHub title="Understanding the AVIF Format">
        
        <LearningSection type="architecture" title="Images from Video Codecs">
          <p>AVIF (AV1 Image File Format) isn't just an image format—it is actually a single frame of an <strong>AV1 Video</strong> wrapped in an image container.</p>
          <p className="mt-2">Streaming companies (like Netflix and Google) spent billions researching how to compress video to save bandwidth, resulting in the open-source AV1 video codec. Engineers realized that if a codec is incredibly good at compressing a continuous stream of moving pictures, it would be even better at compressing just <em>one</em> picture.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Intra-Frame Prediction">
          <p>AVIF uses advanced video-encoding techniques like <em>intra-frame prediction</em>. It divides the image into distinct blocks and mathematically predicts what colors should exist in one block based on the pixels in the blocks around it.</p>
          <p className="mt-2">This spatial mathematical prediction allows AVIF encoders to throw away up to 50% more data than a standard JPEG encoder without causing any noticeable loss in visual quality to the human eye.</p>
        </LearningSection>

        <LearningSection type="performance" title="Encoding Overhead">
          <p>Because AVIF relies on complex matrix math and prediction models, encoding an AVIF image is highly CPU intensive. It takes significantly longer to save an AVIF than a JPEG.</p>
          <p className="mt-2">This tool uses a WebAssembly port of the AV1 encoder running inside a background Web Worker, allowing your computer's CPU to churn through the math without freezing your browser interface.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What technology is the AVIF image format based on?",
                options: [
                  "The ZIP compression algorithm.",
                  "A single frame of the AV1 video codec.",
                  "Adobe's proprietary PDF structure.",
                  "A modified version of the GIF format."
                ],
                correctIndex: 1,
                explanation: "AVIF leverages the massive engineering investments put into video compression (AV1) by applying those exact algorithms to single still frames."
              },
              {
                question: "Why might a website choose to serve AVIF images despite them taking longer to generate?",
                options: [
                  "Because AVIF requires no CPU power to decode.",
                  "Because AVIF files are significantly smaller than JPEGs (often 50% smaller), dramatically speeding up website loading times for users.",
                  "Because AVIF is an older, more compatible format.",
                  "Because AVIF is the only format that supports color."
                ],
                correctIndex: 1,
                explanation: "The heavy CPU cost of generating the AVIF is paid once on the developer's computer, but the benefit of a tiny file size is enjoyed thousands of times by the website's visitors."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
