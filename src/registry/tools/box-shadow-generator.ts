import { ToolEntry } from '../types';
import { Square } from 'lucide-react';

export const box_shadow_generator: ToolEntry = {
  id: 'box-shadow-generator',
  name: 'Box Shadow Generator',
  desc: 'Visual box shadow generator. Layer multiple shadows to create deep, realistic UI depth with CSS and Tailwind export',
  href: 'developer-tools/box-shadow-generator/',
  category: 'developer',
  keywords: ['box shadow generator', 'css shadow', 'tailwind shadow', 'drop shadow', 'layered shadow'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.8,
  searchIntent: 'action',
  related: ['gradient-generator', 'glassmorphism-generator', 'color-converter'],
  seoContent: {
    detailedDescription: `The Box Shadow Generator is an advanced UI design tool that lets you create soft, modern, and realistic layered shadows. You can stack up to 6 shadow layers, tweak their offset, blur, spread, color, and opacity, and instantly copy the resulting CSS or Tailwind code.`,
    howTo: [
      'Adjust the X and Y offsets to move the shadow.',
      'Tweak the Blur and Spread sliders to soften or expand the shadow.',
      'Change the shadow color and opacity for the perfect depth effect.',
      'Click "Add Layer" to stack multiple shadows (essential for realistic, modern UI depth).',
      'Toggle the "Inset" switch for inner shadows.',
      'Copy the output code in CSS or Tailwind format.'
    ],
    faq: [
      { question: 'What makes a box shadow look realistic?', answer: 'Realistic shadows rarely consist of a single layer. Stacking multiple layers with varying blurs and opacities (e.g., a tight dark shadow + a large soft shadow) creates a natural, physical depth.' },
      { question: 'Does this tool generate Tailwind arbitrary values?', answer: 'Yes. It converts your complex layered shadows into a single Tailwind arbitrary value class like shadow-[0_4px_...] ready to be pasted.' },
      { question: 'What is an inset shadow?', answer: 'An inset shadow is drawn inside the box rather than outside, creating an embossed or sunken effect.' },
      { question: 'How many layers can I add?', answer: 'You can add up to 6 distinct shadow layers. This is usually more than enough to create ultra-realistic smooth shadows.' },
      { question: 'Is this tool free?', answer: 'Yes, 100% free and runs locally in your browser with zero server tracking.' }
    ]
  }
};
