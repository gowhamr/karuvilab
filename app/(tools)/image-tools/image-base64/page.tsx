import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import ImageBase64ClientWrapper from "./ImageBase64ClientWrapper";

export const metadata: Metadata = generateToolMetadata("image-base64");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image to Base64"
      description="Encode images as Base64 data URIs or decode data URIs back to images."
      category={cat}
    >
      <ImageBase64ClientWrapper />
    </ToolShell>
  );
}
