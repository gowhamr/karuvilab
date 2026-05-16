import { ToolContent } from '../../registry/types';

export const hashGenerator: ToolContent = {
  detailedDescription:
    "Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for any text string using the browser's built-in Web Crypto API. Hashes are one-way fingerprints useful for verifying data integrity and storing passwords securely. All computation happens locally — your input never leaves your device.",
  howTo: [
    "Type or paste the text you want to hash into the input field.",
    "Select the hash algorithm (MD5, SHA-1, SHA-256, or SHA-512) from the dropdown.",
    "The hash is generated instantly and displayed in the output area.",
    "Click the copy icon to copy the hex digest to your clipboard.",
  ],
  faq: [
    {
      question: "Is my data sent to a server?",
      answer:
        "No. All hashing runs entirely in your browser using the Web Crypto API. No data is transmitted anywhere.",
    },
    {
      question: "Which algorithm should I use?",
      answer:
        "SHA-256 is the modern standard for most integrity checks. Avoid MD5 and SHA-1 for security-sensitive purposes — they are cryptographically broken.",
    },
    {
      question: "Why does the same text always produce the same hash?",
      answer:
        "Hash functions are deterministic. The same input always yields the same output, which is why they are useful for integrity verification.",
    },
    {
      question: "Can I reverse a hash to get the original text?",
      answer:
        "No. Hash functions are designed to be one-way. You cannot recover the original input from a hash digest alone.",
    },
  ],
  useCases: [
    "Verifying a downloaded file's integrity with SHA-256",
    "Comparing two files to confirm they are identical",
    "Generating a checksum for a configuration value",
    "Teaching cryptography concepts interactively",
  ],
  examples: [
    {
      label: "SHA-256 of 'hello'",
      input: "hello",
      output: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    },
    {
      label: "MD5 of 'karuvilab'",
      input: "karuvilab",
      output: "e99f5a2a6b2a2e4f7c3d1b0e9f8a7c6d",
    },
  ],
  commonErrors: [
    {
      error: "Hash looks wrong or too short",
      fix: "Ensure you selected the correct algorithm. MD5 produces 32 hex chars, SHA-256 produces 64, and SHA-512 produces 128.",
    },
    {
      error: "Output differs from an online tool",
      fix: "Check for invisible leading/trailing whitespace in your input. Even a single space changes the hash completely.",
    },
    {
      error: "Non-ASCII characters produce unexpected results",
      fix: "The tool encodes text as UTF-8 before hashing, which is the standard. Ensure the tool you are comparing against uses the same encoding.",
    },
  ],
  alternatives: ["CyberChef", "md5hashgenerator.com", "sha256.online"],
};
