export const ecdhKeyExchange = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: ECDH (Elliptic Curve Diffie-Hellman)

Welcome to the definitive engineering guide to ECDH Key Exchange. This handbook explains the cryptographic magic that allows two people who have never met to agree on a secret password over a wiretapped internet connection.

---

## 1. Prerequisites: The Key Distribution Problem

In symmetric encryption (like AES), Alice and Bob need to share a secret password to encrypt their messages. But if Alice emails the password to Bob, a hacker listening to the network can steal it. How do Alice and Bob agree on a secret key if every communication channel is being monitored?

### The Paint Mixing Analogy
1. Alice and Bob publicly agree on a starting color: **Yellow**.
2. Alice secretly picks her own private color (**Red**) and mixes it. She gets **Orange**.
3. Bob secretly picks his own private color (**Blue**) and mixes it. He gets **Green**.
4. Alice sends her **Orange** mixture to Bob. Bob sends his **Green** mixture to Alice.
5. (The Hacker now has Yellow, Orange, and Green, but separating mixed paint is physically impossible, so the hacker cannot figure out the secret Red or Blue).
6. Alice adds her secret **Red** to Bob's Green mixture. She gets **Brown**.
7. Bob adds his secret **Blue** to Alice's Orange mixture. He gets **Brown**.
8. Alice and Bob now both share the exact same secret **Brown** color, without ever having sent it across the internet!

In cryptography, the "paint mixing" is the Elliptic Curve math. The "colors" are Private and Public Keys. The final "Brown" is the AES Secret Key.

---

## 2. The Ecosystem: How ECDH Fits In

ECDH is not used for encryption or signing. Its *only* purpose is to securely negotiate an AES key.

\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Hacker
    participant Bob

    Note over Alice,Bob: Both agree to use Elliptic Curve P-256
    Alice->>Alice: Generate Private Key A + Public Key A
    Bob->>Bob: Generate Private Key B + Public Key B
    Alice->>Bob: Sends Public Key A (Plaintext)
    Bob->>Alice: Sends Public Key B (Plaintext)
    Note over Hacker: Hacker sees both Public Keys, but cannot derive Private Keys
    Alice->>Alice: Math(Private A + Public B) = Shared Secret
    Bob->>Bob: Math(Private B + Public A) = Shared Secret
    Note over Alice,Bob: Both now have the exact same 256-bit Shared Secret!
    Alice->>Bob: Encrypted AES Message using Shared Secret
\`\`\`

---

## 3. Mathematical Foundations: The Elliptic Curve

The Diffie-Hellman protocol was originally invented using massive prime numbers (like RSA). Modern systems use **Elliptic Curve Cryptography (ECC)** because it provides the same security with vastly smaller keys and faster math.

An Elliptic Curve looks like $y^2 = x^3 + ax + b$. 
1. The shared starting point on the curve is the **Generator Point (G)**.
2. A Private Key ($d$) is just a massive random integer.
3. The Public Key ($Q$) is calculated by "adding" point G to itself $d$ times: $Q = d \\times G$.
4. **The Discrete Logarithm Problem:** If an attacker knows G and Q, there is no known mathematical shortcut to figure out how many times ($d$) it was multiplied.

**The Key Exchange Math:**
- Alice calculates: $Shared = d_{Alice} \\times Q_{Bob}$
- Bob calculates: $Shared = d_{Bob} \\times Q_{Alice}$
- Because multiplication is commutative, both calculations land on the exact same point on the elliptic curve!

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Passive Eavesdropping** | ✅ ECDH Math | A hacker recording all internet traffic cannot calculate the Shared Secret from the Public Keys. |
| **Man-in-the-Middle (MitM)**| ❌ No | ECDH alone does not prove *who* you are talking to. A hacker could intercept Alice's key, send his own to Bob, and negotiate two separate secrets. **Mitigation:** ECDH is always combined with Digital Signatures (like RSA or ECDSA) to authenticate the keys during the TLS handshake. |
| **Quantum Computing** | ❌ No | Shor's Algorithm will easily solve the Elliptic Curve Discrete Logarithm Problem. |

### Perfect Forward Secrecy (PFS / ECDHE)
In older systems, servers used a single static RSA key to encrypt years of traffic. If the FBI seized the server in 2024 and extracted the Private Key, they could decrypt all recorded traffic from 2020.
Modern internet uses **ECDHE** (Ephemeral ECDH). The server generates a brand new, temporary ECDH key pair for *every single connection* and deletes it immediately after. If a hacker steals the server in 2024, the old traffic remains permanently encrypted.

---

## 5. Browser Internals & Implementation

When you use KaruviLab's ECDH tool:
1. We use \`crypto.subtle.generateKey({name: 'ECDH', namedCurve: 'P-256'})\` for both Alice and Bob.
2. We extract the raw Public Keys.
3. For Alice, we call \`crypto.subtle.deriveBits({name: 'ECDH', public: bobPublicKey}, alicePrivateKey, 256)\`.
4. We do the reverse for Bob.
5. The browser's C++ engine performs the curve multiplication and returns the exact same 256 bits for both.

---

## 6. Production Workflows

- **TLS 1.3 (HTTPS):** When you load this website, your browser and our server instantly executed an ECDHE exchange to negotiate the AES-GCM key that is encrypting this text.
- **WhatsApp / Signal:** End-to-End Encryption (E2EE) uses complex "Double Ratchet" variations of ECDH to constantly rotate shared secrets between your phone and your friend's phone, ensuring even WhatsApp servers cannot read the messages.

---

## 7. Standards & References
- **NIST SP 800-56A:** Recommendation for Pair-Wise Key-Establishment Schemes
- **RFC 5903:** Elliptic Curve Groups modulo a Prime

---

## 8. Interactive Quiz

**Beginner:**
1. Does ECDH encrypt your files? *(Answer: No. It only negotiates a shared secret. You use that secret in AES to actually encrypt the file).*
2. Do you send your Private Key to the other person? *(Answer: Never. You only send your Public Key).*

**Intermediate:**
3. Why is Elliptic Curve (ECDH) preferred over older Prime-Number (DH) key exchange? *(Answer: It requires significantly smaller keys (256-bit vs 3072-bit) to achieve the same security, saving CPU cycles and mobile battery life).*

**Advanced:**
4. What does the 'E' in ECDHE stand for, and why is it critical for modern security? *(Answer: Ephemeral. It means a new, temporary key is generated for every single session, ensuring Perfect Forward Secrecy. If a long-term master key is compromised, past traffic remains secure).*

---

`,
    howTo: [
        "**Step 1:** Select an Elliptic Curve (P-256, P-384, or P-521). P-256 is the standard for modern web apps.",
        "**Step 2:** Click 'Generate Alice's Keys' and 'Generate Bob's Keys'. Notice that they each possess different Public and Private keys.",
        "**Step 3:** Click 'Perform Exchange'. The system will simulate Alice combining her Private Key with Bob's Public Key, and vice versa.",
        "**Step 4:** Observe the resulting Shared Secret. Despite different mathematical inputs, the derived 256-bit Hex string is identical for both parties."
    ],
    faq: [
        {
            question: "Why can't a hacker derive the secret if they have both public keys?",
            answer: "This is protected by the Elliptic Curve Discrete Logarithm Problem. While multiplying points on the curve is computationally easy, reversing the process to find the original private scalar is practically impossible for modern computers."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["RSA Key Generator", "AES Encrypt / Decrypt"]
};
