import { ToolContent } from '../../registry/types';

export const passwordGenerator: ToolContent = {
  detailedDescription:
    "Create strong, random passwords of any length using the browser's cryptographically secure `crypto.getRandomValues` API. Choose from uppercase, lowercase, digits, and symbols to match any site's password policy. Passwords are generated entirely in your browser and are never stored or transmitted.",
  howTo: [
    "Set the desired password length using the slider or number input.",
    "Toggle the character sets you want: uppercase, lowercase, numbers, and/or symbols.",
    "Click 'Generate' (or wait for the live preview) to create a new password.",
    "Click 'Copy' to copy the password to your clipboard.",
    "Click 'Generate' again to create a different password at any time.",
  ],
  faq: [
    {
      question: "Is this truly random?",
      answer:
        "Yes. The tool uses `crypto.getRandomValues`, which is a cryptographically secure pseudorandom number generator (CSPRNG) provided by your browser.",
    },
    {
      question: "Are generated passwords saved anywhere?",
      answer:
        "No. Passwords exist only in your browser's memory and are discarded when you navigate away.",
    },
    {
      question: "What length should I use?",
      answer:
        "At least 16 characters for general accounts and 24+ for sensitive accounts. Longer passwords are exponentially harder to brute-force.",
    },
    {
      question: "Why is the tool not generating symbols?",
      answer:
        "Make sure the 'Symbols' toggle is enabled. If a site doesn't allow symbols, you can turn that set off.",
    },
  ],
  useCases: [
    "Generating a secure password for a new online account",
    "Creating a random API key or secret token for testing",
    "Producing a strong Wi-Fi passphrase",
    "Creating temporary passwords for shared accounts",
  ],
  examples: [
    {
      label: "16-char, all sets",
      input: "length=16, upper+lower+digits+symbols",
      output: "gT3#mXqL!9wZkR@2",
    },
    {
      label: "12-char, alphanumeric only",
      input: "length=12, upper+lower+digits",
      output: "Kx7mN2pQrJ4w",
    },
  ],
  commonErrors: [
    {
      error: "Password rejected by the target site",
      fix: "Check the site's requirements and adjust character sets accordingly — some sites disallow certain symbols.",
    },
    {
      error: "Generated password is too predictable",
      fix: "Ensure you are not using a very short length. Use at least 16 characters and enable all character sets.",
    },
    {
      error: "Copy button doesn't work",
      fix: "Browser clipboard access requires HTTPS or localhost. If you see a permission error, manually select and copy the password text.",
    },
  ],
  alternatives: ["Bitwarden password generator", "1Password generator", "KeePass"],
};
