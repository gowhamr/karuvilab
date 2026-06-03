import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const TextUtilityClient = dynamic(() => import("./TextUtilityClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("text-utility");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="Text Utility"
      description="Case conversion, line sorting, text cleaning, and character count — all in one place."
      category={cat}
    >
      <TextUtilityClient />
    </ToolShell>
  );
}
