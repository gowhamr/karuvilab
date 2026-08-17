export const hashGenerator = {
    detailedDescription: `
A **Hash Generator** creates a unique digital fingerprint (hash value) from any text or file. Hashes are commonly used for data verification, security, software distribution, digital signatures, and cryptographic applications. This free online utility lets you create MD5, SHA-1, SHA-256, and SHA-512 hashes instantly in your browser.

In line with KaruviLab's core philosophy, all processing happens locally on your device using the **Web Crypto API**, ensuring your data remains private and secure. There are no uploads, no accounts, and zero server-side processing required. Whether you are a developer verifying a checksum or a student learning about cryptography, our tool provides a safe and fast environment for all your hashing needs.

### What Is a Hash Function?
A hash function is a mathematical algorithm that converts data of any size into a fixed-length string of characters called a hash value or digest. Even a small change in the input creates a completely different hash output. This property makes hash functions useful for **data integrity verification** and detecting unauthorized modifications.

### Supported Hash Algorithms
- **MD5:** Produces a 128-bit hash value. While useful for file checksums in legacy systems, it is no longer considered secure for cryptographic purposes due to collision vulnerabilities.
- **SHA-1:** Generates a 160-bit hash value. Like MD5, it is considered cryptographically weak and should not be used for new security implementations.
- **SHA-256:** Part of the SHA-2 family, it produces a 256-bit hash. It is the recommended standard for most modern use cases, including file integrity, digital certificates, and blockchain technology.
- **SHA-512:** Generates a 512-bit hash value and offers a higher security margin, often used in high-security enterprise applications.

By keeping all cryptographic operations strictly within your browser, KaruviLab ensures that your text, files, and secret keys **never leave your device**. This makes it an ideal tool for privacy-conscious professionals and developers.
`,
    howTo: [
        "**Step 1:** Type or paste the text you want to hash into the main input field.",
        "**Step 2:** Select your desired hash algorithm (MD5, SHA-1, SHA-256, or SHA-512).",
        "**Step 3:** If using HMAC mode, enter your secret key to sign the message.",
        "**Step 4:** The hash is generated instantly. Use the 'Copy' button to save the result to your clipboard.",
    ],
    faq: [
        {
            question: "Is my data uploaded to a server?",
            answer: "No. All processing happens locally in your browser using the Web Crypto API. Your files and text remain on your device, ensuring total privacy.",
        },
        {
            question: "Which hash algorithm should I use?",
            answer: "For most purposes, **SHA-256** is recommended because it provides strong security, is not currently susceptible to collisions, and has broad compatibility.",
        },
        {
            question: "Why does the same text always generate the same hash?",
            answer: "Hash functions are deterministic. The same input always produces the same output. This is what allows them to be used as digital fingerprints for data comparison.",
        },
        {
            question: "Can a hash be reversed?",
            answer: "No. Cryptographic hash functions are designed to be one-way functions. The original input cannot be recovered from the hash alone, making them different from encryption.",
        },
        {
            question: "Are MD5 and SHA-1 secure?",
            answer: "No. Both MD5 and SHA-1 have known cryptographic weaknesses (collisions) and should not be used for modern security-sensitive applications or password hashing.",
        },
    ],
    useCases: [
        "Verify File Downloads: Compare your local hash with the vendor's published SHA-256 checksum.",
        "Confirm Data Integrity: Detect if a file or configuration has been modified or corrupted.",
        "Software Development: Generate unique identifiers for content and track modifications in repositories.",
        "Cybersecurity Education: Experiment with the 'avalanche effect' where changing one character changes the entire hash.",
    ],
    examples: [
        {
            label: "SHA-256 of 'hello'",
            input: "hello",
            output: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
            description: "A standard SHA-256 digest showing the fixed-length character string generated from simple text.",
        },
        {
            label: "MD5 of 'karuvilab'",
            input: "karuvilab",
            output: "e99f5a2a6b2a2e4f7c3d1b0e9f8a7c6d",
            description: "Example of a legacy MD5 checksum used for basic file identification.",
        },
        {
            label: "SHA-512 high security",
            input: "privacy-first-tools",
            output: "0751a029094... (truncated)",
            description: "A longer, 512-bit digest providing the highest level of collision resistance for sensitive data.",
        },
    ],
    commonErrors: [
        {
            error: "Output differs from other tools",
            fix: "Check for invisible characters, trailing spaces, or line breaks (\\n) in your input. Even a single space will result in a completely different hash value.",
        },
        {
            error: "MD5/SHA-1 Security Warnings",
            fix: "If you receive a security warning, it is because these algorithms are no longer considered safe for passwords. Switch to SHA-256 or SHA-512 for better security.",
        },
    ],
    alternatives: ["CyberChef", "Online Checksum Tool", "OS-level 'shasum' command"],
};
