import { ToolEntry } from '../types';
import { Lock } from 'lucide-react';

export const cipher_tools: ToolEntry = {
  id: 'cipher-tools',
  name: 'Text Cipher Tools',
  desc: 'Encrypt and decrypt text using classic ciphers like Caesar, Vigenère, ROT13, XOR, and Morse Code',
  href: 'security-tools/cipher-tools/',
  category: 'security',
  keywords: ['cipher', 'encryption', 'decryption', 'caesar cipher', 'vigenere', 'rot13', 'xor cipher', 'morse code'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.8,
  searchIntent: 'action',
  related: ['base64', 'hash-generator', 'url-encoder'],
  seoContent: {
    detailedDescription: `Text Cipher Tools is a comprehensive suite for classic encryption algorithms. Whether you're solving a CTF challenge, learning cryptography basics, or just obfuscating text, you can instantly encode and decode using Caesar, ROT13, Vigenère, XOR, and even Morse Code—all locally in your browser.`,
    howTo: [
      'Select the cipher algorithm you want to use from the tabs.',
      'Enter your text into the input field.',
      'If required by the cipher (e.g., Caesar shift or Vigenère key), provide the key.',
      'Click the Encode/Decode toggle to switch directions.',
      'View the real-time encrypted or decrypted output instantly.'
    ],
    faq: [
      { question: 'Are these ciphers secure?', answer: 'No. Classic ciphers like Caesar and Vigenère are easily crackable and should only be used for educational purposes, puzzles, or basic obfuscation—never for securing sensitive data.' },
      { question: 'What is ROT13?', answer: 'ROT13 is a simple letter substitution cipher that replaces a letter with the 13th letter after it in the alphabet. Because there are 26 letters, applying ROT13 twice restores the original text.' },
      { question: 'How does the XOR cipher work?', answer: 'The XOR cipher operates on the binary representation of the text and a key. It is a symmetric cipher, meaning the same operation decrypts the text if you have the correct key.' },
      { question: 'Can I brute-force a Caesar cipher?', answer: 'Yes! The tool includes a brute-force mode for Caesar ciphers that instantly outputs all 25 possible shifts, allowing you to easily read the hidden message.' },
      { question: 'Does the Morse Code tool play audio?', answer: 'Yes, the tool utilizes the browser\'s Web Audio API to play the resulting Morse code as audible beeps.' }
    ]
  }
};
