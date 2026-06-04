import DiffCheckerClientWrapper from "./DiffCheckerClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("diff-checker");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="Diff Checker"
      description="Compare two text blocks line by line. Added lines in green, removed in red."
      category={cat}
    >
      <DiffCheckerClientWrapper />
    </ToolShell>
  );
}
