import { ToolContent } from '../../registry/types';

export const wordCounter: ToolContent = {
  detailedDescription: "Word Counter is a professional tool for writers, students, and editors to analyze text in real-time. It counts words, characters, sentences, and paragraphs while providing an estimated reading time.",
  howTo: [
    "Type or paste your text into the input area.",
    "The statistics will update automatically as you type.",
    "Optionally, upload a .txt file to count its contents.",
    "View your word count, character count, and other metrics below the text area."
  ],
  faq: [
    {
      question: "Is my text data stored on your servers?",
      answer: "No, all text analysis happens locally in your browser. Your data never leaves your device."
    },
    {
      question: "How is reading time calculated?",
      answer: "We use an average reading speed of 200 words per minute to estimate the time it takes to read your text."
    }
  ]
};
