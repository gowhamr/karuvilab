import { ToolEntry } from '../types';
import { Code2 } from 'lucide-react';

export const xml_formatter: ToolEntry = {
  id: 'xml-formatter',
  name: 'Xml Formatter',
  desc: 'Format, beautify, minify, and validate XML documents in your browser. Fast, secure, and offline-capable',
  href: 'developer-tools/xml-formatter/',
  category: 'developer',
  input: 'text',
  output: 'text',
  keywords: ['xml formatter', 'xml beautifier', 'xml validator', 'minify xml', 'pretty print xml'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.8,
  searchIntent: 'action',
  related: ['json-formatter', 'csv-to-json', 'html-viewer'],
  seoContent: {
    detailedDescription: `XML Formatter is a privacy-focused developer tool to quickly beautify, minify, and validate XML code. Leveraging the browser's native DOMParser, it processes XML without requiring external APIs or servers, guaranteeing your sensitive configuration or data files remain private.`,
    howTo: [
      'Paste your unformatted or minified XML code into the input field.',
      'Select the desired mode: Format, Minify, or Validate.',
      'Choose your preferred indentation level (2 spaces, 4 spaces, or tabs).',
      'The output will be generated instantly. If validating, any errors will be highlighted.',
      'Copy the result to your clipboard or download it as an .xml file.'
    ],
    faq: [
      { question: 'How does the XML validation work?', answer: 'The tool uses the browser-native DOMParser to parse the XML string. If the browser detects structural issues or mismatched tags, the tool extracts and displays those specific parsing errors.' },
      { question: 'Is my XML data secure?', answer: 'Absolutely. The formatting and parsing logic executes 100% locally on your machine. Your XML is never transmitted over the internet.' },
      { question: 'Can this tool minify XML?', answer: 'Yes. Switch to the "Minify" tab to strip out all unnecessary whitespace, newlines, and indentation, reducing your XML payload size.' },
      { question: 'What is the maximum file size supported?', answer: 'The tool can handle very large XML strings, limited only by your browser\'s memory capacity.' },
      { question: 'Does it support formatting SVG files?', answer: 'Yes! Since SVG is an XML-based format, you can paste raw SVG code here to prettify or minify it.' }
    ]
  }
};
