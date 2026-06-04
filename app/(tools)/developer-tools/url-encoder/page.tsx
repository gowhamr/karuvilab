import URLEncoderClientWrapper from "./URLEncoderClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("url-encoder");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Encode or decode URL components using encodeURIComponent / decodeURIComponent."
      category={cat}
    >
      <URLEncoderClientWrapper />
    </ToolShell>
  );
}
