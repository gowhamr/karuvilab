import { ToolEntry } from '../types';
import { Eye } from 'lucide-react';

export const contrast_checker: ToolEntry = {
  id: 'contrast-checker',
  name: 'Contrast Checker',
  desc: 'WCAG contrast ratio checker. Ensure your text and background colors are accessible with live previews and color suggestions.',
  href: 'developer-tools/contrast-checker/',
  category: 'developer',
  keywords: ['contrast checker', 'wcag contrast', 'accessibility checker', 'color contrast', 'a11y'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.8,
  searchIntent: 'action',
  related: ['color-converter', 'gradient-generator', 'html-viewer'],
  seoContent: {
    detailedDescription: `The WCAG Contrast Checker is a vital accessibility tool for web developers and designers. It calculates the contrast ratio between foreground text and background colors, indicating whether they pass WCAG AA and AAA standards. The tool also provides visual previews and intelligent color suggestions to fix failing contrasts.`,
    howTo: [
      'Enter or select your foreground (text) color using the color picker.',
      'Enter or select your background color.',
      'Instantly see the contrast ratio score (e.g., 4.5:1).',
      'Check the badges to see if the combination passes WCAG AA or AAA requirements for different text sizes.',
      'If the contrast fails, use the suggested lighter or darker colors below the preview.'
    ],
    faq: [
      { question: 'What is WCAG?', answer: 'WCAG stands for Web Content Accessibility Guidelines. It is a set of rules ensuring web content is accessible to people with disabilities, including visual impairments.' },
      { question: 'What is a good contrast ratio?', answer: 'For normal text, WCAG AA requires a ratio of at least 4.5:1. For large text (18pt or 14pt bold), it requires 3:1. AAA level requires 7:1 for normal text.' },
      { question: 'Why is contrast important?', answer: 'High contrast ensures that text is legible against its background, which is crucial for users with low vision or color blindness, and improves readability for everyone (e.g., reading a screen in bright sunlight).' },
      { question: 'How do you calculate the contrast ratio?', answer: 'The ratio is calculated using the relative luminance of the colors, ranging from 1:1 (no contrast, e.g., white on white) to 21:1 (maximum contrast, e.g., black on white).' },
      { question: 'Does this check color blindness?', answer: 'Yes, the tool includes preview modes simulating Protanopia, Deuteranopia, and Tritanopia to help you design inclusively.' }
    ]
  }
};
