import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import HmacGeneratorWrapper from './HmacGeneratorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'HMAC Generator – KV',
  description: 'Generate HMAC signatures.',
  alternates: { canonical: 'https://karuvilab.com/tools/security-tools/hmac-generator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HMAC Generator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/security-tools/hmac-generator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="hmac-generator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="HMAC Generator">
        <HmacGeneratorWrapper />
      </ToolShell>
    </>
  );
}