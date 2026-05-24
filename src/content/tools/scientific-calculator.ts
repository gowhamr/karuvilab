import { ToolContent } from '../../registry/types';

export const scientificCalculator: ToolContent = {
  detailedDescription: "The Scientific Calculator is a powerful, browser-native tool designed for complex mathematical operations. It supports standard arithmetic alongside advanced functions like trigonometry (sin, cos, tan), inverse trigonometry, logarithms, factorials, and more. Built with performance in mind, it leverages Web Workers for calculations, ensuring a smooth user experience even with large expressions. All calculations happen entirely in your browser, maintaining 100% privacy.",
  howTo: [
    "Use the numeric keypad for standard digits and basic operations (+, -, *, /).",
    "Access scientific functions like sin, cos, and log from the advanced panel.",
    "Toggle between Degrees and Radians mode for trigonometric calculations.",
    "Use the 'Ans' button to reference the result of your previous calculation.",
    "Press Enter or click the '=' button to evaluate your expression.",
    "Clear the display with the 'AC' button or delete the last character with 'DEL'."
  ],
  faq: [
    {
      question: "Does this calculator support order of operations?",
      answer: "Yes, the calculator follows standard PEMDAS/BODMAS rules, correctly handling parentheses, exponents, multiplication, division, addition, and subtraction."
    },
    {
      question: "What is the difference between Degrees and Radians mode?",
      answer: "Degrees mode treats inputs for trigonometric functions as degrees (0-360), while Radians mode treats them as radians (0-2π). This is crucial for different fields of math and science."
    },
    {
      question: "Is my calculation history saved?",
      answer: "Yes, your recent calculations are saved in a history log within your browser's session, allowing you to easily review or reuse previous results."
    },
    {
      question: "Are my calculations secure?",
      answer: "Absolutely. All math evaluation happens locally in your browser. No data is ever sent to a server, ensuring complete privacy for your work."
    }
  ],
  useCases: [
    "Solving complex engineering and physics problems",
    "Academic research and advanced mathematics homework",
    "Quick trigonometric conversions and calculations",
    "Logarithmic scaling and exponential growth modeling",
    "Everyday advanced arithmetic with history tracking"
  ],
  examples: [
    { label: "Trigonometry", input: "sin(45)", output: "0.7071067812" },
    { label: "Logarithms", input: "log(100)", output: "2" },
    { label: "Factorial", input: "5!", output: "120" },
    { label: "Combined", input: "2 + 3 * (5 ^ 2)", output: "17" }
  ]
};
