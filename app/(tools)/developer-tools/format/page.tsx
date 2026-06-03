import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const CodeFormatterClient = dynamic(() => import("@/src/features/format"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("format");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="Code Formatter"
      description="Format JSON, HTML, CSS, SQL, and Markdown. Note: for production-quality formatting, consider Prettier locally."
      category={cat}
    >
      <CodeFormatterClient />
    </ToolShell>
  );
}
