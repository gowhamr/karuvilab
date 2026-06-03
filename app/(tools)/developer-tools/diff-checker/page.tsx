import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const DiffCheckerClient = dynamic(() => import("@/src/features/diff-checker"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("diff-checker");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="Diff Checker"
      description="Compare two text blocks line by line. Added lines in green, removed in red."
      category={cat}
    >
      <DiffCheckerClient />
    </ToolShell>
  );
}
