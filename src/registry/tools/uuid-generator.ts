import { ToolEntry } from '../types';
import { Fingerprint } from 'lucide-react';

export const uuid_generator: ToolEntry = {
  id: 'uuid-generator',
  name: 'UUID Generator',
  desc: 'Generate RFC-compliant UUIDs (v1, v4, v5, v7). Bulk generation, format options, and UUID validator. 100% browser-native using Web Crypto API.',
  href: 'developer-tools/uuid-generator/',
  category: 'developer',
  keywords: ['uuid', 'guid', 'unique id', 'v4', 'random', 'identifier'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['hash-generator', 'crontab-editor'],
  seoContent: {
    detailedDescription: `UUID Generator is a fast, secure, browser-native tool to generate Universally Unique Identifiers. It supports versions 1, 4, 5, and the new version 7. All generation happens locally in your browser using the Web Crypto API ensuring maximum security.`,
    howTo: [
      'Select the UUID version you need (v4 is the standard random UUID)',
      'Click "Regenerate" to create a new UUID',
      'Use the Format tabs to change the output style (Standard, Uppercase, No Dashes, Braces, URN)',
      'To bulk generate, enter a quantity and click Generate',
      'Use the Validator to paste a UUID and check its version and validity'
    ],
    faq: [
      { question: 'What is a UUID?', answer: 'A Universally Unique Identifier is a 128-bit label used to uniquely identify information in computer systems. The probability of generating a duplicate UUID v4 is negligibly small.' },
      { question: 'Which UUID version should I use?', answer: 'Use v4 for most use cases (random). Use v1 for time-ordered IDs. Use v5 for deterministic IDs from a name. Use v7 for database primary keys (sortable by time).' },
      { question: 'Is UUID v4 truly random?', answer: 'UUID v4 uses cryptographically secure random numbers via the Web Crypto API, making it suitable for security-sensitive applications.' },
      { question: 'What is UUID v7?', answer: 'UUID v7 is a newer format that encodes Unix timestamp milliseconds in the most significant bits, making them naturally sortable — ideal for database primary keys.' },
      { question: 'Are generated UUIDs stored anywhere?', answer: 'No. All generation happens locally in your browser using the Web Crypto API. Nothing is transmitted to any server.' }
    ]
  }
};
