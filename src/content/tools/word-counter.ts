import { ToolContent } from '../../registry/types';

export const wordCounter: ToolContent = {
  detailedDescription: `
<p>The Word Counter is an essential text analysis utility for writers, students, SEO professionals, and editors. More than just a simple count, this tool provides a detailed breakdown of your content, including character counts (with and without spaces), sentence counts, and paragraph counts. It helps you stay within specific limits for essays, blog posts, or social media updates.</p>

<p>In addition to basic counting, our tool calculates advanced metrics like estimated reading time and speaking time. This is invaluable for public speakers prepping a speech or content creators trying to optimize their articles for user engagement. The real-time update engine ensures that as you type or edit your text, the stats reflect your changes instantly, providing a seamless editing experience.</p>

<p>At KaruviLab, your creative and professional writing stays private. We do not upload your text to any server for analysis. Every calculation happens right in your browser's memory, meaning your drafts, notes, and sensitive documents are never logged or stored. It is a completely secure, distraction-free environment for professional content auditing.</p>
`,
  howTo: [
    "<strong>Input Text:</strong> Type or paste your content into the large text area.",
    "<strong>Monitor Stats:</strong> Watch the real-time counters at the top or side of the tool update instantly.",
    "<strong>Check Metrics:</strong> Review characters, sentences, and estimated reading time for a full analysis.",
    "<strong>Refine:</strong> Edit your text to meet specific word count goals or character limits.",
    "<strong>Copy/Clear:</strong> Use the utility buttons to quickly copy the analyzed text or start a new session.",
  ],
  faq: [
    { question: "Does it count spaces as characters?", answer: "Yes, we provide two character counts: one including spaces and one excluding them, to meet different requirements." },
    { question: "Is there a text limit?", answer: "The tool can handle very large documents (up to several hundred pages) efficiently within your browser." },
    { question: "Does it store my writing?", answer: "No. Your text is processed locally and is never sent to our servers or saved beyond your current session." },
    { question: "How is reading time calculated?", answer: "We use the standard average reading speed of 225 words per minute (WPM) to provide a reliable estimate." },
    { question: "Can I use it for social media?", answer: "Yes, it is perfect for checking character limits for Twitter (X), LinkedIn, or Instagram captions." }
  ],
  examples: [
    { label: "Blog Post", input: "A 1000-word article", output: "Words: 1000, Reading Time: 4.5 min", description: "Auditing a blog draft for SEO and engagement length." },
    { label: "Tweet Check", input: "A short sentence", output: "Characters: 140", description: "Ensuring a social media post fits within platform constraints." },
    { label: "Speech Prep", input: "A 5-page transcript", output: "Speaking Time: 12 min", description: "Estimating the duration of a keynote or presentation." }
  ]
};
