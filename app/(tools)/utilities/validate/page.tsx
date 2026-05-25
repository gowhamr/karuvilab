import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import FileValidatorClientWrapper from "./FileValidatorClientWrapper";

export const metadata: Metadata = generateToolMetadata("validate");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="File Validator"
      description="Inspect file metadata, verify magic bytes against extension, and check image dimensions."
      category={cat}
    >
      <FileValidatorClientWrapper />
    </ToolShell>
  );
}
