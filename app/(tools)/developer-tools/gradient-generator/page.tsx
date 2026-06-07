import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import GradientGeneratorWrapper from './GradientGeneratorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'CSS Gradient Generator – KV',
  description: 'Visual CSS gradient builder.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/gradient-generator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CSS Gradient Generator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/gradient-generator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="gradient-generator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="CSS Gradient Generator">
        <GradientGeneratorWrapper />
      </ToolShell>
    </>
  );
}