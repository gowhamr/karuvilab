import { ToolContent } from '../../registry/types';

export const jwtDecoder: ToolContent = {
  detailedDescription:
    "Decode and inspect the header and payload sections of any JSON Web Token (JWT) without needing a secret key. This tool parses the Base64URL-encoded parts and displays the JSON contents in a readable format. Note: this tool does not verify the signature — it only reads the claims.",
  howTo: [
    "Paste the full JWT string (three dot-separated parts) into the input field.",
    "The header and payload JSON are automatically decoded and displayed.",
    "Review the claims such as `iss`, `exp`, `sub`, and custom fields.",
    "Check the expiry (`exp`) timestamp to see if the token is still valid.",
  ],
  faq: [
    {
      question: "Does this verify the JWT signature?",
      answer:
        "No. Signature verification requires the secret or public key held by the issuing server. This tool only decodes the readable parts of the token.",
    },
    {
      question: "Is it safe to paste a production JWT here?",
      answer:
        "Decoding happens entirely in your browser — nothing is sent to a server. That said, treat JWTs like passwords; avoid pasting tokens with sensitive permissions into any third-party site.",
    },
    {
      question: "Why does the payload show an `exp` timestamp?",
      answer:
        "`exp` is a Unix timestamp (seconds since 1970-01-01 UTC). The tool converts it to a human-readable date for convenience.",
    },
    {
      question: "I see 'Invalid JWT format' — why?",
      answer:
        "A valid JWT must consist of exactly three Base64URL parts separated by dots. Ensure you copied the complete token without extra spaces or line breaks.",
    },
  ],
  useCases: [
    "Inspecting token claims during API development and debugging",
    "Checking whether a JWT has expired",
    "Reading user roles and permissions embedded in a token",
    "Teaching JWT structure in a workshop or tutorial",
  ],
  examples: [
    {
      label: "Decode a sample JWT header",
      input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<sig>",
      output: '{ "alg": "HS256", "typ": "JWT" }',
    },
  ],
  commonErrors: [
    {
      error: "'Invalid JWT' with a token that looks correct",
      fix: "Remove any surrounding quotes or whitespace. Some tools wrap JWTs in quotes when copying.",
    },
    {
      error: "Payload shows garbled characters",
      fix: "The JWT may use a non-standard encoding. Ensure the token is a proper Base64URL string without standard Base64 `+` or `/` characters.",
    },
    {
      error: "`exp` claim shows a date in the past",
      fix: "The token has expired. Your application or server needs to issue a fresh token.",
    },
  ],
  alternatives: ["jwt.io", "token.dev", "CyberChef"],
};
