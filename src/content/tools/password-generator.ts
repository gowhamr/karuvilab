import { ToolContent } from '../../registry/types';

export const passwordGenerator: ToolContent = {
  detailedDescription: `
    <p>In an era of increasing digital security threats, the strength of your passwords is your first line of defense. The KaruviLab Password Generator is a high-performance utility designed to create cryptographically secure, random passwords. Whether you are creating a new account on a social platform, securing a bank portal, or generating an API secret for a development project, our tool ensures your credentials are virtually impossible to brute-force.</p>
    
    <p>Security is our core philosophy. Unlike password generators that run on remote servers, the KaruviLab tool uses your browser's native <code>crypto.getRandomValues</code> API, which provides a cryptographically secure pseudorandom number generator (CSPRNG). Because everything happens in your local browser sandbox, your generated passwords never touch the internet. They exist only in your browser’s temporary memory, providing you with a high-entropy security solution that respects your privacy.</p>

    <p>The tool provides complete customization, allowing you to control length, character sets (uppercase, lowercase, numbers, symbols), and patterns. This flexibility ensures compatibility with any site's unique security requirements, while maintaining the highest standard of randomness for optimal protection.</p>
  `,
  howTo: [
    "<strong>Set Length:</strong> Adjust the slider to select your desired password length (we recommend at least 16 characters).",
    "<strong>Choose Character Sets:</strong> Toggle uppercase, lowercase, numbers, and symbols based on the requirements of the website you are registering for.",
    "<strong>Generate:</strong> The generator updates instantly. You can keep clicking 'Generate' until you find a password you are comfortable with.",
    "<strong>Copy:</strong> Simply click the 'Copy' button to save the password directly to your system clipboard for quick pasting.",
  ],
  faq: [
    {
      question: "Is this password generation truly random?",
      answer: "Yes. We utilize the browser's <code>crypto.getRandomValues</code> API, which is designed for cryptographic purposes. It is far superior to standard `Math.random()` functions used in weaker tools.",
    },
    {
      question: "Where are my generated passwords stored?",
      answer: "They are not stored anywhere. As soon as you refresh the page or close your browser, the passwords disappear. They never leave your device.",
    },
    {
      question: "What makes a password 'strong'?",
      answer: "A strong password has high entropy, achieved through a long character count (16+) and a varied mix of character types—uppercase, lowercase, digits, and special symbols.",
    },
    {
      question: "Does this tool work on mobile?",
      answer: "Yes, the tool is fully responsive and works perfectly on mobile devices, providing the same high-security cryptographic randomness as on desktop.",
    },
  ],
  useCases: [
    "Generating strong credentials for new online accounts.",
    "Creating high-entropy tokens for API keys and environment secrets.",
    "Developing secure Wi-Fi passphrases that are resistant to cracking.",
    "Producing temporary recovery codes or shared account passwords.",
  ],
  examples: [
    {
      label: "Highly Secure (16 chars)",
      input: "Length: 16 | Symbols + Digits + Mixed Case",
      output: "gT3#mXqL!9wZkR@2",
      description: "A strong choice for daily use on banking or email accounts."
    },
    {
      label: "Maximum Entropy (32 chars)",
      input: "Length: 32 | Symbols + Digits + Mixed Case",
      output: "V9#bK5$pL2!wQ8&zJ0!nS7@xP3*uF4m",
      description: "Recommended for top-tier security accounts (e.g., password managers, administrative logins)."
    }
  ],
  commonErrors: [
    {
      error: "Website rejected my password",
      fix: "Some sites have specific restrictions on special characters. Try unchecking the 'Symbols' toggle or using a slightly shorter password.",
    },
    {
      error: "Copy functionality does not work",
      fix: "For security, browsers require that web apps be served over HTTPS to access the system clipboard. Please ensure you are accessing KaruviLab via https://karuvilab.com.",
    },
  ],
  alternatives: ["Bitwarden Password Generator", "1Password Generator", "KeePass"],
};
