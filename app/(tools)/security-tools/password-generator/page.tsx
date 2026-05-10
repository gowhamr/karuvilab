import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const PasswordGeneratorClient = dynamic(() => import("./PasswordGeneratorClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("password-generator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="Password Generator"
      description="Generate strong, random passwords with customizable options."
      category={cat}
    >
      <PasswordGeneratorClient />
    </ToolShell>
  );
}
