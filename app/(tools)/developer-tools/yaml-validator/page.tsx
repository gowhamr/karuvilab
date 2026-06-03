import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "yaml-validator";
const YamlClient = dynamic(() => import("./YamlValidatorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

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
      <YamlClient />
    </ToolShell>
  );
}
