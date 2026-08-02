import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';

export const metadata: Metadata = {
  title: 'AI Background Remover – KV',
  description: 'Remove image backgrounds automatically in your browser using local AI (ONNX Runtime Web + WebAssembly). 100% private, offline-first, and free.',
  keywords: ['background remover', 'ai background removal', 'remove image background', 'local ai', 'privacy image tool'],
  alternates: {
    canonical: 'https://karuvilab.com/image-tools/bg-remover/'
  },
  openGraph: {
    title: 'AI Background Remover – KV',
    description: 'Remove image backgrounds automatically in your browser using local AI (ONNX Runtime Web + WebAssembly). 100% private, offline-first, and free.',
    url: 'https://karuvilab.com/image-tools/bg-remover/',
    type: 'website'
  }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'AI Background Remover',
    'url': 'https://karuvilab.com/image-tools/bg-remover/',
    'description': 'Remove image backgrounds automatically in your browser using local AI (ONNX Runtime Web + WebAssembly). 100% private, offline-first, and free.',
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
      <ToolShell title="AI Background Remover">
        <ToolClientWrapper />
      </ToolShell>
    </>
  );
}
