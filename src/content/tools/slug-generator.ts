import { ToolContent } from '../../registry/types';

export const slugGenerator: ToolContent = {
  detailedDescription:
    "Convert any page title or phrase into a clean, SEO-friendly URL slug. Removes special characters, converts spaces to hyphens, lowercases everything, and strips common stop words optionally. Generates slugs instantly in the browser — no server required.",
  howTo: [
    "Type or paste your page title into the input field.",
    "The slug is generated instantly below.",
    "Toggle 'Remove stop words' to strip common words (the, a, an, in, etc.) for a shorter slug.",
    "Copy the slug and use it in your CMS or URL structure.",
  ],
  faq: [
    {
      question: "Why should I use hyphens instead of underscores?",
      answer:
        "Google treats hyphens as word separators and underscores as word joiners. Use hyphens for SEO-friendly URLs.",
    },
    {
      question: "What characters are removed?",
      answer:
        "All characters that are not alphanumeric or hyphens are removed. Accented characters (é, ñ, ü) are transliterated to ASCII equivalents.",
    },
    {
      question: "Should I include stop words in the slug?",
      answer:
        "Short, descriptive slugs are preferred. Removing stop words (the, is, of) makes slugs shorter and cleaner without losing keyword value.",
    },
  ],
  useCases: [
    "Generating a URL slug for a new blog post",
    "Creating consistent URL patterns for a product catalogue",
    "Converting user-submitted titles to safe URL components",
    "Batch-generating slugs for an imported content library",
  ],
  examples: [
    {
      label: "Blog post title to slug",
      input: "10 Tips for Better SEO in 2025!",
      output: "10-tips-for-better-seo-in-2025",
    },
    {
      label: "Title with accents",
      input: "Café au Lait Recipe",
      output: "cafe-au-lait-recipe",
    },
  ],
  commonErrors: [
    {
      error: "Slug contains consecutive hyphens",
      fix: "The tool should collapse multiple hyphens into one. If not, remove special characters from the source title before generating.",
    },
    {
      error: "Slug starts or ends with a hyphen",
      fix: "Leading and trailing hyphens are trimmed automatically. If they persist, check for leading/trailing spaces in the input.",
    },
  ],
  alternatives: ["Slugify.online", "SEOBook Slug Generator", "Yoast SEO plugin (WordPress)"],
};
