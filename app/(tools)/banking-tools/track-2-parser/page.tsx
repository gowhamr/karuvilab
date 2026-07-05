import { Metadata } from 'next';
import { track2Parser } from '@/src/registry/tools/track-2-parser';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export const metadata: Metadata = generateToolMetadata(track2Parser);

export default function Track2ParserPage() {
  return (
    <ToolShell toolId={track2Parser.id}>
      <ToolClientWrapper />
    </ToolShell>
  );
}
