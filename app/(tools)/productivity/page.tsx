import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ProductivityPageClient from './ProductivityPageClient';

const toolId = 'page.tsx';
const cat = CATEGORIES.find(c => c.id === 'productivity');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Productivity Tools — Manage Your Workflow Privately"
      description="Free, private productivity tools including Calendar. 100% browser-side with no data uploads."
      category={cat}
      toolId={toolId}
    >
      <ProductivityPageClient />
    </ToolShell>
  );
}
