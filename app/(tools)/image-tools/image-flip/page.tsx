import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ImageFlipClientWrapper from './ImageFlipClientWrapper';

const toolId = 'image-flip';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Flip"
      description="Flip images horizontally, vertically, or both directions instantly"
      category={cat}
      toolId={toolId}
    >
      <ImageFlipClientWrapper />

      <LearningHub title="Understanding Coordinate Transforms">
        
        <LearningSection type="api" title="The Negative Scaling Trick">
          <p>The HTML5 Canvas API doesn't actually have a native <code>flip()</code> or <code>mirror()</code> function. To reverse an image, developers have to use a mathematical trick leveraging the <code>scale()</code> transformation.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Flipping Math">
          <p>Normally, calling <code>scale(1, 1)</code> means draw the image at 100% width and 100% height. If we want to flip the image horizontally, we apply <code>scale(-1, 1)</code>.</p>
          <p className="mt-2">This tells the canvas to draw the image at <strong>negative 100% width</strong>, which mathematically causes the pixels to render in reverse order, effectively flipping it.</p>
        </LearningSection>

        <LearningSection type="architecture" title="Translating the Origin">
          <p>However, drawing at a negative width has a side effect: it means the entire image gets drawn backwards <em>off the left side of the screen</em> into negative coordinate space (outside the visible bounds of the canvas).</p>
          <p className="mt-2">To fix this, before we scale, we first have to mathematically <code>translate()</code> the origin point (0,0) of the canvas from the top-left corner over to the far right edge, and <em>then</em> draw it backwards so it lands exactly inside the canvas bounds.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How do you tell an HTML5 Canvas to draw an image upside-down (flipped vertically)?",
                options: [
                  "Use the ctx.flipVertical() command.",
                  "Apply a scale(1, -1) transformation.",
                  "Rotate the image 90 degrees.",
                  "Send it to a server to be reversed."
                ],
                correctIndex: 1,
                explanation: "Applying a negative scale on the Y-axis (-1) causes the browser to draw the image at negative 100% height, effectively flipping it upside-down."
              },
              {
                question: "Why must you translate the canvas origin when using negative scaling?",
                options: [
                  "Because negative scaling draws the image into negative coordinate space, off the visible edge of the canvas.",
                  "Because it changes the colors of the image.",
                  "To make the file size smaller.",
                  "To crop the image."
                ],
                correctIndex: 0,
                explanation: "If you draw at -100% width starting from X=0, the image is drawn from X=0 to X=-1000. You must move the starting point to X=1000 so it draws backwards from 1000 to 0."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
