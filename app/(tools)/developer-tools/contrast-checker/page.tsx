import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ContrastCheckerWrapper from './ContrastCheckerWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Contrast Checker – KV',
  description: 'WCAG contrast ratio checker.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/contrast-checker/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Contrast Checker',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/contrast-checker/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="contrast-checker-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Contrast Checker">
        <ContrastCheckerWrapper />
      </ToolShell>
    </>
  );
}