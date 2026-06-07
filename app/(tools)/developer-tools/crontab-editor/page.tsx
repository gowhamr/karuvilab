// app/(tools)/developer-tools/crontab-editor/page.tsx
import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CrontabEditorWrapper from './CrontabEditorWrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Crontab Editor – KV',
  description: 'Visual cron schedule editor. Build and understand cron expressions instantly with human-readable preview and next run times. 100% browser-native.',
  keywords: ['crontab', 'cron editor', 'cron expression', 'cron schedule', 'linux cron', 'devops tools'],
  alternates: {
    canonical: 'https://karuvilab.com/tools/developer-tools/crontab-editor/',
  },
  openGraph: {
    title: 'Crontab Editor – KaruviLab',
    description: 'Visual cron schedule editor with human-readable preview. Free, private, browser-native.',
    url: 'https://karuvilab.com/tools/developer-tools/crontab-editor/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crontab Editor – KaruviLab',
    description: 'Visual cron schedule editor. Build cron expressions instantly.',
  },
};

export default function CrontabEditorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Crontab Editor',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: 'Visual cron schedule editor with human-readable preview.',
    url: 'https://karuvilab.com/tools/developer-tools/crontab-editor/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Visual cron expression editor',
      'Human-readable schedule description',
      'Next 5 run times preview',
      '17 quick presets',
      'Cron reference cheatsheet',
      '100% browser-native — no server'
    ]
  };

  return (
    <>
      <Script
        id="crontab-editor-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolShell title="Crontab Editor">
        <CrontabEditorWrapper />
      </ToolShell>
    </>
  );
}
