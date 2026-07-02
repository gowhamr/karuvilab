import { ToolEntry } from '../types';
import { Timer } from 'lucide-react';

export const unix_timestamp: ToolEntry = {
  id: 'unix-timestamp',
  name: 'Unix Timestamp Converter',
  desc: 'Convert Unix timestamps to human-readable dates and back. Live clock, timezone support, relative time display',
  href: 'developer-tools/unix-timestamp/',
  category: 'developer',
  keywords: ['unix timestamp', 'epoch', 'date converter', 'time', 'iso 8601'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['crontab-editor', 'world-clock', 'timezone-converter'],
  seoContent: {
    detailedDescription: `Unix Timestamp Converter is a privacy-first, browser-native tool to convert Unix timestamps to human-readable dates and vice-versa. Includes a live epoch clock, format selections (Seconds, Milliseconds, ISO 8601), and extensive timezone support.`,
    howTo: [
      'Select whether to convert a Timestamp to Human Date or vice-versa',
      'Enter your timestamp or date into the input field',
      'Use the dropdown to adjust the target timezone if needed',
      'View the converted results instantly in multiple formats',
      'Copy specific formats like ISO 8601 or RFC 2822 using the copy buttons'
    ],
    faq: [
      { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds elapsed since January 1, 1970 00:00:00 UTC, also known as the Unix epoch. It is widely used in programming for consistent time representation across timezones.' },
      { question: 'What is the difference between seconds and milliseconds timestamps?', answer: 'Most Unix timestamps are in seconds. JavaScript Date.now() returns milliseconds. You can identify which by the number of digits — 10 digits = seconds, 13 digits = milliseconds.' },
      { question: 'What is the 2038 problem?', answer: 'On January 19 2038 at 03:14:07 UTC, 32-bit signed integer Unix timestamps will overflow. Modern systems use 64-bit integers which will not overflow for billions of years.' },
      { question: 'What is ISO 8601?', answer: 'ISO 8601 is an international standard for date and time representation. Example: 2026-06-04T09:00:00.000Z. The Z suffix means UTC.' },
      { question: 'Are my timestamps stored anywhere?', answer: 'No. All conversions happen locally in your browser. Nothing is transmitted to any server.' }
    ]
  }
};
