import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const toolId = "yaml-validator";
const YamlClient = dynamic(() => import("./YamlValidatorClient"), {
  loading: () => <div className="w-full h-[60vh] bg-surface rounded-3xl animate-pulse" />,
});

export const metadata: Metadata = generateToolMetadata(toolId);

export default function YamlValidatorPage() {
  const cat = CATEGORIES.find(c => c.id === 'developer-tools')!;
  
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
