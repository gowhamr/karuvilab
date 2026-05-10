import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const JWTDecoderClient = dynamic(() => import("./JWTDecoderClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("jwt-decoder");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens — header, payload claims, and expiry status."
      category={cat}
    >
      <JWTDecoderClient />
    </ToolShell>
  );
}
