import { ToolContent } from '../../registry/types';

export const luhnValidator: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: The Luhn Algorithm

Welcome to the engineering guide to the Luhn Algorithm. This handbook explains the mathematical checksum that prevents billions of typing errors every single day.

---

## 1. Prerequisites: The Cost of Typos

Every day, millions of people type their 16-digit credit card numbers into checkout forms. Humans frequently swap digits (e.g., typing \`45\` instead of \`54\`).

**The Problem:** If the checkout form simply accepts the typo, it sends a complex ISO 8583 authorization request to the payment gateway, which routes it to Visa, which routes it to the bank. The bank spends CPU cycles checking the database, only to reply "Account Not Found". This wastes massive amounts of network bandwidth and money for a simple typo.

**The Solution:** Hans Peter Luhn, an IBM scientist, invented a mathematical formula in 1954 called the **Modulus 10** algorithm. By designing credit card numbers so that the final digit is a mathematical checksum of the previous 15 digits, the web browser can detect the typo *instantly* and stop the user before the network request is ever sent.

---

## 2. Mathematical Foundations: How Mod 10 Works

The algorithm is computationally simple, which allowed mechanical machines in the 1960s to execute it instantly.

**The Steps:**
1. Drop the final digit (this is the Check Digit you are trying to verify).
2. Starting from the rightmost digit, double the value of every second digit.
3. If doubling a number results in a two-digit number (e.g., $8 \\times 2 = 16$), add those two digits together ($1 + 6 = 7$).
4. Sum all the resulting digits together.
5. Calculate \`Sum Modulo 10\`.
6. Subtract the result from 10. This is your Check Digit. 
*(If the result is 10, the check digit is 0).*

If the user's typed check digit matches the calculated check digit, the card number is structurally valid.

---

## 3. Threat Model & Security Limitations

🚨 **CRITICAL WARNING:** The Luhn Algorithm provides **Zero Cryptographic Security.**

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Single-Digit Typos** | ✅ Luhn | Successfully catches 100% of single-digit errors. |
| **Transposition Errors** | ⚠️ Luhn | Catches almost all adjacent swaps (e.g., \`45\` to \`54\`), except for the swap of \`09\` to \`90\`. |
| **Fraud / Hacking** | ❌ None | Hackers can easily generate millions of fake, mathematically valid credit card numbers using a simple \`for\` loop. Luhn is an *error-detection* tool, not a security tool. |

---

## 4. Production Workflows

Where is the Luhn Algorithm actively used today?
- **E-Commerce Frontends:** React/Vue checkout forms run the Luhn algorithm locally on every keystroke. If the algorithm fails, the input field turns red, preventing the user from clicking the "Pay" button.
- **IMEI Numbers:** Every mobile phone has a 15-digit IMEI number. The final digit is a Luhn checksum.
- **National Identifiers:** Social Insurance Numbers in Canada and National Provider Identifiers (NPI) for US healthcare providers use Luhn to prevent administrative data entry errors.

---

## 5. Performance & Implementation

Because JavaScript can execute the Luhn algorithm in a fraction of a millisecond, it is perfectly suited for \`onChange\` event listeners in HTML input fields. It prevents bad data from ever entering your backend database.

---

## 6. Standards & References
- **ISO/IEC 7812-1:** Identification cards — Identification of issuers (officially standardizes the use of the Luhn algorithm for PANs).
- **Patent 2,950,048:** Hans Peter Luhn's original 1960 patent for the "Computer for Verifying Numbers".

---

## 7. Interactive Quiz

**Beginner:**
1. Is a credit card number valid if it passes the Luhn check? *(Answer: Mathematically valid, yes. But that does not mean the card actually exists or has money. It just means there are no typos).*
2. Does the Luhn algorithm encrypt my credit card? *(Answer: No. It is just basic arithmetic used for error-checking).*

**Intermediate:**
3. Why does the algorithm double every *second* digit instead of just adding them all up? *(Answer: If you just added them up, swapping two adjacent numbers (like 45 to 54) would result in the exact same sum, meaning the typo would go undetected. Doubling alternating digits mathematically detects the swap).*

**Advanced:**
4. Why doesn't the Luhn algorithm detect the transposition of the digits \`09\` to \`90\`? *(Answer: If you double 0, you get 0 (0+9=9). If you double 9, you get 18 (1+8=9). Both result in the value 9, so the overall sum doesn't change, and the algorithm fails to spot the typo).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Enter the Credit Card, IMEI, or Identification number.",
    "**Step 2:** The tool instantly calculates the Modulo 10 sum as you type.",
    "**Step 3:** If the final digit perfectly aligns with the checksum, the tool marks it as Valid."
  ],
  faq: [
    {
      question: "Is it safe to test real credit card numbers here?",
      answer: "This tool runs the math entirely in your local browser and does not save or transmit the data. However, as a strict rule of operational security, you should NEVER type your real credit card number into random utilities on the internet."
    },
    {
      question: "Why does my fake test number show up as Valid?",
      answer: "Luhn only verifies that the mathematical structure of the number is correct. Anyone can generate a random 16-digit string that passes the Luhn check, but it will be declined by the bank's actual authorization servers."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["IBAN Validator"]
};
