import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import YamlJsonClientWrapper from './YamlJsonClientWrapper';

const toolId = 'yaml-json-converter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="YAML ↔ JSON Converter"
      description="Bi-directional YAML to JSON and JSON to YAML converter with syntax validation."
      category={cat}
      toolId={toolId}
    >
      <YamlJsonClientWrapper />
    </ToolShell>
  );
}
