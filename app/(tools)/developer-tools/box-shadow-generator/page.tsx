import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import BoxShadowGeneratorWrapper from './BoxShadowGeneratorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Box Shadow Generator – KV',
  description: 'Visual box shadow generator.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/box-shadow-generator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Box Shadow Generator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/box-shadow-generator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="box-shadow-generator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Box Shadow Generator">
        <BoxShadowGeneratorWrapper />
      </ToolShell>
    </>
  );
}