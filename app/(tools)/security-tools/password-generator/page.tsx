import PasswordGeneratorClientWrapper from "./PasswordGeneratorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("password-generator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  return (
    <ToolShell
      title="Password Generator"
      description="Generate strong, random passwords with customizable options."
      category={cat}
    >
      <PasswordGeneratorClientWrapper />
    </ToolShell>
  );
}
