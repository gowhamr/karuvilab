import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';

export const metadata: Metadata = {
  title: 'AI Document Intelligence & PDF Cleanup – KV',
  description: 'Clean up scanned PDFs, auto-deskew pages, remove noise, and extract searchable text using local AI. 100% private and offline-first.',
  keywords: ['ai pdf cleanup', 'searchable pdf generator', 'deskew pdf', 'ocr pdf', 'document intelligence', 'local ai'],
  alternates: {
    canonical: 'https://karuvilab.com/pdf-tools/ai-pdf-cleanup/'
  },
  openGraph: {
    title: 'AI Document Intelligence & PDF Cleanup – KV',
    description: 'Clean up scanned PDFs, auto-deskew pages, remove noise, and extract searchable text using local AI. 100% private and offline-first.',
    url: 'https://karuvilab.com/pdf-tools/ai-pdf-cleanup/',
    type: 'website'
  }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'AI Document Intelligence & PDF Cleanup',
    'url': 'https://karuvilab.com/pdf-tools/ai-pdf-cleanup/',
    'description': 'Clean up scanned PDFs, auto-deskew pages, remove noise, and extract searchable text using local AI. 100% private and offline-first.',
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolShell title="AI Document Intelligence & PDF Cleanup">
        <ToolClientWrapper />
      </ToolShell>
    </>
  );
}
