import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';

export const metadata: Metadata = {
  title: 'AI Face Blur & Privacy Shield – KV',
  description: 'Automatically blur faces and PII objects in photos using local AI (YOLOv8). 100% private, offline-first, and zero server uploads.',
  keywords: ['face blur', 'blur faces in photo', 'pii privacy shield', 'ai face detection', 'anonymize photo', 'local ai'],
  alternates: {
    canonical: 'https://karuvilab.com/image-tools/face-blur/'
  },
  openGraph: {
    title: 'AI Face Blur & Privacy Shield – KV',
    description: 'Automatically blur faces and PII objects in photos using local AI (YOLOv8). 100% private, offline-first, and zero server uploads.',
    url: 'https://karuvilab.com/image-tools/face-blur/',
    type: 'website'
  }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'AI Face Blur & Privacy Shield',
    'url': 'https://karuvilab.com/image-tools/face-blur/',
    'description': 'Automatically blur faces and PII objects in photos using local AI (YOLOv8). 100% private, offline-first, and zero server uploads.',
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
      <ToolShell title="AI Face Blur & Privacy Shield">
        <ToolClientWrapper />
      </ToolShell>
    </>
  );
}
