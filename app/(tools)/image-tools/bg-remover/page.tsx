import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import BgRemoverClientWrapper from "./BgRemoverClientWrapper";

export const metadata: Metadata = generateToolMetadata("bg-remover");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Background Remover"
      description="Remove solid or near-solid backgrounds from images using color threshold matching."
      category={cat}
    >
      <BgRemoverClientWrapper />
    </ToolShell>
  );
}
