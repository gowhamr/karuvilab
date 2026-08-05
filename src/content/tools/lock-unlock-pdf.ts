import { ToolContent } from '../../registry/types';

export const lockUnlockPdf: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Encryption & Permissions

Welcome to the engineering guide to PDF Security. This handbook debunks one of the most common misunderstandings in the corporate world: the difference between actually encrypting a document and simply asking software to politely restrict editing.

---

## 1. Prerequisites: The Two Types of PDF Passwords

The PDF specification (ISO 32000-1) defines two completely different password mechanisms. Understanding the difference is critical to securing your data.

### 1. The User Password (Document Open Password)
This is true cryptographic security. If you set a User Password, the PDF viewing software uses that password to derive an **AES** encryption key and mathematically scrambles the entire binary structure of the document.
- **Security Level:** Extremely high (if using AES-256).
- **Protection:** Even if a hacker steals the file, they cannot read the text, view the images, or parse the metadata without the password.

### 2. The Owner Password (Permissions Password)
This restricts what the user can *do* once the file is open (e.g., "Cannot Print", "Cannot Copy Text", "Cannot Edit"). 
- **Security Level:** Essentially Zero.
- **The Flaw:** The Owner Password does **not** encrypt the text. It simply sets a digital flag inside the PDF saying \`canPrint: false\`. When you open the file in Adobe Acrobat, Adobe politely obeys the flag and grays out the Print button. However, a hacker can easily open the PDF using an open-source script, ignore the flag entirely, print the document, and permanently remove the restrictions. **Owner Passwords rely purely on the honor system of the PDF viewing software.**

---

## 2. The Cryptographic Ecosystem

\`\`\`mermaid
graph TD
    A[Unprotected PDF] --> B{Apply Security}
    B -->|User Password| C[AES-256 Encryption]
    C --> D[File mathematically scrambled]
    D --> E[100% Secure against reading]
    B -->|Owner Password| F[Permissions Dictionary]
    F --> G[File remains in readable Plaintext]
    G --> H[Relies on Software 'Honor System' to restrict printing]
\`\`\`

---

## 3. Mathematical Foundations: Encryption Algorithms

Historically, PDFs used weak encryption. Modern editors must force the highest standard.

| Algorithm | Status | Why? |
|-----------|--------|------|
| **40-bit RC4** | 🚨 Broken | The original PDF 1.4 security. Can be brute-forced on a modern laptop in milliseconds. |
| **128-bit RC4** | 🚨 Weak | Deprecated. Vulnerable to advanced cryptanalysis. |
| **128-bit AES** | ⚠️ Acceptable | Standardized in PDF 1.6 (2004). |
| **256-bit AES (R6)** | ✅ Standard | Introduced in PDF 1.7 Extension 3. The current military-grade standard. KaruviLab highly recommends using this format. |

---

## 4. Threat Model & Password Cracking

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Data Exfiltration** | ✅ User Password (AES-256) | The file contents are mathematically unreadable without the password. |
| **Copy/Paste Prevention** | ❌ Owner Password | As explained, stripping an Owner Password takes milliseconds using tools like \`qpdf\` or KaruviLab's Unlock tool because the file isn't actually encrypted. |
| **Brute Force Attacks** | ⚠️ Password Entropy | If you lock your PDF with the User Password "1234", a hacker using a GPU cluster and Hashcat will crack it in less than a second. AES-256 is useless if the human password is weak. |

---

## 5. Browser Internals: Unlocking a PDF

How does KaruviLab unlock a PDF locally in your browser?

1. **User Password Locked:** The \`pdf-lib\` engine prompts you for the password. It runs the password through the PDF's Key Derivation Function (KDF) to generate the AES key, then decrypts the underlying binary streams in your RAM.
2. **Owner Password Locked:** If you just want to remove printing restrictions, the engine doesn't even need the Owner Password! Because the document is already decrypted to be viewed, the engine simply parses the PDF tree, deletes the \`/Encrypt\` dictionary object, and saves a brand new PDF. The restrictions are instantly gone.

---

## 6. Production Workflows

- **HR & Payroll:** Companies email payslips to employees as PDFs. To comply with GDPR/HIPAA, they programmatically lock the PDF using a User Password (usually the employee's Date of Birth + SSN).
- **Self-Publishing:** Authors selling e-books often apply an Owner Password to prevent text copying. While technical users bypass this easily, it successfully prevents 99% of non-technical users from pirating the text.

---

## 7. Standards & References
- **ISO 32000-2 (PDF 2.0):** Strictly deprecates all RC4 encryption and mandates AES-256 for all compliant PDF processors.

---

## 8. Interactive Quiz

**Beginner:**
1. Does restricting "Printing" actually encrypt the PDF? *(Answer: No. It just sets a polite flag that software is supposed to follow).*
2. What happens if I lose my User Password? *(Answer: The PDF is permanently inaccessible. Even KaruviLab cannot recover mathematically encrypted AES-256 data).*

**Intermediate:**
3. Why is it instantly easy to remove an "Owner Password" but impossible to remove a "User Password"? *(Answer: Because the Owner Password doesn't encrypt the file's contents, whereas the User Password mathematically scrambles the bytes).*

**Advanced:**
4. Why did the PDF committee completely deprecate RC4 in PDF 2.0? *(Answer: RC4 is a stream cipher that was proven severely vulnerable to multiple statistical biases and keystream recovery attacks (the same attacks that killed WEP Wi-Fi security)).*

---

`,
  howTo: [
    "**To Lock a PDF:**",
    "1. Select a PDF from your device.",
    "2. Enter a strong User Password to encrypt the document.",
    "3. (Optional) Enter an Owner Password to restrict printing and editing.",
    "4. Click 'Lock PDF' to generate the AES-encrypted file.",
    "",
    "**To Unlock a PDF:**",
    "1. Select a locked PDF.",
    "2. If it is encrypted with a User Password, you must provide it to decrypt the file.",
    "3. Click 'Unlock PDF'. The tool will instantly strip all restrictions and save an unprotected copy."
  ],
  faq: [
    {
      question: "Can this tool crack a forgotten password?",
      answer: "No. If a PDF is protected with a modern User Password (AES), it is mathematically impossible to open it without the correct password. We do not provide brute-forcing services."
    },
    {
      question: "Are my passwords safe?",
      answer: "Yes. KaruviLab handles the encryption and decryption strictly in your local browser's memory. Your passwords are never transmitted."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Watermark PDF", "PDF Editor"]
};
