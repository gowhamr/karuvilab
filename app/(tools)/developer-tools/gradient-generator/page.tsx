import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import GradientGeneratorWrapper from './GradientGeneratorWrapper';

const toolId = 'gradient-generator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="CSS Gradient Generator"
      description="Visual CSS gradient builder."
      category={cat}
      toolId={toolId}
    >
      <GradientGeneratorWrapper />

      <LearningHub title="Understanding CSS Gradients and Interpolation">
        
        <LearningSection type="architecture" title="Color Interpolation">
          <p>When you ask the browser to transition from Red (<code>#FF0000</code>) to Green (<code>#00FF00</code>), it doesn't just guess. It mathematically calculates the exact color steps between those two points using an algorithm called <strong>Interpolation</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Muddy Middle (RGB)">
          <p>Historically, browsers interpolated colors directly in the RGB color space. This causes a major visual problem known as the "Muddy Middle".</p>
          <p className="mt-2">If you transition from Blue to Yellow in RGB math, the halfway point is roughly <code>#808080</code> (Gray). This creates a very ugly, desaturated dead zone right in the middle of your beautiful gradient, ruining the aesthetic.</p>
        </LearningSection>

        <LearningSection type="standards" title="Modern Color Spaces (OKLCH)">
          <p>Modern CSS allows you to explicitly declare the color space used for interpolation (e.g., <code>in oklch</code> or <code>in hsl</code>).</p>
          <p className="mt-2">If you interpolate in the <code>oklch</code> (Perceptually Uniform) color space, the browser transitions across the color wheel rather than cutting straight through the gray center of the RGB cube. This maintains maximum saturation throughout the transition, resulting in incredibly vibrant, professional-looking gradients.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do standard RGB gradients sometimes look 'muddy' or grayish in the middle?",
                options: [
                  "Because monitors cannot display more than 256 colors at once.",
                  "Because mathematically interpolating between opposite colors in a 3D RGB cube passes near the desaturated center (gray).",
                  "Because CSS limits gradient rendering to 8-bit precision.",
                  "Because the browser compresses the colors to save memory."
                ],
                correctIndex: 1,
                explanation: "In an RGB cube, mixing opposites mathematically results in gray. Interpolating in circular color spaces like HSL or OKLCH avoids the gray center by walking around the edge of the color wheel."
              },
              {
                question: "Which modern CSS feature solves the 'muddy middle' problem in gradients?",
                options: [
                  "background-blend-mode",
                  "Hardware accelerated GPU rendering",
                  "Specifying an interpolation color space like 'in oklch'",
                  "Using SVG gradients instead of CSS"
                ],
                correctIndex: 2,
                explanation: "Modern CSS allows syntax like 'linear-gradient(in oklch, blue, yellow)', instructing the browser to use perceptual math rather than raw RGB math."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
