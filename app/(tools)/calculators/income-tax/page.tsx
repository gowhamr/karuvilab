import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import IncomeTaxWrapper from './IncomeTaxWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Income Tax Calculator – KV',
  description: 'Calculate income tax for FY 2025-26.',
  alternates: { canonical: 'https://karuvilab.com/tools/calculators/income-tax/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Income Tax Calculator',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/calculators/income-tax/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="income-tax-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Income Tax Calculator">
        <IncomeTaxWrapper />
      </ToolShell>
    </>
  );
}