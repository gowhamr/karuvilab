import JWTDecoderClientWrapper from "./JWTDecoderClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("jwt-decoder");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens — header, payload claims, and expiry status."
      category={cat}
    >
      <JWTDecoderClientWrapper />
    </ToolShell>
  );
}
