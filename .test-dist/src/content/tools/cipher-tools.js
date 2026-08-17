export const cipherTools = {
    detailedDescription: `
The **Cipher Tools** suite provides an educational and practical environment to explore classic encryption techniques, including the Caesar Cipher, Vigenère Cipher, and ROT-13.

While modern encryption (like AES or RSA) relies on complex mathematics, these classical ciphers rely on alphabetical shifting and substitution. Though they are not secure for modern data protection, they form the foundational history of cryptography and are incredibly useful for puzzles, geocaching, capture-the-flag (CTF) challenges, and computer science education.

KaruviLab executes these ciphers completely offline in your browser.
`,
    howTo: [
        "**Step 1:** Select the cipher you want to use (e.g., Caesar Cipher, Vigenère, Atbash, ROT-13).",
        "**Step 2:** Enter your plaintext message into the input field.",
        "**Step 3:** Adjust the specific settings for your cipher (e.g., the Shift value for Caesar, or the Key for Vigenère).",
        "**Step 4:** The ciphertext updates instantly as you type."
    ],
    faq: [
        {
            question: "Are these ciphers secure?",
            answer: "No. Classical ciphers like Caesar and Vigenère can be easily broken by modern computers in fractions of a second using frequency analysis or brute-force. Never use them for sensitive personal or financial information."
        },
        {
            question: "What is ROT-13?",
            answer: "ROT-13 is a specific type of Caesar Cipher where the shift value is exactly 13. Because the English alphabet has 26 letters, applying ROT-13 twice returns the original text. It is often used online to hide spoilers."
        },
        {
            question: "How does the Vigenère cipher work?",
            answer: "It uses a keyword to apply a different Caesar shift to each letter of your message. This makes it slightly harder to crack than a standard Caesar cipher, as the shift changes dynamically."
        }
    ],
    useCases: [
        "Education: Learning the basics of encryption and substitution ciphers.",
        "Puzzles: Solving geocaching riddles, escape room clues, or CTF challenges.",
        "Forums: Using ROT-13 to quickly obfuscate movie spoilers or puzzle solutions online."
    ],
    alternatives: ["AES Encrypt / Decrypt", "Numeral Converter"]
};
