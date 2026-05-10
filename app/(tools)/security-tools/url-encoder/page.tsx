import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const URLEncoderClient = dynamic(() => import("./URLEncoderClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("url-encoder");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Encode or decode URL components using encodeURIComponent / decodeURIComponent."
      category={cat}
    >
      <URLEncoderClient />
    </ToolShell>
  );
}
