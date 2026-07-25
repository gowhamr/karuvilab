import { ToolContent } from '../../registry/types';

export const glassmorphismGenerator: ToolContent = {
  detailedDescription: `
The **Glassmorphism Generator** tool is a privacy-first utility designed to run entirely in your browser.

Generate CSS code for modern frosted-glass card designs..

In line with KaruviLab's strict privacy policy, all processing happens locally on your device. Your data is never uploaded to external servers, ensuring maximum security and speed.
`,
  howTo: [
    "**Step 1:** Select or upload your input data.",
    "**Step 2:** Adjust the available settings to your preference.",
    "**Step 3:** The tool will process your data instantly.",
    "**Step 4:** Copy or download the results securely to your device."
  ],
  faq: [
    {
      question: "Is my data uploaded to a server?",
      answer: "No. All processing happens locally in your browser. Your files and text remain on your device, ensuring total privacy."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes! Because it relies on browser-native APIs and WebAssembly/Web Workers, it functions perfectly even without an active internet connection once loaded."
    }
  ]
};
