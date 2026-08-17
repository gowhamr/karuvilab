export const rsaEncryptDecrypt = {
    detailedDescription: `
The **RSA Encrypt / Decrypt** tool provides browser-native asymmetric encryption. RSA (Rivest–Shamir–Adleman) is a widely-used public-key cryptosystem that forms the backbone of secure internet communication (like HTTPS/SSL).

Unlike AES (symmetric), RSA uses two different keys: a **Public Key** to encrypt data, and a **Private Key** to decrypt it. This allows you to securely receive messages from anyone without having to secretly share a password first.

This tool utilizes the Web Crypto API to perform cryptographic operations **locally** on your device. Your sensitive messages and private keys are never transmitted to any external server. 

### Key Features
- Supports standard PEM formatted RSA keys (PKCS#1 and PKCS#8).
- Allows toggling between SHA-256 and SHA-512 hashing algorithms.
- Automatically handles Base64 encoding/decoding of the ciphertext for easy copy-pasting.
`,
    howTo: [
        "**Step 1:** Select the operation mode: **Encrypt** or **Decrypt**.",
        "**Step 2:** Paste the appropriate key into the key field. (Use a Public Key to Encrypt, or a Private Key to Decrypt).",
        "**Step 3:** Paste your message or ciphertext into the Input field.",
        "**Step 4:** The Web Crypto API will instantly process the text and display the result."
    ],
    faq: [
        {
            question: "Are my keys uploaded to a server?",
            answer: "No. All cryptographic operations happen securely inside your local browser. Your Private Keys are never uploaded or saved."
        },
        {
            question: "Why is there a strict character limit for RSA encryption?",
            answer: "RSA is computationally expensive and mathematically limited by the key size. For example, a 2048-bit RSA key can only encrypt about 190 characters of text at a time. For larger files, it is standard practice to encrypt the file using AES, and then use RSA to encrypt the AES password."
        },
        {
            question: "Can I use an SSH key?",
            answer: "This tool strictly supports standard PEM formatted X.509 keys (PKCS#1 / PKCS#8). SSH keys (like OpenSSH format) must be converted to PEM format first."
        }
    ],
    useCases: [
        "Secure Message Passing: Provide someone your Public Key so they can encrypt a sensitive message that only you can read.",
        "API Testing: Verify encryption logic against a backend API that expects RSA encrypted payloads.",
        "Key Validation: Quickly test if a specific Private Key correctly decrypts a message."
    ],
    commonErrors: [
        {
            error: "Message too long for RSA",
            fix: "RSA cannot encrypt large amounts of text. If you have a long message, use the AES Encrypt Decrypt tool, and use this RSA tool to securely share the AES password."
        },
        {
            error: "Invalid PEM format",
            fix: "Ensure your key includes the header (e.g., `-----BEGIN PUBLIC KEY-----`) and footer, with no leading or trailing whitespace."
        }
    ],
    alternatives: ["AES Encrypt / Decrypt", "RSA Key Generator", "CyberChef"]
};
