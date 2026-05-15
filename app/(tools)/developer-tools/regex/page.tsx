import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const RegexTesterClient = dynamic(() => import("./RegexTesterClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("regex");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="Regex Tester"
      description="Test regular expressions with live match highlighting, match positions, and capture groups."
      category={cat}
    >
      <RegexTesterClient />
    </ToolShell>
  );
}
