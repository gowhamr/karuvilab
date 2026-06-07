const fs = require('fs');
const path = require('path');

const tools = [
  // Tier 1
  { id: 'uuid-generator', name: 'UUID Generator', cat: 'developer-tools', desc: 'Generate RFC-compliant UUIDs (v1, v4, v5, v7).' },
  { id: 'unix-timestamp', name: 'Unix Timestamp Converter', cat: 'developer-tools', desc: 'Convert Unix timestamps to human-readable dates and back.' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', cat: 'developer-tools', desc: 'Generate Lorem Ipsum placeholder text.' },
  { id: 'csv-to-json', name: 'CSV to JSON Converter', cat: 'developer-tools', desc: 'Convert CSV to JSON and JSON to CSV.' },
  { id: 'xml-formatter', name: 'XML Formatter', cat: 'developer-tools', desc: 'Format, minify, and validate XML.' },
  // Tier 2
  { id: 'income-tax', name: 'Income Tax Calculator', cat: 'calculators', desc: 'Calculate income tax for FY 2025-26.' },
  { id: 'hra-calculator', name: 'HRA Calculator', cat: 'calculators', desc: 'Calculate HRA exemption limit.' },
  { id: 'gratuity-calculator', name: 'Gratuity Calculator', cat: 'calculators', desc: 'Calculate Gratuity amount.' },
  { id: 'tds-calculator', name: 'TDS Calculator', cat: 'calculators', desc: 'Calculate Tax Deducted at Source.' },
  { id: 'nps-calculator', name: 'NPS Calculator', cat: 'calculators', desc: 'Calculate National Pension System returns.' },
  // Tier 3
  { id: 'gradient-generator', name: 'CSS Gradient Generator', cat: 'developer-tools', desc: 'Visual CSS gradient builder.' },
  { id: 'contrast-checker', name: 'Contrast Checker', cat: 'developer-tools', desc: 'WCAG contrast ratio checker.' },
  { id: 'box-shadow-generator', name: 'Box Shadow Generator', cat: 'developer-tools', desc: 'Visual box shadow generator.' },
  { id: 'glassmorphism-generator', name: 'Glassmorphism Generator', cat: 'developer-tools', desc: 'Glassmorphism CSS generator.' },
  // Tier 4
  { id: 'hmac-generator', name: 'HMAC Generator', cat: 'security-tools', desc: 'Generate HMAC signatures.' },
  { id: 'cipher-tools', name: 'Text Cipher Tools', cat: 'security-tools', desc: 'Caesar, ROT13, Vigenere, XOR ciphers.' },
  { id: 'csp-builder', name: 'CSP Builder', cat: 'security-tools', desc: 'Content Security Policy builder.' },
];

tools.forEach(t => {
  const dir = path.join('app/(tools)', t.cat, t.id);
  fs.mkdirSync(dir, { recursive: true });

  const clientName = t.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Client';
  const wrapperName = clientName.replace('Client', 'Wrapper');

  const pageContent = `import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ${wrapperName} from './${wrapperName}';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '${t.name} – KV',
  description: '${t.desc}',
  alternates: { canonical: 'https://karuvilab.com/tools/${t.cat}/${t.id}/' }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '${t.name}',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: 'https://karuvilab.com/tools/${t.cat}/${t.id}/',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return (
    <>
      <Script id="${t.id}-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell title="${t.name}">
        <${wrapperName} />
      </ToolShell>
    </>
  );
}`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent);

  const wrapperContent = `'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const ${clientName} = dynamic(() => import('./${clientName}'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function ${wrapperName}() {
  return <${clientName} />;
}`;
  fs.writeFileSync(path.join(dir, `${wrapperName}.tsx`), wrapperContent);
  
  const clientContent = `'use client';
import React from 'react';
export default function ${clientName}() {
  return <div className="p-8 text-center text-text-3">Building ${t.name}...</div>;
}`;
  if (!fs.existsSync(path.join(dir, `${clientName}.tsx`))) {
    fs.writeFileSync(path.join(dir, `${clientName}.tsx`), clientContent);
  }
});
console.log('Scaffolding complete.');
