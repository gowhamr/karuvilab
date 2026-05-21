import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import FakeDataGeneratorClient from "./FakeDataGeneratorClient";

const toolId = "fake-data-generator";
const category = CATEGORIES.find(c => c.id === "developer")!;

export const metadata: Metadata = {
  title: "Fake Data Generator — KaruviLab",
  description: "Generate realistic mock data for your applications. Secure, private, and 100% client-side.",
};

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
