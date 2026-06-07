import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import TdsCalculatorWrapper from './TdsCalculatorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'TDS Calculator – KV',
  description: 'Calculate Tax Deducted at Source.',
  alternates: { canonical: 'https://karuvilab.com/tools/calculators/tds-calculator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TDS Calculator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/calculators/tds-calculator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="tds-calculator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="TDS Calculator">
        <TdsCalculatorWrapper />
      </ToolShell>
    </>
  );
}