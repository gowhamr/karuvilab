import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import SvgConverterClientWrapper from './SvgConverterClientWrapper';

const toolId = 'svg-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="SVG to PNG" description="Rasterize vector SVG files to transparent PNGs" category={cat} toolId={toolId}>
      <SvgConverterClientWrapper />

      <LearningHub title="Understanding Vector Rasterization">
        
        <LearningSection type="architecture" title="Math vs Pixels">
          <p>An SVG (Scalable Vector Graphic) is fundamentally different from a JPG or PNG. A JPG is a literal physical grid of colored pixels.</p>
          <p className="mt-2">An SVG is actually just a text file containing XML markup and mathematical equations (e.g., <code>&lt;circle cx="50" cy="50" r="40" fill="red" /&gt;</code>).</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="The Rasterization Process">
          <p>Because an SVG is math, it can be drawn at the size of a postage stamp or the size of a billboard with perfect sharpness. But to save it as a standard PNG image, we must <strong>Rasterize</strong> it—converting the math back into a static grid of pixels.</p>
          <p className="mt-2">To do this securely in the browser, this tool reads your SVG text file, encodes it into a Data URI, and loads it into a virtual <code>&lt;img&gt;</code> tag in memory.</p>
        </LearningSection>

        <LearningSection type="api" title="Canvas Freezing">
          <p>We then draw that virtual image onto a physical HTML5 Canvas at your requested resolution.</p>
          <p className="mt-2">This forces the browser's C++ rendering engine to calculate the math for that specific size and freeze the output into hard pixels, which can then be exported as a standard PNG file.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does an SVG file never get pixelated or blurry when you zoom in on it?",
                options: [
                  "Because it contains billions of hidden pixels.",
                  "Because it is rendered by a server.",
                  "Because it is not an image made of pixels, but a text file containing math equations that the browser recalculates at any size.",
                  "Because it uses AI to enhance the image."
                ],
                correctIndex: 2,
                explanation: "SVGs are vector graphics. The browser's rendering engine constantly recalculates the math to draw perfectly crisp lines at whatever zoom level you are viewing."
              },
              {
                question: "What does 'Rasterizing' an SVG mean?",
                options: [
                  "Making the file size smaller.",
                  "Translating the mathematical equations into a static grid of physical pixels (like a PNG).",
                  "Animating the SVG paths.",
                  "Uploading it to a server."
                ],
                correctIndex: 1,
                explanation: "Rasterization is the process of converting vector math into a fixed raster grid (pixels) so it can be saved as a standard image format."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
