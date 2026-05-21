import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import TimeZoneConverterClient from "./TimeZoneConverterClient";

const toolId = "timezone-converter";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = {
  title: "Time Zone Converter — KaruviLab",
  description: "Convert dates and times between multiple time zones instantly and privately in your browser.",
};

export default function TimeZoneConverterPage() {
  return (
    <ToolShell
      title="Time Zone Converter"
      description="Compare and convert times across different regions. Perfect for scheduling meetings and remote work."
      category={category}
      toolId={toolId}
    >
      <TimeZoneConverterClient />
    </ToolShell>
  );
}
