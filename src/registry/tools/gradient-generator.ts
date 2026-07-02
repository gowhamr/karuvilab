import { ToolEntry } from '../types';
import { Palette } from 'lucide-react';

export const gradient_generator: ToolEntry = {
  id: 'gradient-generator',
  name: 'CSS Gradient Generator',
  desc: 'Visual CSS gradient builder. Generate Linear, Radial, and Conic gradients with multiple color stops and instant CSS/Tailwind export',
  href: 'developer-tools/gradient-generator/',
  category: 'developer',
  keywords: ['gradient generator', 'css gradient', 'tailwind gradient', 'linear gradient', 'radial gradient', 'conic gradient'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['color-converter', 'box-shadow-generator', 'glassmorphism-generator'],
  seoContent: {
    detailedDescription: `The CSS Gradient Generator is an intuitive, visual tool for designers and developers to create complex gradients directly in the browser. It supports Linear, Radial, and Conic gradients with up to 8 customizable color stops. Once your gradient is perfect, instantly copy the CSS, SCSS, or Tailwind CSS code.`,
    howTo: [
      'Select a gradient type: Linear, Radial, or Conic.',
      'For Linear and Conic gradients, adjust the angle slider.',
      'Click the color stops on the bar to change their color and drag them to adjust positions.',
      'Use the + button to add more stops or the - button to remove them.',
      'Click on any preset from the gallery for instant inspiration.',
      'Copy the output code in CSS, SCSS, or Tailwind format.'
    ],
    faq: [
      { question: 'What is a CSS gradient?', answer: 'A CSS gradient allows you to display smooth transitions between two or more specified colors. It is rendered by the browser and does not require an image file.' },
      { question: 'What is the difference between Linear, Radial, and Conic?', answer: 'Linear gradients transition colors along a straight line. Radial gradients radiate outward from a central point. Conic gradients transition colors around a center point (like a pie chart).' },
      { question: 'Does this tool generate Tailwind CSS code?', answer: 'Yes! It intelligently translates your custom gradient stops into Tailwind CSS utility classes using arbitrary values.' },
      { question: 'How many color stops can I add?', answer: 'You can add up to 8 color stops to create highly complex and beautiful gradients.' },
      { question: 'Can I export the gradient as an image?', answer: 'Currently, the tool exports the gradient as CSS code, which is lighter and infinitely scalable compared to an image.' }
    ]
  }
};
