import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "fake-data-generator";
const category = CATEGORIES.find(c => c.id === "developer")!;

const FakeDataGeneratorClient = dynamic(() => import("./FakeDataGeneratorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function FakeDataGeneratorPage() {
  return (
    <ToolShell
      title="Fake Data Generator"
      description="Create JSON or CSV datasets for testing, development, and prototypes without any server overhead."
      category={category}
      toolId={toolId}
    >
      <FakeDataGeneratorClient />
    </ToolShell>
  );
}
