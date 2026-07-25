import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import PhoneMockupGeneratorClientWrapper from "./PhoneMockupGeneratorClientWrapper";

import { generateToolMetadata } from "@/src/lib/seo";

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-mockup"
          title="How it Works: Clipping and Z-Index"
          preview="Learn how your screenshot is magically placed 'inside' the phone frame."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you generate a mockup, the tool doesn't just paste your screenshot on top of a phone picture. If it did, the square corners of your screenshot would stick out past the rounded corners of the phone bezel.
            </p>
            <h3>Destination-Over Compositing</h3>
            <p>
              To make it look realistic, we use the HTML5 Canvas <code>globalCompositeOperation = 'destination-over'</code> property.
            </p>
            <ul>
              <li><strong>Step 1:</strong> We draw the Phone Frame. The phone frame is a transparent PNG where the "screen" area is completely transparent, but the bezel and notch are solid.</li>
              <li><strong>Step 2:</strong> We draw your screenshot. But because we set the composite operation to <code>destination-over</code>, your screenshot is mathematically forced to render <em>underneath</em> the phone frame.</li>
            </ul>
            <p>
              Because your screenshot renders underneath, the rounded corners and the "notch" (or dynamic island) of the phone frame naturally overlap your image, creating a perfect, clipping-free mockup.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
