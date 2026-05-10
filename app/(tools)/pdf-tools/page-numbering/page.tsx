import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const PageNumberingClient = dynamic(() => import("./PageNumberingClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("page-numbering");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Page Numbering"
      description="Add page numbers to every page of your PDF."
      category={cat}
    >
      <PageNumberingClient />
    </ToolShell>
  );
}
