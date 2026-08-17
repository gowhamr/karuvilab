export const ecdsaSign = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: ECDSA (Elliptic Curve Digital Signature Algorithm)

Welcome to the definitive engineering guide to ECDSA. This handbook explains the ultra-efficient digital signatures that power Bitcoin, Apple Pay, and the modern mobile internet.

---

## 1. Prerequisites: The Need for Efficiency

You already know that Digital Signatures (like **RSA**) prove who sent a message and that it wasn't tampered with. So why do we need **ECDSA**?

**The Problem:** RSA is old and relies on massive prime numbers. A secure RSA key today must be 3072 bits or 4096 bits long. When a smartphone establishes a secure HTTPS connection, performing exponentiation math on 4096-bit numbers drains the CPU and kills the battery. Furthermore, sending 4096-bit keys and signatures over slow mobile networks wastes bandwidth.

**The Solution:** ECDSA uses Elliptic Curve Cryptography. It provides the exact same level of security as a 3072-bit RSA key, but it uses only a **256-bit** key. The math is significantly faster, the keys are 90% smaller, and the signatures take up drastically less space.

---

## 2. The Cryptographic Ecosystem

\`\`\`mermaid
sequenceDiagram
    participant iPhone (Apple Pay)
    participant Hacker
    participant Bank_Server

    Note over iPhone,Bank_Server: Both support ECDSA P-256
    iPhone->>iPhone: Hash transaction data (SHA-256)
    iPhone->>iPhone: Generate Random Nonce (k)
    iPhone->>iPhone: Sign Hash using ECDSA Private Key + k
    iPhone->>Bank_Server: Transmit Transaction + ECDSA Signature (r, s)
    Hacker->>Hacker: Intercepts Signature, attempts to alter amount
    Hacker->>Bank_Server: Forwards altered data
    Bank_Server->>Bank_Server: Verifies Signature using iPhone's Public Key
    Note over Bank_Server: Mathematical verification fails!
    Bank_Server-->>Hacker: Transaction Denied
\`\`\`

---

## 3. Mathematical Foundations: How ECDSA Works

ECDSA signatures consist of two integers: **r** and **s**.

1. **The Hash:** The message is hashed (e.g., SHA-256) to create $e$.
2. **The Nonce ($k$):** The signer generates a cryptographically secure, random, temporary number $k$. **(This is the most critical and dangerous part of ECDSA)**.
3. **Calculate $r$:** The signer multiplies the generator point $G$ by $k$ to get a point on the curve $(x, y)$. The value $r = x \pmod n$.
4. **Calculate $s$:** The signer uses their Private Key ($d$), the hash ($e$), and the nonce ($k$) to calculate $s = k^{-1}(e + r \times d) \pmod n$.

The signature sent over the internet is simply the pair $(r, s)$.

---

## 4. Threat Model & The PlayStation 3 Catastrophe

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Signature Forgery** | ✅ Math | Without the Private Key ($d$), an attacker cannot calculate a valid $s$. |
| **Message Tampering** | ✅ Hashing | If the message changes, $e$ changes, and the verification equation fails. |
| **Nonce Reuse ($k$)** | 🚨 **FATAL** | If a developer accidentally uses the exact same random number $k$ to sign two different messages, an attacker can use high school algebra to instantly calculate the Private Key ($d$). |

### The Sony PlayStation 3 Hack (2010)
Sony required all PS3 games to be signed with their ECDSA Private Key. The console verified the $(r, s)$ signature using Sony's Public Key. However, Sony's engineers made a fatal error: their random number generator for the nonce $k$ was broken. They used the exact same $k$ for every signature. Hackers noticed that $r$ was identical across multiple games, solved the algebraic equation, extracted Sony's master Private Key, and published it online. This allowed anyone to sign pirated games, permanently compromising the console's security.

---

## 5. Browser Internals & Web Crypto API

When you sign a message with KaruviLab's ECDSA tool:
1. **Entropy:** The browser's C++ engine generates the highly sensitive, cryptographically secure nonce $k$ using OS-level entropy (\`/dev/urandom\`). You don't have to manage this manually.
2. **Execution:** \`crypto.subtle.sign({name: 'ECDSA', hash: {name: 'SHA-256'}}, privateKey, data)\` is called.
3. **Formatting:** The API returns an ArrayBuffer containing the raw $(r, s)$ coordinates. (Note: Some systems require converting this raw output into an ASN.1 DER format, which is why Web Crypto ECDSA signatures occasionally look different than OpenSSL signatures).

---

## 6. Production Workflows

Where is ECDSA replacing RSA today?
- **Bitcoin & Web3:** Every Bitcoin wallet address is derived from an ECDSA Public Key (specifically using the \`secp256k1\` curve). Every transaction is authorized by an ECDSA signature.
- **FIDO2 / WebAuthn:** When you log into a website using a Passkey, TouchID, or a YubiKey, your hardware authenticates you to the server using an ECDSA signature instead of a password.
- **Modern TLS:** Most top-tier websites (like Google and Cloudflare) now use ECDSA certificates instead of RSA to dramatically speed up the HTTPS handshake for mobile devices.

---

## 7. Comparisons: ECDSA vs Ed25519

While ECDSA is the current industry standard, a newer algorithm called **Ed25519** (EdDSA) is rapidly replacing it.
- **Why?** Ed25519 completely removes the dangerous requirement for the random nonce $k$. It calculates $k$ deterministically from the message and the private key. This mathematically prevents the Sony PlayStation 3 catastrophe from ever happening again. Furthermore, Ed25519 is completely immune to side-channel timing attacks by design.

---

## 8. Standards & References
- **FIPS 186-4:** Digital Signature Standard (DSS) by NIST
- **RFC 6979:** Deterministic Usage of the Digital Signature Algorithm (DSA) and Elliptic Curve Digital Signature Algorithm (ECDSA) — *A standard created specifically to fix the dangerous random $k$ issue.*

---

## 9. Interactive Quiz

**Beginner:**
1. Why is ECDSA increasingly preferred over RSA? *(Answer: It provides the same security with vastly smaller keys, saving bandwidth and mobile CPU power).*
2. Can ECDSA be used to encrypt a file? *(Answer: No. It is strictly a Digital Signature algorithm used for authentication and integrity).*

**Intermediate:**
3. What happens if a developer reuses the random nonce $k$ when generating two different signatures? *(Answer: The mathematical security collapses, allowing anyone to instantly calculate the master Private Key using basic algebra).*

**Advanced:**
4. How does Ed25519 solve the biggest security flaw of ECDSA? *(Answer: It generates the nonce $k$ deterministically rather than relying on a random number generator that might be flawed or biased).*

---

`,
    howTo: [
        "**Step 1:** Generate or paste an ECDSA Private Key.",
        "**Step 2:** Provide the message or data you wish to sign.",
        "**Step 3:** Select a hashing algorithm (SHA-256 is recommended for P-256 curves).",
        "**Step 4:** Click Sign. The tool will generate the cryptographic signature (the r and s values combined) in Hex format.",
        "**Step 5:** Anyone with your Public Key can verify this signature to guarantee you wrote the message."
    ],
    faq: [
        {
            question: "Is this tool vulnerable to the PlayStation 3 hack?",
            answer: "No. The underlying Web Crypto API in modern browsers uses highly secure, OS-level entropy to generate a unique nonce for every single signature."
        },
        {
            question: "Why does the signature change even if I sign the exact same message?",
            answer: "Because a unique random nonce (k) is injected into the math every single time you click Sign. This randomness is a core security requirement of ECDSA."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["RSA Sign / Verify", "ECDH Key Exchange"]
};
