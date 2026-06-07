import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import UuidGeneratorWrapper from './UuidGeneratorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'UUID Generator – KV',
  description: 'Generate RFC-compliant UUIDs (v1, v4, v5, v7).',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/uuid-generator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'UUID Generator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/uuid-generator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="uuid-generator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="UUID Generator">
        <UuidGeneratorWrapper />
      </ToolShell>
    </>
  );
}