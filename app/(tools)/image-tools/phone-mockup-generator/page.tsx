import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import PhoneMockupGeneratorClient from "./PhoneMockupGeneratorClient";

const toolId = "phone-mockup-generator";
const category = CATEGORIES.find(c => c.id === "image")!;

export const metadata: Metadata = {
  title: "Phone Mockup Generator — KaruviLab",
  description: "Create professional device mockups for your screenshots. Private, fast, and 100% browser-native.",
};

export default function PhoneMockupGeneratorPage() {
  return (
    <ToolShell
      title="Phone Mockup Generator"
      description="Wrap your app screenshots in realistic iPhone and Android frames. Perfect for marketing, presentations, and portfolios."
      category={category}
      toolId={toolId}
    >
      <PhoneMockupGeneratorClient />
    </ToolShell>
  );
}
