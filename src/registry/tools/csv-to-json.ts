import { ToolEntry } from '../types';
import { ArrowLeftRight } from 'lucide-react';

export const csv_to_json: ToolEntry = {
  id: 'csv-to-json',
  name: 'CSV to JSON Converter',
  desc: 'Convert CSV to JSON and JSON to CSV natively in your browser. Supports custom delimiters, headers, and advanced parsing options.',
  href: 'developer-tools/csv-to-json/',
  category: 'developer',
  input: 'csv',
  output: 'json',
  keywords: ['csv to json', 'json to csv', 'converter', 'data parser', 'data format', 'delimiter'],
  status: 'new',
  popular: true,
  difficulty: 'beginner',
  priority: 0.9,
  searchIntent: 'action',
  related: ['json-formatter', 'xml-formatter', 'fake-data-generator'],
  seoContent: {
    detailedDescription: `CSV to JSON Converter is a powerful, local-first utility designed to effortlessly transform tabular data into JSON format, and vice versa. It auto-detects delimiters and provides robust parsing options to handle dirty data securely without any server uploads.`,
    howTo: [
      'Paste your CSV or JSON data into the input text area.',
      'Alternatively, use the two-way mode toggle to switch between CSV→JSON and JSON→CSV.',
      'Configure parsing options such as delimiter, header presence, and number/boolean inference.',
      'The converted data will appear in the output area instantly.',
      'Use the visual preview table to verify your data structure before copying or downloading.'
    ],
    faq: [
      { question: 'What is CSV?', answer: 'CSV (Comma-Separated Values) is a plain text file format that uses a comma to separate values. Each line of the file is a data record.' },
      { question: 'Does this tool upload my data?', answer: 'No! All conversions happen entirely within your browser using JavaScript. Your sensitive data never leaves your device.' },
      { question: 'Can it convert JSON back to CSV?', answer: 'Yes, this tool provides a seamless two-way conversion. Just switch the mode to JSON → CSV.' },
      { question: 'Does it support custom delimiters?', answer: 'Yes, it can auto-detect the delimiter, or you can manually select commas, semicolons, tabs, or pipes.' },
      { question: 'What happens to large datasets?', answer: 'Because the parsing happens in the browser, performance depends on your device. However, it can handle tens of thousands of rows efficiently.' }
    ]
  }
};
