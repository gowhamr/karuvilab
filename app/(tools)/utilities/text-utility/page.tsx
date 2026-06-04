import TextUtilityClientWrapper from "./TextUtilityClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("text-utility");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="Text Utility"
      description="Case conversion, line sorting, text cleaning, and character count — all in one place."
      category={cat}
    >
      <TextUtilityClientWrapper />
    </ToolShell>
  );
}
