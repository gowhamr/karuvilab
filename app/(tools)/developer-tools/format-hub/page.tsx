import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES, findToolById } from "@/src/tool-registry";
import { Metadata } from "next";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const toolId = "format-hub";
export const metadata: Metadata = generateToolMetadata(toolId);

const hubTools = [
  'yaml-validator',
  'json-formatter',
  'diff-checker',
  'code-minifier',
  'base64',
  'url-encoder',
];

export default function FormatHubPage() {
  const cat = CATEGORIES.find(c => c.id === 'developer-tools')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Format & Convert Hub"
      description="A central hub for all your data formatting and conversion needs."
      category={cat}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hubTools.map(id => {
          const tool = findToolById(id);
          if (!tool) return null;
          return (
            <Link href={tool.href} key={id} className="block p-6 bg-surface border-2 border-border rounded-2xl hover:border-blue transition-colors group">
              <h3 className="font-bold text-lg text-text group-hover:text-blue">{tool.name}</h3>
              <p className="text-sm text-text-3 mt-1">{tool.desc}</p>
              <div className="flex justify-end mt-4">
                <ArrowRight className="w-5 h-5 text-text-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </ToolShell>
  );
}
