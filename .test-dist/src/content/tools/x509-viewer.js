export const x509Viewer = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: X.509 Certificate Viewer

Welcome to the definitive engineering guide to Digital Certificates. This handbook explains the backbone of internet trust: how your browser knows a website is legitimately who it claims to be.

---

## 1. Prerequisites: The Trust Problem

If you visit \`bank.com\`, they send you their Public Key so you can encrypt your password. But what if a hacker intercepts your connection and sends you *their* Public Key instead? Your browser would happily encrypt your password and hand it directly to the hacker.

**The Solution:** \`bank.com\` doesn't just send a Public Key; they send an **X.509 Certificate**. A certificate is a digitally signed document from a trusted "Certificate Authority" (CA) that mathematically guarantees: *"We, the CA, have verified that this Public Key belongs to bank.com."*

---

## 2. The PKI Ecosystem & Trust Chains

Certificates do not stand alone; they form a **Chain of Trust**.

\`\`\`mermaid
graph TD
    A[Root CA Certificate<br/>Built into Windows/macOS/Browser] -->|Signs| B[Intermediate CA Certificate]
    B -->|Signs| C[Leaf Certificate<br/>Your Website]
    C -->|Presents to| D[User's Web Browser]
    Note over A,C: If the signature chain validates back to the Root,<br/>the browser displays the Green Padlock.
\`\`\`

---

## 3. Core Concepts: The Anatomy of X.509

When you paste a certificate into the KaruviLab X.509 Viewer, you are decoding an **ASN.1** structured binary file. 

Every valid X.509v3 certificate contains:
1. **Version:** Usually Version 3 (which introduced extensions).
2. **Serial Number:** A unique ID assigned by the CA.
3. **Signature Algorithm:** The math used by the CA to sign it (e.g., \`sha256WithRSAEncryption\`).
4. **Issuer:** The CA who signed it (e.g., "Let's Encrypt Authority X3").
5. **Validity:** The \`Not Before\` and \`Not After\` timestamps.
6. **Subject:** The owner (e.g., "www.github.com").
7. **Subject Public Key Info:** The actual Public Key of the website.
8. **Extensions (v3):** 
   - **SAN (Subject Alternative Name):** Other domains valid for this cert.
   - **Key Usage:** What the key is allowed to do (e.g., Digital Signature, Key Encipherment).
   - **Basic Constraints:** Is this certificate allowed to act as a CA and sign other certificates? (Should be FALSE for websites).

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Man-in-the-Middle** | ✅ X.509 + TLS | A hacker cannot forge a valid certificate for your domain because they don't have the Root CA's private key. |
| **Compromised CA** | ⚠️ Certificate Transparency (CT) | If a CA goes rogue (like DigiNotar in 2011) and issues fake certificates for Google, browsers now use CT Logs to instantly detect and distrust the rogue certificates. |
| **Stolen Server Key** | ⚠️ Revocation | If a hacker steals a server's private key, the admin must revoke the certificate. Browsers use OCSP (Online Certificate Status Protocol) or CRLs (Certificate Revocation Lists) to check if a certificate was revoked before it expired. |

---

## 5. Browser Internals & ASN.1 Parsing

Why do certificates look like \`-----BEGIN CERTIFICATE-----\`?
X.509 data is structured using **ASN.1** (Abstract Syntax Notation One), a complex telecommunications format from the 1980s. Because ASN.1 is raw binary (DER format), transmitting it over email or text-based protocols used to corrupt it. Therefore, the binary is Base64 encoded and wrapped in headers (PEM format).

Our viewer uses JavaScript ASN.1 parsers to map the binary bytes back into human-readable JSON objects entirely in your browser memory.

---

## 6. Production Workflows

### Scenario: Fixing "Your Connection is Not Private"
A DevOps engineer deploys a new web server, but users see a massive red warning in Chrome. The engineer uses an X.509 Viewer to debug:
1. Did the certificate expire? (Check Validity dates).
2. Is the domain listed? (Check Subject Alternative Names).
3. Is it self-signed? (Check if Subject == Issuer).
4. Is the intermediate chain missing? (The server isn't sending the Intermediate CA cert along with the Leaf cert).

---

## 7. Standards & References
- **RFC 5280:** X.509 Public Key Infrastructure Certificate and CRL Profile.
- **ITU-T X.509:** The original international telecommunication standard.

---

## 8. Interactive Quiz

**Beginner:**
1. What does an X.509 Certificate do? *(Answer: It binds a cryptographic Public Key to a specific identity, like a domain name).*
2. What does it mean if a certificate is "Self-Signed"? *(Answer: The Subject and the Issuer are the same entity. Browsers will show a security warning because it is not trusted by a Root CA).*

**Intermediate:**
3. Why are Subject Alternative Names (SANs) important? *(Answer: Previously, certificates only used the Common Name to verify the domain. Browsers now require SAN extensions to support securing multiple subdomains on a single certificate).*

**Advanced:**
4. What happens if the \`Basic Constraints: CA\` flag is set to TRUE on a website's certificate? *(Answer: It means the certificate has authority to issue other trusted certificates. CAs strictly forbid this for standard leaf certificates to prevent users from becoming rogue CAs).*

---

`,
    howTo: [
        "**Step 1:** Open your certificate file (.pem, .crt, .cer) in a text editor.",
        "**Step 2:** Copy the contents, including the BEGIN and END lines.",
        "**Step 3:** Paste the text into the Viewer input field.",
        "**Step 4:** The tool will decode the ASN.1 structure and display all critical metadata."
    ],
    faq: [
        {
            question: "Is this tool secure?",
            answer: "Yes. Certificates are public documents by definition. However, parsing happens entirely locally in your browser, so nothing is ever logged to a server."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [
        {
            error: "Invalid ASN.1 Data",
            fix: "Ensure you are pasting the Certificate and not the Private Key or a CSR. Check that the PEM headers are fully intact."
        }
    ],
    alternatives: ["PEM Viewer", "CSR Generator"]
};
