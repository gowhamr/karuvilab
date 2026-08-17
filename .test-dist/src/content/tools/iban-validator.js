export const ibanValidator = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: IBAN (International Bank Account Number) Validation

Welcome to the engineering guide to international banking standards. This handbook explains the massive modular arithmetic that guarantees your wire transfer arrives at the right bank in the right country.

---

## 1. Prerequisites: The Chaos of Global Banking

Before the 1990s, wiring money to a different country was an administrative nightmare. 
- Germany used a Bank Code and an Account Number.
- The UK used a Sort Code and an Account Number.
- Italy used a complex string of internal routing codes.

If you made a typo on a wire transfer form, the receiving bank's computer wouldn't understand the format, requiring a human clerk to manually fix the transaction or bounce it back.

**The Solution:** The **IBAN** (International Bank Account Number). A standardized string (up to 34 characters) that unifies all the different national routing codes into a single, mathematically verifiable format.

---

## 2. Core Concepts: The Anatomy of an IBAN

Every IBAN in the world starts with exactly the same strict format:
1. **Country Code (2 Letters):** e.g., \`GB\` for the UK, \`DE\` for Germany.
2. **Check Digits (2 Numbers):** A mathematical checksum (e.g., \`82\`).
3. **BBAN (Basic Bank Account Number):** The rest of the string, which contains the specific country's bank routing codes and the user's account number.

### The Power of the Check Digits
The two Check Digits instantly prove whether the entire 34-character string is typed correctly. If a customer accidentally misses a digit or swaps two numbers, the bank's web frontend instantly rejects it, preventing a failed international wire transfer.

---

## 3. Mathematical Foundations: Modulo 97-10

Validating an IBAN requires performing a massive mathematical operation defined in **ISO 7064 (MOD 97-10)**.

**The Validation Algorithm:**
1. Take the first 4 characters (Country Code + Check Digits) and move them to the very end of the string.
2. Convert all letters into numbers. (\`A\` becomes 10, \`B\` becomes 11, ... \`Z\` becomes 35).
   - Example: \`GB\` becomes \`1611\`.
3. You now have a massive integer, often 30+ digits long.
4. Calculate \`Massive_Integer MOD 97\`.
5. If the remainder is exactly **1**, the IBAN is perfectly valid. If it is anything else, the IBAN contains a typo.

---

## 4. Engineering Challenge: The JavaScript Integer Limit

When building an IBAN validator in JavaScript, engineers hit a fatal wall.

**The Bug:** The maximum safe integer in JavaScript is \`2^53 - 1\` (9,007,199,254,740,991). An IBAN string converts into a 30-digit integer. If a junior developer tries to use \`parseInt(iban) % 97\`, JavaScript loses precision, rounds the massive number, and completely ruins the modulo calculation, marking valid IBANs as invalid!

**The Engineering Fix:**
1. **Modern Approach:** Use the ES2020 \`BigInt\` primitive (\`BigInt(ibanString) % 97n\`), which handles arbitrarily large integers with perfect precision.
2. **Legacy Approach:** Break the 30-digit string into smaller 7-digit chunks, calculate the modulo of the first chunk, append the remainder to the next chunk, and repeat (Piecewise Modulo Arithmetic).

---

## 5. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Data Entry Typos** | ✅ Modulo 97 | Catching transposed numbers prevents money from being sent to the wrong account or getting stuck in banking limbo. |
| **Fraud / Hacking** | ❌ None | Like the Luhn algorithm, Modulo 97 is an *error-checking* standard, not a security standard. Hackers can easily generate millions of mathematically valid IBANs. Validating an IBAN does not prove the account is open or belongs to the correct person. |

---

## 6. Production Workflows

- **ERP Systems (SAP / Oracle):** When HR adds a new international employee to the payroll system, the frontend runs the Modulo 97 math. If the IBAN is invalid, the system rejects the onboarding form, ensuring payroll isn't delayed.
- **Cross-Border Payments (Wise / Revolut):** The first step in sending an international remittance is evaluating the country code and computing the Mod 97 checksum to validate the recipient before quoting exchange rates.

---

## 7. Standards & References
- **ISO 13616-1:** Specifies the elements of an International Bank Account Number.
- **ISO 7064:** Information technology — Security techniques — Check character systems (defines the MOD 97-10 algorithm).

---

## 8. Interactive Quiz

**Beginner:**
1. Does a valid IBAN guarantee that the bank account actually exists? *(Answer: No. It only mathematically guarantees that the string doesn't contain typos).*

**Intermediate:**
2. What are the first 4 characters of every IBAN? *(Answer: A two-letter Country Code followed by two mathematical Check Digits).*

**Advanced:**
3. Why does standard JavaScript arithmetic fail when calculating the IBAN checksum? *(Answer: Because the IBAN string converts into a 30+ digit number, which exceeds JavaScript's \`MAX_SAFE_INTEGER\` (16 digits). This forces precision loss unless the developer specifically uses \`BigInt\` or piecewise string division).*

---

`,
    howTo: [
        "**Step 1:** Enter the IBAN string (spaces and dashes are automatically stripped).",
        "**Step 2:** The tool converts the letters to integers and moves the Country Code to the end.",
        "**Step 3:** The tool executes the BigInt Modulo 97 calculation.",
        "**Step 4:** If the remainder equals 1, the IBAN is marked as Valid."
    ],
    faq: [
        {
            question: "Are US routing numbers supported?",
            answer: "No. The United States does not participate in the IBAN system, relying instead on ABA Routing Numbers and standard account numbers."
        },
        {
            question: "Is this secure?",
            answer: "Yes, the Modulo 97 algorithm executes entirely inside your browser. No server requests are made."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [
        {
            error: "Valid IBAN marked as invalid",
            fix: "Ensure you selected the correct country. Some countries have identical starting digits, but strictly enforce a specific character length for their national IBANs."
        }
    ],
    alternatives: ["Luhn Validator", "Swift MT/MX Parser"]
};
