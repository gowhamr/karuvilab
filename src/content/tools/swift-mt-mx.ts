import { ToolContent } from '../../registry/types';

export const swiftMtMx: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: SWIFT Messaging (MT & MX)

Welcome to the engineering guide to international money movement. This handbook explains the private language used by global banks to transfer trillions of dollars every day.

---

## 1. Prerequisites: The SWIFT Network Illusion

**The biggest misconception in banking:** The SWIFT network does not move money.

If you wire $100,000 from a bank in New York to a bank in London, physical money doesn't cross the ocean, and digital funds don't leave the SWIFT network. 
SWIFT (Society for Worldwide Interbank Financial Telecommunication) is essentially a highly secure, private WhatsApp group for banks. It only sends **messages**. 

The message says: *"Hey London Bank, I am debiting my ledger by $100k, please credit your ledger for John Doe by $100k."* The actual settlement of funds happens later through central bank accounts.

---

## 2. Core Concepts: The Legacy MT (Message Type) Standard

For 40 years, banks communicated using the **MT (Message Type)** standard. It is a rigid, text-based format designed in the 1970s when bandwidth was extremely expensive.

### Anatomy of an MT Message
A typical message (like an **MT103** - Single Customer Credit Transfer) is divided into Blocks:
- **Block 1 (Basic Header):** Application ID, Service ID, Sender's BIC (Bank Identifier Code).
- **Block 2 (Application Header):** Input/Output indicators, Message Type (e.g., 103), Priority.
- **Block 3 (User Header):** Processing references.
- **Block 4 (Text Block):** The actual payload, defined by numbered "Tags".
  - \`:32A:\` Value Date, Currency, and Amount (e.g., \`230725USD100000,00\`)
  - \`:50K:\` Ordering Customer (Sender details)
  - \`:59:\` Beneficiary Customer (Receiver details)
- **Block 5 (Trailer):** Checksums and authentication (MAC).

**The Problem with MT:** It is terrible at handling complex data. If a sender has a long address, it gets truncated. Because of this, automated AML (Anti-Money Laundering) scanners often flag innocent transfers because the data is too messy to read accurately.

---

## 3. The Future: The MX (ISO 20022) Migration

To fix the limitations of the 1970s MT format, the global financial system is currently undergoing the largest migration in its history: moving to **MX (ISO 20022)**.

### What is MX?
MX abandons the rigid text blocks and replaces them with highly structured, strictly validated **XML** (eXtensible Markup Language).
- Instead of stuffing a name and address into a generic \`:50K:\` tag, MX uses deeply nested XML nodes: \`<PstlAdr><StrtNm>Wall Street</StrtNm><BldgNb>100</BldgNb></PstlAdr>\`.

**Why the world is migrating:**
1. **Richer Data:** Massive capacity for invoice details and ultimate beneficiary tracking.
2. **Better Compliance:** AML and KYC (Know Your Customer) AI systems can accurately scan specific XML nodes to catch terrorists and sanctions evaders, reducing false-positive frozen funds.
3. **Straight-Through Processing (STP):** Computers can read XML flawlessly, meaning fewer human clerks are needed to manually fix broken wire transfers.

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Man-in-the-Middle** | ✅ SWIFT Network | SWIFT operates over a private, highly encrypted IP network disconnected from the public internet. |
| **Message Tampering** | ✅ Block 5 MAC | Every message is cryptographically hashed and signed. If a byte changes, the recipient rejects it. |
| **Insider Heists** | 🚨 **Vulnerable** | The 2016 Bangladesh Bank heist ($81 million stolen) occurred because hackers compromised the bank's internal network, stole the SWIFT terminal credentials, and injected valid, authenticated MT messages. The network worked perfectly; the *endpoints* were compromised. |

---

## 5. Browser Internals & Implementation

Parsing MT messages is an exercise in complex Regex. KaruviLab reads the raw \`{1:...}{2:...}{4: ... }\` block structures, extracts the specific numeric Tags, and maps them to a human-readable JSON dictionary referencing the official SWIFT rulebook.

---

## 6. Standards & References
- **ISO 15022:** The standard dictating the legacy MT message structure.
- **ISO 20022:** The modern XML-based standard replacing MT globally by 2025+.

---

## 7. Interactive Quiz

**Beginner:**
1. Does the SWIFT network move actual money? *(Answer: No. It only transmits highly secure text messages instructing banks to update their internal ledgers).*

**Intermediate:**
2. What is an MT103? *(Answer: The specific Message Type code for a Single Customer Credit Transfer—the most common international wire transfer).*
3. Why are banks globally migrating from MT to MX (ISO 20022)? *(Answer: MT is a rigid, legacy text format that truncates data. MX uses rich XML, allowing for automated compliance scanning and richer payment context).*

**Advanced:**
4. How did hackers steal $81 million from the Central Bank of Bangladesh if SWIFT cryptography wasn't broken? *(Answer: They bypassed the cryptography entirely by hacking the bank's internal Windows network, taking remote control of the SWIFT terminal, and legally authorizing the transfers as if they were bank employees).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Paste your raw SWIFT MT message text (must contain the {1:...} header blocks).",
    "**Step 2:** Click Parse.",
    "**Step 3:** The tool will automatically identify the Message Type (e.g., MT103, MT202) and break down Block 4 into human-readable fields like Sender, Beneficiary, and Amount."
  ],
  faq: [
    {
      question: "Can I parse XML MX messages here?",
      answer: "Currently, this tool specializes in parsing the legacy MT block format, which is notoriously difficult to read for humans."
    },
    {
      question: "Is it safe to paste real SWIFT logs here?",
      answer: "Parsing happens locally in your browser, but for compliance reasons, you should redact real bank account numbers and customer names before pasting corporate logs into any web browser."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["ISO 8583 Message Parser"]
};
