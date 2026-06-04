import LockUnlockPdfClientWrapper from "./LockUnlockPdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("lock-unlock-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Lock / Unlock PDF"
      description="Add password protection to a PDF or remove it — all in your browser."
      category={cat}
    >
      <LockUnlockPdfClientWrapper />
    </ToolShell>
  );
}
