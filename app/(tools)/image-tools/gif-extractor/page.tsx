import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import GifExtractorClientWrapper from './GifExtractorClientWrapper';

const toolId = 'gif-extractor';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="GIF Frame Extractor"
      description="Extract individual frames from animated GIFs"
      category={cat}
      toolId={toolId}
    >
      <GifExtractorClientWrapper />

      <LearningHub title="Understanding GIF Frame Disposal">
        
        <LearningSection type="architecture" title="Not Just a ZIP of Images">
          <p>You might assume a GIF is just a ZIP archive full of 50 normal JPEG images playing in sequence. It is not.</p>
          <p className="mt-2">To save massive amounts of file size, the GIF specification uses a technique called <strong>Frame Disposal</strong> and Delta Encoding.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Delta Encoding Math">
          <p>Frame 1 in a GIF is a full, standard image. But if Frame 2 is just a person blinking, the GIF encoder doesn't save the entire room again.</p>
          <p className="mt-2">It only saves the tiny bounding rectangle around the person's eyes (a Delta frame). When playing back the GIF, the decoder overlays this tiny eye-box directly on top of the existing Frame 1 canvas.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Scrubbing Penalty">
          <p>This delta-encoding is why extracting frames is computationally heavy. If you want to jump to view Frame 30, the browser cannot simply load Frame 30 from the file.</p>
          <p className="mt-2">The decoding engine has to start at Frame 1, and mathematically layer all 29 subsequent delta frames on top of each other using an HTML5 Canvas to reconstruct the final image for Frame 30.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If Frame 10 of a GIF only contains a person's moving hand, what does the GIF decoder have to do to show you the full picture of Frame 10?",
                options: [
                  "It loads a full-quality JPEG of Frame 10 from the file.",
                  "It starts at Frame 1 and draws every single frame (2 through 10) on top of each other in sequence to rebuild the scene.",
                  "It uses AI to guess the background.",
                  "It asks the server for the frame."
                ],
                correctIndex: 1,
                explanation: "Because GIFs use delta encoding to save space, most frames are incomplete pieces of a puzzle. The computer must 'play' the whole GIF internally up to the point you requested to see the full picture."
              },
              {
                question: "Why do GIFs have a maximum of 256 colors per frame?",
                options: [
                  "Because it is an older format designed in the 1980s that relies on a localized indexed color palette to keep file sizes small.",
                  "Because the human eye can only see 256 colors.",
                  "Because modern browsers restrict color usage to save battery.",
                  "Because Delta Encoding only supports black and white."
                ],
                correctIndex: 0,
                explanation: "The GIF format was introduced by CompuServe in 1987. It uses an 8-bit palette index, which hard-caps the total available colors to 256, which is why complex gradients in GIFs often look grainy or banded."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
