import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const ImageBase64Client = dynamic(() => import("./ImageBase64Client"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("image-base64");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Image to Base64"
      description="Encode images as Base64 data URIs or decode data URIs back to images."
      category={cat}
    >
      <ImageBase64Client />
    </ToolShell>
  );
}
