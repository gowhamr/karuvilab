import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "phone-mockup-generator";
const category = CATEGORIES.find(c => c.id === "image")!;

const PhoneMockupGeneratorClient = dynamic(() => import("./PhoneMockupGeneratorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function PhoneMockupGeneratorPage() {
  return (
    <ToolShell
      title="Phone Mockup Generator"
      description="Wrap your app screenshots in realistic iPhone and Android frames. Perfect for marketing, presentations, and portfolios."
      category={category}
      toolId={toolId}
    >
      <PhoneMockupGeneratorClient />
    </ToolShell>
  );
}
