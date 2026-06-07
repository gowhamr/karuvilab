import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import HraCalculatorWrapper from './HraCalculatorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'HRA Calculator – KV',
  description: 'Calculate HRA exemption limit.',
  alternates: { canonical: 'https://karuvilab.com/tools/calculators/hra-calculator/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HRA Calculator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/calculators/hra-calculator/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="hra-calculator-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="HRA Calculator">
        <HraCalculatorWrapper />
      </ToolShell>
    </>
  );
}