import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import LuhnClientWrapper from './LuhnClientWrapper';

const toolId = 'luhn-validator';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Luhn Algorithm Checksum Validator"
      description="Validate credit card numbers, IMEIs, and account IDs using the Luhn Mod 10 checksum algorithm."
      category={cat}
      toolId={toolId}
    >
      <LuhnClientWrapper />
    </ToolShell>
  );
}
