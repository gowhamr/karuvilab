export const pemViewer = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: PEM (Privacy-Enhanced Mail) Viewer

Welcome to the engineering guide on PEM formatting. This handbook demystifies the confusing text blocks that power internet security configurations.

---

## 1. Prerequisites: What is PEM?

If you have ever configured an SSL server, set up an SSH key, or generated a CSR, you have dealt with a block of text that looks like this:
\`\`\`text
-----BEGIN PRIVATE KEY----- <!-- gitleaks:allow -->
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQ...
-----END PRIVATE KEY-----
\`\`\`
This format is called **PEM** (Privacy-Enhanced Mail). 

### Why does it exist?
Cryptographic keys and certificates are fundamentally raw, unreadable binary data (usually ASN.1 DER formatted bytes). In the early days of the internet, systems tried to email these binary keys to each other. However, older email servers (SMTP) were designed strictly for ASCII text. When they encountered raw binary bytes, they would corrupt the data, breaking the keys.

**The Solution:** The cryptographic binary data is encoded into **Base64** (which uses only safe A-Z, 0-9 characters) and wrapped with highly specific \`-----BEGIN...\` and \`-----END...\` header lines so automated parsers know exactly what type of data is inside.

---

## 2. Core Concepts: Identifying PEM Types

A PEM file can hold many different cryptographic objects. The header tells you (and the computer) exactly what parser to use.

| Header | Meaning | Internal Standard |
|--------|---------|-------------------|
| \`BEGIN CERTIFICATE\` | A public X.509 Certificate | RFC 5280 |
| \`BEGIN CERTIFICATE REQUEST\` | A CSR (Certificate Signing Request) | PKCS#10 |
| \`BEGIN PRIVATE KEY\` | An unencrypted Private Key (modern) | PKCS#8 |
| \`BEGIN RSA PRIVATE KEY\` | A legacy, RSA-specific Private Key | PKCS#1 |
| \`BEGIN ENCRYPTED PRIVATE KEY\` | A Private Key protected by a password | PKCS#8 |
| \`BEGIN PUBLIC KEY\` | A standalone Public Key | X.509 SPKI |

---

## 3. Architecture & Data Flow

\`\`\`mermaid
graph LR
    A[Raw Cryptographic Math] -->|Serialized| B[ASN.1 Binary Bytes]
    B -->|Formatted| C[DER Format File]
    C -->|Base64 Encoded| D[Base64 String]
    D -->|Wrapped in Headers| E[PEM Format Text]
    E -->|Safe to Transmit via| F[Email / API / Copy-Paste]
\`\`\`

---

## 4. Troubleshooting & Production Workflows

### Scenario A: The "Invalid Key Format" AWS Error
A DevOps engineer generates a key pair using \`ssh-keygen\` and tries to upload it to AWS EC2 or an old Java application. The server rejects it with "Invalid Key Format".
**The Fix:** \`ssh-keygen\` often generates keys in a proprietary OpenSSH format (\`-----BEGIN OPENSSH PRIVATE KEY-----\` <!-- gitleaks:allow -->). The engineer must convert it to a standard PKCS#8 PEM format (\`-----BEGIN PRIVATE KEY-----\`) using OpenSSL before the older server will accept it.

### Scenario B: NGINX Certificate Chains
When configuring HTTPS on NGINX, you are required to provide a \`.crt\` or \`.pem\` file. Often, administrators only paste their Leaf Certificate. The browser throws a trust error. 
**The Fix:** PEM format allows you to concatenate multiple blocks in a single file. The administrator must paste the Leaf Certificate, followed immediately by the Intermediate CA's PEM block, creating a "Certificate Bundle".

---

## 5. Security Considerations

- **Visual Deception:** Just because a file ends in \`.pem\` or \`.crt\` does not guarantee it is a certificate. Extensions don't matter in cryptography; the internal \`BEGIN\` header dictates the true format.
- **Accidental Exposure:** Developers often accidentally commit \`PRIVATE KEY\` PEM blocks into public GitHub repositories because they look like unreadable garbage text. Automated bots scan GitHub 24/7 for the string \`-----BEGIN PRIVATE KEY-----\` and instantly steal exposed AWS and database credentials.

---

## 6. Standards & References
- **RFC 7468:** Textual Encodings of PKIX, PKCS, and CMS Structures
- **RFC 1421:** The original 1993 standard for Privacy Enhancement for Internet Electronic Mail (where the name PEM comes from).

---

## 7. Interactive Quiz

**Beginner:**
1. What does PEM stand for? *(Answer: Privacy-Enhanced Mail).*
2. Is a PEM file encrypted? *(Answer: Generally no. Base64 is just encoding, not encryption. Anyone can decode it. The exception is if the header explicitly says ENCRYPTED PRIVATE KEY).*

**Advanced:**
3. What is the difference between PKCS#1 and PKCS#8 private keys? *(Answer: PKCS#1 headers like \`BEGIN RSA PRIVATE KEY\` are specific to the RSA algorithm. PKCS#8 \`BEGIN PRIVATE KEY\` is a modern universal container that can hold RSA, ECC, or Ed25519 keys).*

---

`,
    howTo: [
        "**Step 1:** Paste your PEM string (including headers) into the input box.",
        "**Step 2:** The tool instantly strips the headers and Base64-decodes the payload.",
        "**Step 3:** The tool attempts to parse the underlying ASN.1 structure to tell you exactly what cryptographic object is inside."
    ],
    faq: [
        {
            question: "Is this tool safe for Private Keys?",
            answer: "Yes. Parsing happens 100% locally in your browser memory via JavaScript. However, as a best practice, never paste production private keys into any website."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [
        {
            error: "Unable to parse Base64",
            fix: "Ensure that you have not accidentally copied extra whitespace or carriage returns inside the Base64 block."
        }
    ],
    alternatives: ["X.509 Certificate Viewer", "CSR Generator"]
};
