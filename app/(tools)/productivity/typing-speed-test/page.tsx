import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import TypingSpeedTestClient from "./TypingSpeedTestClient";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "typing-speed-test";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TypingSpeedTestPage() {
  return (
    <ToolShell
      title="Typing Speed Test"
      description="Measure your Words Per Minute (WPM) and accuracy with our precise, client-side typing test. Track your progress offline."
      category={category}
      toolId={toolId}
    >
      <TypingSpeedTestClient />
    </ToolShell>
  );
}
