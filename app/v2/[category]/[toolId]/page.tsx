// app/v2/[category]/[toolId]/page.tsx
import { notFound } from "next/navigation";
import { toolConfigMap } from "@/src/tool-engine/registry";
import { ToolShell } from "@/src/tool-engine/core/ToolShell";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    category: string;
    toolId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolId } = await params;
  const config = toolConfigMap.get(toolId);
  
  if (!config) return {};

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
  };
}

export default async function ToolEnginePage({ params }: PageProps) {
  const { toolId } = await params;
  const config = toolConfigMap.get(toolId);

  if (!config) {
    notFound();
  }

  return <ToolShell config={config} />;
}
