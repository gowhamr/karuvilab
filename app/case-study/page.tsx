import type { Metadata } from 'next';
import { CaseStudyClientWrapper } from './CaseStudyClientWrapper';

export const metadata: Metadata = {
  title: 'UI/UX Case Study – KaruviLab',
  description:
    'A premium Behance-style UI/UX case study presenting the KaruviLab design system, screen-by-screen breakdowns, component library, and light/dark mode showcases.',
  robots: { index: false, follow: false },
};

export default function CaseStudyPage() {
  return <CaseStudyClientWrapper />;
}
