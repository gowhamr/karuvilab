import { ToolContent } from '../../registry/types';

export const urlCleaner: ToolContent = {
  detailedDescription:
    "Strip UTM parameters, ad tracking tokens, and other query string clutter from URLs to produce a clean, shareable link. Supports common tracking parameters from Google Analytics, Facebook Ads, MailChimp, and more. Runs entirely in the browser — no URLs are sent to a server.",
  howTo: [
    "Paste the full URL (including query parameters) into the input field.",
    "The cleaned URL with all tracking parameters removed appears instantly.",
    "Review the list of removed parameters shown below.",
    "Copy the clean URL.",
  ],
  faq: [
    {
      question: "Which parameters are removed?",
      answer:
        "By default: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid`, `gclid`, `mc_eid`, `ref`, `source`, and dozens more. You can customise the list.",
    },
    {
      question: "Will removing UTM parameters break the destination page?",
      answer:
        "No. UTM parameters are only used for analytics tracking. The destination page content is the same with or without them.",
    },
    {
      question: "Can I keep certain parameters?",
      answer:
        "Yes. Use the exclusion list to specify parameters that should not be removed (e.g., a `?id=` that the page actually needs).",
    },
  ],
  useCases: [
    "Cleaning a URL before sharing it in a chat or email",
    "Removing tracking tokens from URLs before bookmarking",
    "Generating canonical URLs for content without analytics noise",
    "Simplifying affiliate links before sharing publicly",
  ],
  examples: [
    {
      label: "Strip UTM params",
      input: "https://example.com/blog?utm_source=newsletter&utm_medium=email&utm_campaign=may2025",
      output: "https://example.com/blog",
    },
  ],
  commonErrors: [
    {
      error: "Cleaned URL breaks the page",
      fix: "A parameter that looks like a tracker (e.g., `id`, `ref`) may actually be required by the page. Add it to the exclusion list.",
    },
    {
      error: "URL still contains tracking parameters after cleaning",
      fix: "Some platform-specific parameters may not be in the default list. Add them manually in the custom parameters field.",
    },
  ],
  alternatives: ["ClearURLs browser extension", "URLCleaner.com", "uBlock Origin (partial)"],
};
