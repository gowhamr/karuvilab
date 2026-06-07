import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CspBuilderWrapper from './CspBuilderWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'CSP Builder – KV',
  description: 'Content Security Policy builder.',
  alternates: { canonical: 'https://karuvilab.com/tools/security-tools/csp-builder/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CSP Builder',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/security-tools/csp-builder/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="csp-builder-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="CSP Builder">
        <CspBuilderWrapper />
      </ToolShell>
    </>
  );
}