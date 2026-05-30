import { ToolContent } from '../../registry/types';

export const passwordGenerator: ToolContent = {
  detailedDescription: `
<p>The Password Generator is a critical security utility designed to help you create cryptographically strong, unique passwords for every online account. In an era where credential stuffing and data breaches are common, using a random, high-entropy password is your first line of defense against cyberattacks.</p>

<p>Our generator provides total control over the complexity of your passwords. You can toggle uppercase letters, lowercase letters, numbers, and special symbols, and adjust the length to meet any site's requirements. Because security is paramount, KaruviLab ensures that the generation process is entirely local. We use the Web Crypto API, which leverages your computer's own randomness sources, meaning your new secrets never exist on any server—even for a millisecond.</p>

<p>Whether you need a simple 8-character pin or a massive 128-character complex string, this tool delivers instant, reliable results. It is also completely functional offline, ensuring you can generate secure keys even when you are disconnected from the network. It is the perfect companion for anyone using a password manager who needs to rotate their credentials regularly.</p>
`,
  howTo: [
    "<strong>Set Length:</strong> Use the slider or input field to choose how long you want your password to be.",
    "<strong>Toggle Options:</strong> Choose which character sets (Numbers, Symbols, etc.) to include based on your security needs.",
    "<strong>Generate:</strong> Click the 'Generate' button to create a new random string.",
    "<strong>Copy:</strong> Use the one-click copy button to add the password to your clipboard.",
    "<strong>Paste & Save:</strong> Immediately paste the password into your account settings and save it in your password manager.",
  ],
  faq: [
    { question: "Is this generator truly random?", answer: "Yes, we use the browser's window.crypto.getRandomValues() method, which is the industry standard for secure randomness." },
    { question: "Does KaruviLab see my passwords?", answer: "No. All generation happens locally in your browser. No data is ever sent to our servers." },
    { question: "Can I use this offline?", answer: "Yes, it is a Progressive Web App (PWA) and works perfectly without an internet connection." },
    { question: "What is a good password length?", answer: "We recommend at least 16 characters for most accounts, and 20+ for critical ones like email or banking." },
    { question: "How often should I change passwords?", answer: "We recommend changing passwords if you suspect a breach, or every 6-12 months for high-value accounts." }
  ],
  examples: [
    { label: "Standard Web", input: "Length: 16, All toggles ON", output: "L8@v!z9m*K5x", description: "A high-entropy password suitable for any modern website." },
    { label: "Numbers Only", input: "Length: 6, Numbers ON", output: "928374", description: "Generating a random numeric PIN for device or app locks." },
    { label: "Alpha Only", input: "Length: 24, Lower/Upper ON", output: "kLpQvMzaXcYwBnRtVpHqWsZf", description: "A long, memorable but secure alphabetic string for internal use." }
  ]
};
