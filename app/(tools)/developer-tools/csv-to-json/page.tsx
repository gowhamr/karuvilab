import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CsvToJsonWrapper from './CsvToJsonWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter – KV',
  description: 'Convert CSV to JSON and JSON to CSV.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/csv-to-json/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CSV to JSON Converter',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/csv-to-json/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="csv-to-json-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="CSV to JSON Converter">
        <CsvToJsonWrapper />
      </ToolShell>
    </>
  );
}