import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import GratuityCalculatorWrapper from './GratuityCalculatorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Gratuity Calculator – KV',
  description: 'Calculate Gratuity amount.',
  alternates: { canonical: 'https://karuvilab.com/tools/calculators/gratuity-calculator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gratuity Calculator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/calculators/gratuity-calculator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="gratuity-calculator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Gratuity Calculator">
        <GratuityCalculatorWrapper />
      </ToolShell>
    </>
  );
}