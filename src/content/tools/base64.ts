import { ToolContent } from '../../registry/types';

export const base64: ToolContent = {
  detailedDescription:
    "Encode plain text or binary data to Base64 and decode Base64 strings back to readable text, all inside your browser. Supports both standard Base64 and the URL-safe variant (replacing `+` with `-` and `/` with `_`). Useful for embedding data in JSON, URLs, and HTTP headers without special-character conflicts.",
  howTo: [
    "Select 'Encode' or 'Decode' mode using the toggle.",
    "Paste your input text into the left panel.",
    "The result appears instantly in the right panel.",
    "Toggle 'URL-safe' if you need the `-_` variant instead of `+/`.",
    "Click 'Copy' to copy the result to your clipboard.",
  ],
  faq: [
    {
      question: "Does Base64 encrypt my data?",
      answer:
        "No. Base64 is an encoding scheme, not encryption. Anyone who sees the Base64 string can trivially decode it.",
    },
    {
      question: "Why does my decoded output look garbled?",
      answer:
        "The input may be binary data (like an image) rather than text. Base64 can encode arbitrary bytes, but the decoded output will only be readable if the original was text.",
    },
    {
      question: "What is the URL-safe variant?",
      answer:
        "URL-safe Base64 replaces `+` with `-` and `/` with `_` so the output can be used directly in URLs and filenames without percent-encoding.",
    },
    {
      question: "Is there a size limit?",
      answer:
        "The tool handles typical text and small files. Very large inputs may slow the browser but there is no hard limit enforced.",
    },
  ],
  useCases: [
    "Encoding a JSON payload for a JWT token",
    "Embedding a small image as a Base64 data URI in CSS",
    "Decoding a Base64-encoded API response for inspection",
    "Passing binary data through a text-only protocol",
  ],
  examples: [
    {
      label: "Encode 'Hello, World!'",
      input: "Hello, World!",
      output: "SGVsbG8sIFdvcmxkIQ==",
    },
    {
      label: "Decode 'SGVsbG8='",
      input: "SGVsbG8=",
      output: "Hello",
    },
  ],
  commonErrors: [
    {
      error: "'Invalid Base64' error when decoding",
      fix: "Ensure the string length is a multiple of 4. Missing `=` padding characters are a common cause. Add them manually if needed.",
    },
    {
      error: "Output has unexpected line breaks",
      fix: "Some Base64 encoders insert newlines every 76 characters (MIME style). Remove all whitespace from the input before decoding.",
    },
    {
      error: "URL-safe decode fails on standard Base64",
      fix: "Switch off the URL-safe toggle. Standard Base64 uses `+` and `/`, which differ from the URL-safe `-` and `_`.",
    },
  ],
  alternatives: ["CyberChef", "base64encode.org", "base64decode.org"],
};
