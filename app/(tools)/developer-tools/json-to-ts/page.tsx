import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import JsonToTsClientWrapper from '@/src/features/json-to-ts/JsonToTsClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("json-to-ts");
}

export default function Page() {
  return (
    <ToolShell toolId="json-to-ts" title="JSON to TypeScript">
      <JsonToTsClientWrapper />
    </ToolShell>
  );
}
