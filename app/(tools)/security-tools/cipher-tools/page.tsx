import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CipherToolsWrapper from './CipherToolsWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Text Cipher Tools – KV',
  description: 'Caesar, ROT13, Vigenere, XOR ciphers.',
  alternates: { canonical: 'https://karuvilab.com/tools/security-tools/cipher-tools/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Text Cipher Tools',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/security-tools/cipher-tools/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="cipher-tools-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="Text Cipher Tools">
        <CipherToolsWrapper />
      </ToolShell>
    </>
  );
}