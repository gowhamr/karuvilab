import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { track2Parser } from '@/src/registry/tools/track-2-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(track2Parser.id);

export default function Track2ParserPage() {
  return (
    <ToolShell title={track2Parser.name} toolId={track2Parser.id} category={cat}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
