import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const HTMLEntitiesClient = dynamic(() => import("./HTMLEntitiesClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("html-entities");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="HTML Entities Converter"
      description="Encode special characters to HTML entities or decode HTML entities back to text."
      category={cat}
    >
      <HTMLEntitiesClient />
    </ToolShell>
  );
}
