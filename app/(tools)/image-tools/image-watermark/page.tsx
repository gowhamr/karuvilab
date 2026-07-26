import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ClientWrapper from './ClientWrapper';

const toolId = 'image-watermark';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Watermark"
      description="Add text or image watermarks to multiple photos securely offline."
      category={cat}
      toolId={toolId}
    >
      <ClientWrapper />

      <LearningHub title="Understanding Alpha Blending and Compositing">
        
        <LearningSection type="architecture" title="Global Alpha Transparency">
          <p>When applying a watermark, you usually want it to be slightly see-through (e.g., 50% opacity) so it protects the image without completely obliterating the underlying details.</p>
          <p className="mt-2">But how does the computer actually calculate a "see-through" pixel?</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The Alpha Blending Formula">
          <p>Every pixel in an image is represented by Red, Green, Blue, and Alpha (transparency) channels. When you instruct the HTML5 Canvas to use a <code>globalAlpha = 0.5</code> and draw a watermark text over a photo, the browser executes standard Alpha Blending.</p>
          <p className="mt-2">For every single pixel where the watermark overlaps the photo, it runs this exact formula:</p>
          <pre className="text-xs sm:text-sm mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"><code>Final_Color = (Watermark_Color * 0.5) + (Photo_Color * (1.0 - 0.5))</code></pre>
          <p className="mt-2">It is mathematically averaging the two colors based on the weight of the Alpha value.</p>
        </LearningSection>

        <LearningSection type="performance" title="Batch Processing via Web Workers">
          <p>Because running that blending formula on a 20-megapixel photo requires performing tens of millions of mathematical operations, processing an entire batch of 50 images would completely freeze the browser's UI thread.</p>
          <p className="mt-2">To solve this, KaruviLab executes the watermarking using <code>OffscreenCanvas</code> instances spawned inside background Web Workers. This allows the heavy alpha blending math to run in parallel on your CPU's other cores, keeping the interface completely fluid.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a watermark is set to 25% opacity (Alpha 0.25), how much of the original photo's color is preserved in the overlapping pixels?",
                options: [
                  "25%",
                  "50%",
                  "75%",
                  "0%"
                ],
                correctIndex: 2,
                explanation: "The formula is (Watermark * 0.25) + (Photo * (1.0 - 0.25)). So the resulting pixel is 25% watermark and 75% original photo."
              },
              {
                question: "Why does batch watermarking large photos sometimes cause browser freezing on poorly built websites?",
                options: [
                  "Because they use CSS instead of Canvas.",
                  "Because they run millions of alpha blending calculations on the main UI thread.",
                  "Because the internet connection is slow.",
                  "Because they use JPGs instead of PNGs."
                ],
                correctIndex: 1,
                explanation: "Heavy pixel math on the main UI thread blocks the browser from updating the screen. This must be offloaded to Web Workers."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}