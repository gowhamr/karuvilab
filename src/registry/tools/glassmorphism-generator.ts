import { ToolEntry } from '../types';
import { Layers } from 'lucide-react';

export const glassmorphism_generator: ToolEntry = {
  id: 'glassmorphism-generator',
  name: 'Glassmorphism Generator',
  desc: 'Generate trendy glassmorphism CSS effects. Adjust blur, transparency, and tint to create beautiful frosted glass elements.',
  href: 'developer-tools/glassmorphism-generator/',
  category: 'developer',
  keywords: ['glassmorphism', 'glass css', 'frosted glass', 'backdrop filter', 'ui generator'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.7,
  searchIntent: 'action',
  related: ['gradient-generator', 'box-shadow-generator', 'color-converter'],
  seoContent: {
    detailedDescription: `The Glassmorphism Generator is a specialized UI tool to create the popular "frosted glass" effect. It utilizes CSS backdrop-filter to blur the background behind an element, giving it a translucent, glassy appearance. Fine-tune transparency, blur radius, borders, and lighting to match your brand.`,
    howTo: [
      'Adjust the Blur slider to increase the frosted effect (uses backdrop-filter).',
      'Tweak Transparency to make the glass more or less see-through.',
      'Add a subtle tinted color to match your UI theme.',
      'Use the Border and Shadow sliders to give the glass physical definition.',
      'Select a vibrant background to properly preview the glass effect.',
      'Copy the output CSS or Tailwind utility classes.'
    ],
    faq: [
      { question: 'What is Glassmorphism?', answer: 'Glassmorphism is a UI design trend characterized by translucent, frosted-glass-like elements floating over colorful backgrounds. It relies heavily on background blur and semi-transparent colors.' },
      { question: 'Which CSS property creates the blur?', answer: 'The effect is created using the CSS backdrop-filter: blur(10px); property, which blurs everything rendered behind the element.' },
      { question: 'Is backdrop-filter supported in all browsers?', answer: 'It is supported in all modern browsers (Chrome, Edge, Safari, Firefox). Older browsers will fall back to a semi-transparent solid color.' },
      { question: 'Why does glassmorphism need a subtle border?', answer: 'A 1px semi-transparent border (usually white) adds a "specular highlight" that simulates the edge of physical glass catching the light.' },
      { question: 'Does this generate Tailwind code?', answer: 'Yes, it provides the standard Tailwind backdrop-blur classes combined with bg-opacity and border utilities.' }
    ]
  }
};
