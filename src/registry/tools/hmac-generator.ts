import { ToolEntry } from '../types';
import { KeyRound } from 'lucide-react';

export const hmac_generator: ToolEntry = {
  id: 'hmac-generator',
  name: 'HMAC Generator',
  desc: 'Generate Hash-based Message Authentication Codes (HMAC) using SHA-256, SHA-512, and other algorithms natively in the browser.',
  href: 'security-tools/hmac-generator/',
  category: 'security',
  keywords: ['hmac', 'mac', 'hash authentication', 'sha256 hmac', 'signature generator', 'jwt signature'],
  status: 'new',
  popular: false,
  difficulty: 'intermediate',
  priority: 0.9,
  searchIntent: 'action',
  related: ['hash-generator', 'base64', 'jwt-decoder'],
  seoContent: {
    detailedDescription: `The HMAC Generator is a secure, browser-native tool to create and verify Hash-based Message Authentication Codes. Utilizing the Web Crypto API, it computes highly secure signatures (SHA-256, SHA-512, etc.) directly on your device, ensuring your secret keys and payload data are never transmitted over the network.`,
    howTo: [
      'Select your desired hashing algorithm (e.g., SHA-256).',
      'Enter the secret key used for signing.',
      'Paste the message or payload data into the input field.',
      'Choose your preferred output encoding (Hex, Base64, or Base64URL).',
      'Use the "Verify" tab to check if a given HMAC matches your data and key.'
    ],
    faq: [
      { question: 'What is HMAC?', answer: 'HMAC (Hash-based Message Authentication Code) is a specific type of MAC involving a cryptographic hash function and a secret cryptographic key. It is used to simultaneously verify both the data integrity and the authenticity of a message.' },
      { question: 'What is this used for?', answer: 'HMACs are widely used in web development for verifying webhooks (like Stripe or GitHub), signing JWTs (JSON Web Tokens), and authenticating API requests.' },
      { question: 'Is my secret key safe?', answer: 'Yes. The entire HMAC generation process is handled locally by your browser’s Web Crypto API. Your secret key is never sent to any server.' },
      { question: 'What is the difference between Base64 and Base64URL?', answer: 'Base64URL is a modified version of Base64 that replaces the `+` and `/` characters with `-` and `_` respectively, making it safe to use in URLs and filenames without URL-encoding.' },
      { question: 'Which algorithm should I choose?', answer: 'SHA-256 is the current industry standard for most web applications (e.g., HS256 in JWT). SHA-512 offers higher security but produces a longer hash.' }
    ]
  }
};
