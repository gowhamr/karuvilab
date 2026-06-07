import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import NpsCalculatorWrapper from './NpsCalculatorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'NPS Calculator – KV',
  description: 'Calculate National Pension System returns.',
  alternates: { canonical: 'https://karuvilab.com/tools/calculators/nps-calculator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NPS Calculator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/calculators/nps-calculator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="nps-calculator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="NPS Calculator">
        <NpsCalculatorWrapper />
      </ToolShell>
    </>
  );
}