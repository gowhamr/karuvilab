import { ToolContent } from '../../registry/types';

export const iso8583MessageParser: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: ISO 8583 (The Language of Financial Transactions)

Welcome to the definitive engineering guide to ISO 8583. This handbook explains the invisible digital language that powers almost every ATM, credit card swipe, and POS terminal in the world.

---

## 1. Prerequisites: The Dial-Up Era

When you swipe a credit card at a gas station, the terminal needs to ask the bank: *"Does John have $50?"* 

In the 1980s, these terminals communicated over extremely slow, unreliable dial-up phone lines. Sending a modern JSON payload like \`{"merchant": "GasStation", "amount": 50.00}\` took too many bytes. 
Engineers needed a hyper-compressed binary format where every single bit mattered. 

The result was **ISO 8583**. It doesn't use variable keys like JSON; it uses a rigid sequence of numbered "Data Elements" (DE). Instead of sending the word "amount", the standard defines that Data Element 4 is *always* the Amount.

---

## 2. Core Concepts: The Anatomy of an ISO 8583 Message

Every ISO 8583 message consists of three fundamental parts:

### 1. The MTI (Message Type Indicator)
A 4-digit code explaining the purpose of the message. 
- \`0200\`: Financial Transaction Request (e.g., Please authorize this $50 purchase).
- \`0210\`: Financial Transaction Response (e.g., Yes, approved).
- \`0800\`: Network Management Request (e.g., ATM saying "Hello, am I connected?").

### 2. The Bitmap (The Magic of Compression)
If there are 128 possible Data Elements, but a simple purchase only needs 10 of them, sending 118 blank fields wastes bandwidth. 
The **Bitmap** solves this. It is a 64-bit (or 128-bit) binary string where each bit represents a Data Element. 
If the 4th bit is a \`1\`, it means Data Element 4 (Amount) is present in the message. If the 5th bit is a \`0\`, Data Element 5 is skipped entirely. This allows the message to instantly shrink to exactly the size needed.

### 3. The Data Elements (DE)
The actual payload data appended in the exact order specified by the Bitmap.
- **DE 2:** Primary Account Number (PAN / The Credit Card Number)
- **DE 3:** Processing Code (e.g., 000000 = Purchase)
- **DE 4:** Amount (e.g., 000000005000 = $50.00)
- **DE 39:** Response Code (e.g., 00 = Approved, 51 = Insufficient Funds)

---

## 3. The Ecosystem & Data Flow

\`\`\`mermaid
sequenceDiagram
    participant POS_Terminal
    participant Payment_Gateway
    participant Visa_Mastercard
    participant Issuing_Bank

    POS_Terminal->>Payment_Gateway: TCP Socket: 0200 Request (ISO 8583)
    Payment_Gateway->>Visa_Mastercard: Routes based on BIN (First 6 digits)
    Visa_Mastercard->>Issuing_Bank: Forwards 0200 Request
    Note over Issuing_Bank: Bank checks Account Balance
    Issuing_Bank->>Visa_Mastercard: Responds: 0210 Response (DE39 = 00)
    Visa_Mastercard->>Payment_Gateway: Forwards 0210
    Payment_Gateway->>POS_Terminal: Forwards 0210
    Note over POS_Terminal: Terminal Prints Receipt!
\`\`\`

---

## 4. Engineering Challenges: Dialects and BCD

Writing a universal ISO 8583 parser is notoriously difficult.

### The "Dialect" Problem
ISO 8583 is a standard, but every bank implements it differently. 
Mastercard's implementation (Banknet) differs from Visa's implementation (Base I), which differs from standard ATM switches (Postilion or BASE24). A parser must support specific vendor dictionaries.

### BCD (Binary Coded Decimal) Compression
To save even more space, financial networks don't send the Amount as ASCII text. They use BCD.
In ASCII, the number "50" takes 2 bytes (Hex: \`35 30\`). In BCD, two decimal digits are compressed into a single byte by utilizing the 4-bit nibbles (Hex: \`50\`). A parser must aggressively unpack these hex streams at the bit level.

---

## 5. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Man-in-the-Middle** | ⚠️ Network Layer | ISO 8583 **does not** encrypt the payload. The credit card number (DE 2) is sent in plaintext! Security relies entirely on wrapping the TCP socket in TLS/SSL or physical leased lines. |
| **Card Cloning (Skimming)** | ✅ EMV Integration | Historically, magnetic stripe data was placed in DE 35. This was easily skimmed and cloned. Modern POS systems inject EMV Chip cryptograms into DE 55, making the transaction impossible to replay. |
| **Tampering** | ✅ MAC (Message Authentication Code) | Banks append a cryptographic MAC (usually in DE 64 or 128) generated using a shared Secret Key to prove the message wasn't altered in transit. |

---

## 6. Standards & References
- **ISO 8583-1:2003:** Financial transaction card originated messages — Interchange message specifications.
- **PCI DSS:** Payment Card Industry Data Security Standard (governing how DE 2 / PAN data must be masked when logged).

---

## 7. Interactive Quiz

**Beginner:**
1. Why doesn't the ATM just send a JSON file? *(Answer: Because ATMs originally communicated over incredibly slow, expensive dial-up connections. They required a hyper-compressed binary format where every bit counted).*
2. What does an MTI of 0210 mean? *(Answer: It is a response message, usually containing an approval or decline code).*

**Intermediate:**
3. How does the receiving server know which data fields are included in the message? *(Answer: It looks at the primary Bitmap. If bit 4 is set to 1, it knows it must extract Data Element 4).*

**Advanced:**
4. Why is BCD (Binary Coded Decimal) heavily used in ISO 8583? *(Answer: It compresses numeric data by 50%. It packs two decimal digits into a single 8-bit byte, significantly reducing network payload size).*

---

`,
  howTo: [
    "**Step 1:** Paste the raw Hexadecimal dump of the ISO 8583 message.",
    "**Step 2:** Select the specific Dialect/Vendor (e.g., Generic, Mastercard, BASE24) if known.",
    "**Step 3:** Click Parse.",
    "**Step 4:** The tool will decode the MTI, unpack the Bitmaps, and generate a human-readable JSON object mapping the raw hex values to their financial definitions (e.g., DE 4: Amount)."
  ],
  faq: [
    {
      question: "Is it safe to parse production transaction logs here?",
      answer: "While KaruviLab parses the payload 100% locally in your browser memory, PCI-DSS strictly forbids pasting real Credit Card numbers (PANs) into generic web browsers. Always mask DE 2 and DE 35 before pasting production logs."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [
    {
      error: "Bitmap parsing failed / Offset mismatch",
      fix: "The message is likely using a proprietary vendor dialect where a Data Element is defined as Variable-Length (LLVAR), but the parser expects Fixed-Length. Try switching the parsing dialect."
    }
  ],
  alternatives: ["EMV TLV Tree", "ISO8583 Bitmap Decoder"]
};
