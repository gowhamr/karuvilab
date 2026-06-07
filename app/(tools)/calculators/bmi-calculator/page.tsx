import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import BmiCalculatorWrapper from './BmiCalculatorWrapper';

export const metadata: Metadata = {
  title: 'BMI Calculator – KV',
  description: 'Calculate your Body Mass Index instantly. Visual gauge, healthy range indicator, metric & imperial support. 100% private — no data leaves your browser.',
  keywords: ['bmi calculator', 'body mass index', 'bmi chart', 'healthy weight', 'bmi india', 'weight calculator'],
  alternates: {
    canonical: 'https://karuvilab.com/tools/calculators/bmi-calculator/',
  },
  openGraph: {
    title: 'BMI Calculator – KaruviLab',
    description: 'Instant BMI calculator with visual gauge and healthy range indicator. Free, private, browser-native.',
    url: 'https://karuvilab.com/tools/calculators/bmi-calculator/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator – KaruviLab',
    description: 'Calculate BMI instantly with healthy range visual. 100% private.',
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BMI Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  description: 'Visual BMI calculator with healthy range indicator and Indian body type context.',
  url: 'https://karuvilab.com/tools/calculators/bmi-calculator/',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Metric and Imperial unit support',
    'Visual BMI gauge indicator',
    'Healthy weight range calculation',
    'Indian/Asian body type thresholds',
    'Ideal weight suggestion',
    '100% browser-native — no server'
  ]
};

export default function BmiCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolShell title="BMI Calculator">
        <BmiCalculatorWrapper />
      </ToolShell>
    </>
  );
}
