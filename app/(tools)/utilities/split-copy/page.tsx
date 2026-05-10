import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const SplitCopyClient = dynamic(() => import("./SplitCopyClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("split-copy");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="Split & Copy"
      description="Break long text into chunks and copy each part individually."
      category={cat}
    >
      <SplitCopyClient />
    </ToolShell>
  );
}
