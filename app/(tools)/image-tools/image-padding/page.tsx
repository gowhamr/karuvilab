import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import ImagePaddingClientWrapper from './ImagePaddingClientWrapper';

const toolId = 'image-padding';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image Padding"
      description="Add uniform or per-side padding around your images"
      category={cat}
      toolId={toolId}
    >
      <ImagePaddingClientWrapper />

      <LearningHub title="Understanding Rasterized Padding">
        
        <LearningSection type="architecture" title="CSS vs Canvas Box Model">
          <p>In HTML and CSS, adding padding is incredibly simple: you just write <code>padding: 20px 40px</code> and the browser's layout engine automatically pushes the content inward.</p>
          <p className="mt-2">But when dealing with raw rasterized image files on an HTML5 Canvas, there is no automatic "Box Model". The code has to calculate the math manually and literally redraw the entire image from scratch.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Calculating the New Bounding Box">
          <p>If you have a 500x500 image, and you want 10px of top padding and 20px of bottom padding, the new image height is not simply stretched to 520.</p>
          <p className="mt-2">The system calculates: <code>Original Height (500) + Top Padding (10) + Bottom Padding (20)</code> resulting in a brand new target height of 530px.</p>
        </LearningSection>

        <LearningSection type="api" title="Displacing the Origin">
          <p>To render this padding, the tool creates a new 500x530 Canvas and fills it with your chosen background color.</p>
          <p className="mt-2">Crucially, it cannot just draw the original image at coordinate <code>0,0</code> (the top left), because that would completely ignore the top and left padding.</p>
          <p className="mt-2">Instead, it must instruct the canvas API to draw the original image exactly at the coordinate <code>(LeftPadding, TopPadding)</code>. By displacing the origin point of the drawing, it perfectly simulates the CSS padding effect on a flat, rasterized image.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you have a 200x200 image, and apply 50px of padding to all four sides, what is the final image size?",
                options: [
                  "250x250",
                  "300x300",
                  "200x200 (padding goes inwards)",
                  "400x400"
                ],
                correctIndex: 1,
                explanation: "The width is 200 + 50(left) + 50(right) = 300. The height is 200 + 50(top) + 50(bottom) = 300."
              },
              {
                question: "When applying top and left padding, what must the rendering engine do?",
                options: [
                  "Use CSS padding properties on the image tag.",
                  "Resize the original image to be smaller.",
                  "Shift the X and Y coordinates where the image is drawn onto the new canvas.",
                  "Apply a CSS margin."
                ],
                correctIndex: 2,
                explanation: "Because there is no CSS box model on a flat raster canvas, the drawing coordinates must be manually shifted by the padding amounts (e.g. draw at X=LeftPadding, Y=TopPadding)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
