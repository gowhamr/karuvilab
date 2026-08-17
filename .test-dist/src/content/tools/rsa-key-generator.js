export const rsaKeyGenerator = {
    detailedDescription: `
The **RSA Key Generator** is a powerful cryptographic tool that generates mathematically linked Public and Private key pairs directly in your browser. RSA (Rivest-Shamir-Adleman) is a standard asymmetric algorithm used worldwide for secure data transmission, digital signatures, and SSL certificates.

When you generate keys with KaruviLab, the entire mathematical process is handled locally on your device by the **Web Crypto API**. We do not use any server-side generation. This ensures that your private keys are completely offline and immune to network interception or server-side logging.
`,
    howTo: [
        "**Step 1:** Select the desired Key Size. (2048-bit is standard for most applications, 4096-bit provides maximum security for long-term usage).",
        "**Step 2:** Click **Generate Keys**.",
        "**Step 3:** The tool will perform the mathematical generation process and output a Public Key and a Private Key in standard PEM format.",
        "**Step 4:** Use the Copy or Download buttons to securely store your keys. **Never share your Private Key with anyone.**"
    ],
    faq: [
        {
            question: "Are my keys uploaded to or generated on a server?",
            answer: "No. The keys are generated entirely in your browser using the native Web Crypto API. Your private key never leaves your device."
        },
        {
            question: "What is the difference between 2048-bit and 4096-bit?",
            answer: "A 2048-bit key is highly secure and perfectly adequate for standard use, while offering fast encryption and decryption speeds. A 4096-bit key offers extreme security for highly sensitive or long-term data, but it takes longer to generate and process."
        },
        {
            question: "Can I retrieve my Private Key if I lose it?",
            answer: "No. Because the keys are generated locally and we don't store them, it is mathematically impossible to recover a lost private key. Ensure you back it up securely."
        }
    ],
    useCases: [
        "Creating personal keys for secure, encrypted messaging.",
        "Generating keys for signing digital documents to prove authenticity.",
        "Creating a key pair to integrate into a backend API or CI/CD pipeline for JWT verification."
    ],
    commonErrors: [
        {
            error: "Generation takes a long time or freezes",
            fix: "Generating a 4096-bit RSA key is computationally intensive. On older devices or mobile phones, it may take several seconds to complete. Please wait for the process to finish."
        }
    ],
    alternatives: ["RSA Encrypt / Decrypt", "RSA Sign / Verify"]
};
