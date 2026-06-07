import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import UnixTimestampWrapper from './UnixTimestampWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter – KV',
  description: 'Convert Unix timestamps to human-readable dates and back.',
  alternates: { canonical: 'https://karuvilab.com/tools/developer-tools/unix-timestamp/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Unix Timestamp Converter',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/developer-tools/unix-timestamp/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="unix-timestamp-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Unix Timestamp Converter">
        <UnixTimestampWrapper />
      </ToolShell>
    </>
  );
}