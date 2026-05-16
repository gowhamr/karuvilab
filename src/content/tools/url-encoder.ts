import { ToolContent } from '../../registry/types';

export const urlEncoder: ToolContent = {
  detailedDescription:
    "Percent-encode and decode URLs and query string parameters to ensure they are safely transmitted in HTTP requests. Special characters like spaces, `&`, `=`, and non-ASCII letters are replaced with their `%XX` hex equivalents. Everything runs in the browser — no data is sent anywhere.",
  howTo: [
    "Choose 'Encode' or 'Decode' mode.",
    "Paste your URL or query string into the input field.",
    "The encoded or decoded result appears immediately.",
    "Copy the output using the copy button.",
  ],
  faq: [
    {
      question: "When should I encode a URL vs. a query parameter?",
      answer:
        "Use `encodeURI` for full URLs (preserves `://`, `?`, `&`, `=`) and `encodeURIComponent` for individual query parameter values (encodes everything including `&` and `=`).",
    },
    {
      question: "Why does a space become `%20` or `+`?",
      answer:
        "Both are valid in different contexts. `%20` is the RFC-standard encoding; `+` is used only in `application/x-www-form-urlencoded` form data.",
    },
    {
      question: "Does this handle Unicode characters?",
      answer:
        "Yes. Non-ASCII characters are UTF-8-encoded first and then percent-encoded (e.g., `€` becomes `%E2%82%AC`).",
    },
  ],
  useCases: [
    "Encoding a search query before appending it to a URL",
    "Decoding a URL copied from a browser address bar",
    "Fixing a broken link that contains unencoded special characters",
    "Preparing query parameters for an API request",
  ],
  examples: [
    {
      label: "Encode query value",
      input: "hello world & more",
      output: "hello%20world%20%26%20more",
    },
    {
      label: "Decode percent-encoded string",
      input: "caf%C3%A9%20menu",
      output: "café menu",
    },
  ],
  commonErrors: [
    {
      error: "Double-encoding (e.g., `%2520` instead of `%20`)",
      fix: "Decode the string first before re-encoding, or encode only the parts that have not yet been encoded.",
    },
    {
      error: "Encoding the entire URL including `://`",
      fix: "Encode only the query parameter values, not the full URL. Encoding `://` will break the link.",
    },
    {
      error: "`+` signs disappear after decoding",
      fix: "A literal `+` in a URL must be encoded as `%2B`. A raw `+` is interpreted as a space in form-encoded contexts.",
    },
  ],
  alternatives: ["CyberChef", "urlencoder.org", "Browser DevTools Network tab"],
};
