import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';

export const metadata: Metadata = {
  title: 'AI Image Upscaler (Super Resolution) – KV',
  description: 'Upscale and enhance images 2x or 4x locally in your browser using Real-ESRGAN local AI. 100% private, offline-first, and free.',
  keywords: ['ai image upscaler', 'super resolution', 'realesrgan', 'enhance image quality', 'privacy image tool', 'local ai'],
  alternates: {
    canonical: 'https://karuvilab.com/image-tools/super-resolution/'
  },
  openGraph: {
    title: 'AI Image Upscaler (Super Resolution) – KV',
    description: 'Upscale and enhance images 2x or 4x locally in your browser using Real-ESRGAN local AI. 100% private, offline-first, and free.',
    url: 'https://karuvilab.com/image-tools/super-resolution/',
    type: 'website'
  }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'AI Image Upscaler (Super Resolution)',
    'url': 'https://karuvilab.com/image-tools/super-resolution/',
    'description': 'Upscale and enhance images 2x or 4x locally in your browser using Real-ESRGAN local AI. 100% private, offline-first, and free.',
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
      <ToolShell title="AI Image Upscaler">
        <ToolClientWrapper />
      </ToolShell>
    </>
  );
}
