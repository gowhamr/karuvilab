import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const MergePdfClient = dynamic(() => import("./MergePdfClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("merge-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Merge PDF"
      description="Combine multiple PDF files into one — all processing happens in your browser."
      category={cat}
    >
      <MergePdfClient />
    </ToolShell>
  );
}
