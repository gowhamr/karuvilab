import RegexTesterClientWrapper from "./RegexTesterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("regex-tester");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="Regex Tester"
      description="Test regular expressions with live match highlighting, match positions, and capture groups."
      category={cat}
    >
      <RegexTesterClientWrapper />
    </ToolShell>
  );
}
