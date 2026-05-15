import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const FileValidatorClient = dynamic(() => import("./FileValidatorClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("validate");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="File Validator"
      description="Inspect file metadata, verify magic bytes against extension, and check image dimensions."
      category={cat}
    >
      <FileValidatorClient />
    </ToolShell>
  );
}
