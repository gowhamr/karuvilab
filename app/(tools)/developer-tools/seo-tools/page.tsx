import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import SeoToolsClientWrapper from './SeoToolsClientWrapper';
import { ALL_TOOLS } from '@/src/tool-registry';

const tool = ALL_TOOLS.find(t => t.id === 'seo-tools');

export const metadata: Metadata = {
  title: `${tool?.name} – KV`,
  description: tool?.desc,
  alternates: {
    canonical: `https://karuvilab.com${tool?.href}/`,
  },
};

export default function SeoToolsPage() {
  return (
    <ToolShell title={tool?.name || 'SEO Tools'} description={tool?.desc || ''}>
      <SeoToolsClientWrapper />
    </ToolShell>
  );
}
