import { ToolContent } from '../../registry/types';

export const standardCalculator: ToolContent = {
  detailedDescription:
    "A clean, responsive standard calculator for everyday arithmetic. Performs addition, subtraction, multiplication, and division with support for keyboard input and decimal precision. Designed for speed and reliability with no tracking or server-side calls.",
  howTo: [
    "Type numbers using your keyboard or the on-screen buttons.",
    "Use standard operator buttons (+, -, *, /) for calculations.",
    "Press '=' or 'Enter' to see the result.",
    "Use 'C' to clear the current input or 'AC' for a full reset.",
    "Click the percentage button for quick ratio calculations.",
  ],
  faq: [
    {
      question: "Can I use my keyboard?",
      answer: "Yes! Use number keys, '+', '-', '*', '/', '.', and 'Enter' for calculations. 'Escape' or 'Backspace' can be used for clearing.",
    },
    {
      question: "How accurate is the division?",
      answer: "The calculator uses standard IEEE 754 floating-point arithmetic. It is suitable for everyday use but may have minute precision limits with extremely large or small numbers.",
    },
    {
      question: "Does it support history?",
      answer: "The current version focus on immediate results. History support is planned for a future update.",
    },
  ],
  useCases: [
    "Simple shopping bill additions",
    "Basic unit math",
    "Quickly checking a percentage",
    "Everyday household math",
  ],
  alternatives: ["Google Calculator", "Windows Calculator", "Calculator.net"],
};
