import { ToolEntry } from '../types';
import { FileText } from 'lucide-react';

export const lorem_ipsum: ToolEntry = {
  id: 'lorem-ipsum',
  name: 'Lorem Ipsum Generator',
  desc: 'Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs with Classic, Hipster, or Tech variants',
  href: 'developer-tools/lorem-ipsum/',
  category: 'developer',
  keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'generator', 'hipster ipsum', 'tech ipsum'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.8,
  searchIntent: 'action',
  related: ['word-counter', 'text-case-converter', 'json-formatter'],
  seoContent: {
    detailedDescription: `Lorem Ipsum Generator is a browser-native tool for developers and designers to generate placeholder text instantly. It supports classic Latin, a trendy Hipster variant, and a developer-focused Tech variant. Generate exactly the amount of text you need by words, sentences, or paragraphs without relying on external APIs.`,
    howTo: [
      'Choose your preferred variant: Classic, Tech, or Hipster.',
      'Select the unit of measurement: Words, Sentences, or Paragraphs.',
      'Adjust the count using the slider or input field.',
      'Toggle "Start with Lorem ipsum" or HTML tags as needed.',
      'Click the Copy button or Download as .txt.'
    ],
    faq: [
      { question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is dummy text used by the design and typesetting industry to preview layouts and visual mockups before final content is available.' },
      { question: 'Where does Lorem Ipsum come from?', answer: 'It has roots in a piece of classical Latin literature from 45 BC, specifically "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero.' },
      { question: 'What is the Tech variant?', answer: 'The Tech variant generates placeholder text using common programming terms, API keywords, and developer jargon — perfect for mocking up software documentation or UI elements.' },
      { question: 'What is the Hipster variant?', answer: 'Hipster Ipsum uses trendy, modern vocabulary to create quirky placeholder text for lifestyle brands or modern web designs.' },
      { question: 'Does this tool work offline?', answer: 'Yes! The word banks and generation algorithms are fully embedded in the browser, making this tool 100% offline-capable.' }
    ]
  }
};
