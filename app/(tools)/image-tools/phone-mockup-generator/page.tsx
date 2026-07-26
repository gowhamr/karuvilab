import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import PhoneMockupGeneratorClientWrapper from "./PhoneMockupGeneratorClientWrapper";

const toolId = "phone-mockup-generator";
const category = CATEGORIES.find(c => c.id === "image")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function PhoneMockupGeneratorPage() {
  return (
    <ToolShell
      title="Phone Mockup Generator"
      description="Wrap your app screenshots in realistic iPhone and Android frames. Perfect for marketing, presentations, and portfolios."
      category={category}
      toolId={toolId}
    >
      <PhoneMockupGeneratorClientWrapper />

      <LearningHub title="Understanding Image Compositing">
        
        <LearningSection type="architecture" title="The Clipping Problem">
          <p>When you generate a mockup, the tool doesn't just paste your screenshot blindly on top of a phone picture.</p>
          <p className="mt-2">If it did, the sharp, square corners of your screenshot would stick out past the rounded corners of the phone bezel, and you'd be covering up the phone's camera notch or dynamic island.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Destination-Over Compositing">
          <p>To make the mockup look perfectly realistic without complex manual masking, we use the HTML5 Canvas <code>globalCompositeOperation</code> property, specifically setting it to <code>destination-over</code>.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Step 1:</strong> We first draw the Phone Frame. The frame is a transparent PNG where the "screen" area is completely transparent, but the bezel, corners, and notch are solid.</li>
            <li><strong>Step 2:</strong> We draw your screenshot. But because we set the composite operation to <code>destination-over</code>, your screenshot is mathematically forced to render <em>underneath</em> the existing phone frame.</li>
          </ul>
        </LearningSection>

        <LearningSection type="algorithm" title="Perfect Intersections">
          <p>Because your screenshot renders underneath, the rounded corners and the "notch" of the phone frame naturally overlap your image.</p>
          <p className="mt-2">This creates a perfect, clipping-free mockup without requiring any complex polygon intersection math to trim the corners of your screenshot.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you draw an image on a Canvas using 'destination-over', where does it appear?",
                options: [
                  "On top of all existing drawings.",
                  "Underneath (behind) all existing drawings.",
                  "It deletes the existing drawings.",
                  "It blends the colors together."
                ],
                correctIndex: 1,
                explanation: "Destination-over literally means 'put this new drawing under the existing destination'. It draws the new pixels behind what is already there."
              },
              {
                question: "Why do we draw the Phone Frame first, instead of the screenshot?",
                options: [
                  "Because phones are heavier than screenshots.",
                  "Because the frame has a transparent cutout for the screen. By drawing the screenshot behind the frame later, the frame's solid corners and notch automatically hide the sharp corners of the screenshot.",
                  "It's faster for the browser to render.",
                  "Because iPhones require special rendering."
                ],
                correctIndex: 1,
                explanation: "The phone frame acts like a stencil window. By drawing the frame first, anything drawn behind it later will only peek through the transparent window."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
