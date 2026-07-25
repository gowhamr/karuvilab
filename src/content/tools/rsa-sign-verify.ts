import { ToolContent } from '../../registry/types';

export const rsaSignVerify: ToolContent = {
  detailedDescription: `
The **RSA Sign & Verify** tool allows you to create and validate cryptographically secure digital signatures. 

Digital signatures are the electronic equivalent of a handwritten signature, but far more secure. They provide **Authenticity** (proving who sent the message) and **Integrity** (proving the message hasn't been tampered with).

- **Signing:** You use your **Private Key** to generate a signature for a specific message.
- **Verifying:** Anyone can use your **Public Key** to verify that the signature matches the message and was created by you.

As always with KaruviLab, all cryptographic operations run 100% locally in your browser, ensuring absolute privacy for your sensitive messages and private keys.
`,
  howTo: [
    "**To Sign a Message:**",
    "1. Switch to the **Sign** tab.",
    "2. Paste your Private Key and the message you want to sign.",
    "3. Select the Hashing Algorithm (SHA-256 is recommended).",
    "4. Click Sign to generate a Base64 encoded signature.",
    "",
    "**To Verify a Signature:**",
    "1. Switch to the **Verify** tab.",
    "2. Paste the sender's Public Key, the exact original message, and the Signature.",
    "3. Click Verify to instantly check if the signature is valid."
  ],
  faq: [
    {
      question: "What does 'Invalid Signature' mean?",
      answer: "An invalid signature means one of three things: the message was altered after it was signed, the wrong public key was used, or the signature itself was copied incorrectly."
    },
    {
      question: "Is this the same as encryption?",
      answer: "No. Encryption hides the message so only the receiver can read it. Signing leaves the message readable but proves who sent it and that it hasn't been tampered with."
    },
    {
      question: "Does the hashing algorithm matter?",
      answer: "Yes! When verifying a signature, you must select the exact same hashing algorithm (e.g., SHA-256) that was used to generate it."
    }
  ],
  useCases: [
    "Software Distribution: Verifying that a downloaded software patch was actually released by the original developer and hasn't been infected with malware.",
    "Legal Agreements: Cryptographically signing a contract or agreement text to prevent repudiation.",
    "API Security: Verifying signed webhook payloads to ensure they actually came from a trusted payment provider."
  ],
  commonErrors: [
    {
      error: "Signature Verification Failed",
      fix: "Ensure that absolutely no characters (including spaces or newlines) have been changed in the original message. Even a single added space will invalidate the signature."
    }
  ],
  alternatives: ["RSA Key Generator", "HMAC Generator"]
};
