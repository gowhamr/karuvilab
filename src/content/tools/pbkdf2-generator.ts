import { ToolContent } from '../../registry/types';

export const pbkdf2Generator: ToolContent = {
  detailedDescription: `
The **PBKDF2 Generator** (Password-Based Key Derivation Function 2) is a specialized cryptographic tool used to convert a simple human-readable password into a highly secure, mathematically complex cryptographic key.

PBKDF2 is an industry standard (RFC 2898) used extensively for password hashing and generating keys for AES encryption. It works by applying a hashing function (like SHA-256) to a password and a "salt", and then repeating that process thousands of times (iterations). This intentional "slowness" makes brute-force and dictionary attacks extremely difficult for hackers.

Our tool allows you to simulate and generate these derived keys completely locally in your browser.
`,
  howTo: [
    "**Step 1:** Enter your base Password or Passphrase.",
    "**Step 2:** Provide a Salt. A salt is random data added to the password to ensure that the same password always produces a different key.",
    "**Step 3:** Set the Iterations. The recommended modern minimum is 100,000, though higher numbers (e.g., 600,000) are heavily encouraged for maximum security.",
    "**Step 4:** Select the Hash algorithm (SHA-256 is standard) and the desired Key Length (e.g., 256 bits for AES-256).",
    "**Step 5:** The resulting derived key will be generated in Hex format."
  ],
  faq: [
    {
      question: "Why does it take a moment to generate?",
      answer: "That is by design! PBKDF2 forces the computer to run the hash function thousands of times. This 'key stretching' prevents attackers from guessing billions of passwords per second."
    },
    {
      question: "What is a Salt?",
      answer: "A salt is public random data mixed with your password. It prevents attackers from using pre-computed 'Rainbow Tables' to crack your password."
    },
    {
      question: "Is this tool safe to use with real passwords?",
      answer: "Yes. The generation happens strictly inside your local browser. Your password and salt are never transmitted over the internet."
    }
  ],
  useCases: [
    "Developer Debugging: Verifying that your backend PBKDF2 implementation matches standard output.",
    "Custom Encryption: Deriving a secure 256-bit key from a memorable passphrase to use in raw AES encryption.",
    "Security Education: Demonstrating how iteration counts slow down the key generation process to thwart attackers."
  ],
  commonErrors: [
    {
      error: "Browser hangs or freezes",
      fix: "If you set the iteration count excessively high (e.g., 10,000,000) on a slow device, the browser's JavaScript engine may struggle to complete the math. Try sticking to the recommended 100k - 600k range."
    }
  ],
  alternatives: ["Hash Generator", "AES Encrypt / Decrypt"]
};
