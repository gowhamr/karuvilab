import RotatePdfClientWrapper from "./RotatePdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("rotate-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Rotate PDF"
      description="Rotate one or all pages of a PDF by 90°, 180°, or 270°."
      category={cat}
    >
      <RotatePdfClientWrapper />
    </ToolShell>
  );
}
