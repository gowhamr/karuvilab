import { ToolEntry, SEOContent } from '../types';

export const grammarChecker: ToolEntry = {
  id: "grammar-checker",
  name: "Grammar & Spell Checker",
  desc: "100% private, client-side grammar, spell, and readability checker for your text.",
  href: "/utilities/grammar-checker/",
  category: "utilities",
  icon: null,
  color: null,
  featured: false,
  popular: false,
  status: "new",
  lastAdded: "2026-07-19",
  keywords: ["grammar checker", "spell checker", "text editor", "readability", "privacy-first", "offline"],
  input: "text",
  output: "text",
  related: ["markdown"],
  subCategory: "Text",
  requiresNetwork: false,
  seoContent: {
    detailedDescription: "A fully local grammar, spelling, and readability checker that processes your text 100% in your browser. No server uploads. In today's cloud-first world, pasting your sensitive documents, emails, or code into online grammar checkers means giving up your privacy. The KaruviLab Grammar Checker flips this paradigm by bringing advanced natural language processing directly into your browser. Your text never leaves your device. No API calls. No tracking.",
    howTo: [
      "Type or paste your text into the editor.",
      "The tool will automatically underline errors and stylistic suggestions.",
      "Hover or click on a squiggly line to view the suggestion.",
      "Export or copy your corrected text securely."
    ],
    faq: [
      {
        question: "Is my data sent to the cloud?",
        answer: "No, all grammar checking happens directly in your browser."
      },
      {
        question: "Does it work offline?",
        answer: "Yes, once the dictionaries are cached, it works completely offline."
      }
    ]
  }
};
