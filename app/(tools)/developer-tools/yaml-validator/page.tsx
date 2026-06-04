import YamlClientWrapper from "./YamlClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";

const toolId = "yaml-validator";


export const metadata: Metadata = generateToolMetadata(toolId);

export default function YamlValidatorPage() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;

  
  return (
    <ToolShell
      toolId={toolId}
      title="YAML Validator & Converter"
      description="Validate YAML syntax and convert between YAML and JSON seamlessly."
      category={cat}
    >
      <YamlClientWrapper />
    </ToolShell>
  );
}
