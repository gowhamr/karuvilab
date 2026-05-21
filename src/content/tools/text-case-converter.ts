import { ToolContent } from '../../registry/types';

export const textCaseConverter: ToolContent = {
  detailedDescription: "Text Case Converter allows you to easily transform your text between various formats, such as UPPERCASE, lowercase, Title Case, and more. It's a quick way to fix accidental caps lock or format text for code (camelCase, snake_case).",
  howTo: [
    "Paste your text into the input box.",
    "Click on the button for the desired case format.",
    "The transformed text will appear in the output area.",
    "Click 'Copy' to copy the result to your clipboard."
  ],
  faq: [
    {
      question: "What formats are supported?",
      answer: "We support UPPERCASE, lowercase, Sentence case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and alternating case."
    },
    {
      question: "Does this tool work with multiple languages?",
      answer: "Yes, it works with any language that uses case-based alphabets like Latin, Cyrillic, or Greek."
    }
  ]
};
