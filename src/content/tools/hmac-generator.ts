import { ToolContent } from '../../registry/types';

export const hmacGenerator: ToolContent = {
  detailedDescription: `
The **HMAC Generator** (Hash-based Message Authentication Code) is a specific type of cryptographic hash function used to verify both the **data integrity** and **authenticity** of a message simultaneously.

Unlike a standard hash (like SHA-256) which only takes the message as input, an HMAC takes both the message AND a secret cryptographic key. This means that only someone who possesses the secret key can generate the correct hash. It is heavily used in API authentication, webhooks (e.g., Stripe, GitHub), and JSON Web Tokens (JWTs).

All HMAC calculations in KaruviLab are processed strictly inside your local browser using the Web Crypto API, meaning your secret API keys are never uploaded or compromised.
`,
  howTo: [
    "**Step 1:** Paste your message, payload, or raw JSON data into the Input field.",
    "**Step 2:** Paste your secret Key into the Secret Key field.",
    "**Step 3:** Select your preferred hashing algorithm (SHA-256 is the modern standard for webhooks).",
    "**Step 4:** The HMAC will instantly generate in standard Hex format, ready to be compared against incoming API requests."
  ],
  faq: [
    {
      question: "Why use HMAC instead of a standard hash?",
      answer: "A standard hash proves that data hasn't changed, but anyone can calculate it. An HMAC requires a secret key, so it proves that the data hasn't changed AND that it was sent by someone who possesses the secret key (like your payment processor)."
    },
    {
      question: "Are my API secret keys safe here?",
      answer: "Yes! The entire hashing process executes via JavaScript running locally on your machine. Your API secret is never transmitted over a network."
    }
  ],
  useCases: [
    "Webhook Verification: Simulating and verifying webhook signatures from Stripe, GitHub, or Shopify before deploying your backend code.",
    "API Authentication: Generating authenticated request signatures required by financial or exchange APIs.",
    "Data Integrity: Securely verifying that parameters in a URL have not been tampered with by the user."
  ],
  commonErrors: [
    {
      error: "Output doesn't match API provider",
      fix: "Ensure your message is completely identical to the raw payload, including spaces and newlines. Also verify that you are using the correct hashing algorithm (usually SHA-256)."
    }
  ],
  alternatives: ["Hash Generator", "RSA Sign / Verify"]
};
