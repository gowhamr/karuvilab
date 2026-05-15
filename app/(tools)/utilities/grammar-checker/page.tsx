import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const GrammarCheckerClient = dynamic(() => import("./GrammarCheckerClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("grammar-checker");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="Grammar Checker"
      description="Basic grammar and spelling check. For comprehensive checking, use Grammarly or LanguageTool."
      category={cat}
    >
      <GrammarCheckerClient />
    </ToolShell>
  );
}
