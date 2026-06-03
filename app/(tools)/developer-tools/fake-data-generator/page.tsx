import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import FakeDataGeneratorClient from "./FakeDataGeneratorClient";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "fake-data-generator";
const category = CATEGORIES.find(c => c.id === "developer")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function FakeDataGeneratorPage() {
  return (
    <ToolShell
      title="Fake Data Generator"
      description="Create JSON or CSV datasets for testing, development, and prototypes without any server overhead."
      category={category}
      toolId={toolId}
    >
      <FakeDataGeneratorClient />
    </ToolShell>
  );
}
