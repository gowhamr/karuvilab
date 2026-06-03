import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
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
    </ToolShell>
  );
}
