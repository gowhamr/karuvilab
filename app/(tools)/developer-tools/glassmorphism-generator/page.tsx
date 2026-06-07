import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import GlassmorphismGeneratorWrapper from './GlassmorphismGeneratorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Glassmorphism Generator – KV',
  description: 'Glassmorphism CSS generator.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/glassmorphism-generator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Glassmorphism Generator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/glassmorphism-generator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="glassmorphism-generator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Glassmorphism Generator">
        <GlassmorphismGeneratorWrapper />
      </ToolShell>
    </>
  );
}