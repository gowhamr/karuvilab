import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import XmlFormatterWrapper from './XmlFormatterWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'XML Formatter – KV',
  description: 'Format, minify, and validate XML.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/xml-formatter/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'XML Formatter',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/xml-formatter/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="xml-formatter-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="XML Formatter">
        <XmlFormatterWrapper />
      </ToolShell>
    </>
  );
}