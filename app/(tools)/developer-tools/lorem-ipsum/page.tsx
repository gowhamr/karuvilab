import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import LoremIpsumWrapper from './LoremIpsumWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator – KV',
  description: 'Generate Lorem Ipsum placeholder text.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/lorem-ipsum/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Lorem Ipsum Generator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/lorem-ipsum/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="lorem-ipsum-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Lorem Ipsum Generator">
        <LoremIpsumWrapper />
      </ToolShell>
    </>
  );
}