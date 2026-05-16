import { ToolContent } from '../../registry/types';

export const ogPreview: ToolContent = {
  detailedDescription:
    "Simulate how a URL's Open Graph (og:) meta tags will appear when shared on Facebook, Twitter, LinkedIn, and WhatsApp. Enter a URL or paste og: tags directly to see the social media card preview. All rendering is done in the browser — the tool fetches the URL via a proxy or reads pasted tags.",
  howTo: [
    "Enter the URL of the page you want to preview, or paste your og: meta tags directly.",
    "Select the platform tab (Facebook, Twitter, LinkedIn, WhatsApp).",
    "The rendered preview card is displayed.",
    "Adjust your meta tags based on the preview and regenerate.",
  ],
  faq: [
    {
      question: "Why does the preview look different from the actual shared card?",
      answer:
        "Social platforms cache og: data. After updating tags, use the platform's own debugging tool (e.g., Facebook Sharing Debugger) to force a cache refresh.",
    },
    {
      question: "What image size does Facebook recommend?",
      answer:
        "Facebook recommends 1200×630 pixels for the best display across desktop and mobile.",
    },
    {
      question: "What is the og:type tag?",
      answer:
        "`og:type` describes the content type (e.g., `website`, `article`, `product`). The correct type affects how the card is rendered on some platforms.",
    },
  ],
  useCases: [
    "Previewing a blog post's share card before publishing",
    "Testing Open Graph tags for a product page",
    "Verifying that og:image loads correctly at the correct aspect ratio",
    "Comparing card appearance across different platforms",
  ],
  commonErrors: [
    {
      error: "Preview shows no image",
      fix: "Check that `og:image` contains an absolute HTTPS URL to an accessible image. Images behind authentication or on localhost will not load.",
    },
    {
      error: "Old image or description still shows",
      fix: "Use the platform's cache-clearing tool (Facebook Sharing Debugger, LinkedIn Post Inspector) to force a refresh of the cached og: data.",
    },
  ],
  alternatives: ["Facebook Sharing Debugger", "LinkedIn Post Inspector", "Twitter Card Validator"],
};
