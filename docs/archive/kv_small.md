# ⚡ KaruviLab (KV) — Complete Architecture, Technology & Security Ecosystem

> **Document Version:** 3.3.0  
> **Last Updated:** 2026-07-05  
> **Platform Vision:** The world's fastest, most private, browser-native productivity platform.

---

## 1. Project Philosophy & Non-Negotiable Pillars

- **Zero-Server-Upload:** All computation and processing occur 100% locally on the user's browser. Files, keys, and sensitive inputs never leave the device.
- **Privacy-First:** No telemetry, tracking, cloud storage, or external analytics beacons.
- **Local-First Execution:** Compute happens using Web Workers, WebAssembly (WASM), Web Crypto API, and Web Audio/Canvas APIs.
- **Offline Resilience:** Fully functional without an internet connection via Service Workers and IndexedDB persistence.
- **Enterprise UX:** Raycast/Linear-tier ergonomics — keyboard-first navigation, hardware-accelerated animations, zero main-thread jank.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Core Framework** | Next.js | `16.2+` | App Router, SSR/SSG metadata, strict Client/Server separation |
| **UI Library** | React | `19.0.6` | Concurrent Mode, Server Components, `useCallback`/`useMemo` optimization |
| **Language** | TypeScript | `strict` | Fully typed system; zero unjustified `any` types |
| **Styling** | Tailwind CSS | `v4.2.4` | JIT compiler, container queries, custom design tokens |
| **State Management**| Zustand | `5.0+` | Atomic reactive stores, IndexedDB persistence via `idb` |
| **Worker Concurrency**| Comlink | `4.4` | RPC-style Web Worker thread orchestration |
| **Animations** | Framer Motion | `12.38+` | Hardware-accelerated UI spring animations (`transform`, `opacity`) |
| **XSS Protection** | DOMPurify | `3.1+` | HTML/Markdown sanitization prior to DOM injection |
| **Cryptography** | Web Crypto API | `native` | Hardware-accelerated RSA, AES, ECDSA, ECDH, PBKDF2, HKDF, HMAC |
| **Document Processing**| pdf-lib | `1.17+` | Client-side PDF manipulation and assembly |

---

## 3. Architecture & Security Directory Structure

```
/
├── app/(tools)/security-tools/
│   ├── aes-encrypt-decrypt/         # AES-256-GCM / CBC Text & Key Encryptor
│   ├── base64url-converter/         # RFC 4648 Base64URL Converter
│   ├── cipher-tools/                # Caesar, Vigenère, ROT13, XOR
│   ├── csp-builder/                 # Content Security Policy Header Generator
│   ├── csr-generator/               # PKCS#10 CSR & Private Key Generator
│   ├── directory-manifest/          # Batch Directory Hash Manifest Generator
│   ├── ecdh-key-exchange/           # Elliptic Curve Diffie-Hellman Exchange Demo
│   ├── ecdsa-sign/                  # ECDSA Digital Signature & Verification
│   ├── hash-generator/              # MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
│   ├── hkdf-generator/              # HKDF (RFC 5869) Key Derivation
│   ├── hmac-generator/              # HMAC Generator (SHA-256/512)
│   ├── html-entities/               # HTML Entity Encoder/Decoder
│   ├── jwt-decoder/                 # JWT Header, Claims & Signature Inspector
│   ├── oauth-token-decoder/         # OAuth 2.0 Access/OIDC Token Decoder
│   ├── password-generator/          # Cryptographic Random Password Generator
│   ├── pbkdf2-generator/            # PBKDF2 Key Derivation Function
│   ├── pem-viewer/                  # PEM Block & ASN.1 Structural Inspector
│   ├── private-key-checker/         # PKCS#8 & PKCS#1 Private Key Validator
│   ├── public-key-inspector/        # SPKI Public Key Inspector & Fingerprint
│   ├── rsa-encrypt-decrypt/         # RSA-OAEP Public/Private Key Encryptor
│   ├── rsa-key-generator/           # RSA Keypair Generator (1024-4096 bit)
│   ├── rsa-sign-verify/             # RSASSA-PKCS1-v1_5 Digital Signatures
│   ├── saml-decoder/                # SAML2 Request & Assertion XML Decoder
│   └── x509-viewer/                 # SSL/TLS X.509 Certificate Inspector
├── src/
│   ├── lib/security/
│   │   ├── asn1.ts                  # ASN.1 DER Parser, X.509 & PEM engine
│   │   └── tokens.ts                # JWT, SAML, OAuth & Base64URL engine
│   └── workers/
│       └── crypto.worker.ts         # Comlink Crypto Worker API
```

---

## 4. Complete Security Tools Inventory (24 Tools)

### 🔒 Cryptographic Hashing
- **Hash Generator** (`hash-generator`): MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512 text and file digests.
- **HMAC Generator** (`hmac-generator`): Hash-based Message Authentication Codes with custom keys.
- **Directory Hash Manifest** (`directory-manifest`): Compute file hashes across entire folders and output JSON/CSV/sha256sum manifests.

### 🔑 Encryption & Key Derivation
- **AES Encrypt / Decrypt** (`aes-encrypt-decrypt`): AES-256-GCM and AES-256-CBC text encryption with PBKDF2 key derivation.
- **RSA Key Generator** (`rsa-key-generator`): Generate RSA 1024, 2048, 3072, 4096-bit keypairs in PKCS#8/SPKI PEM format.
- **RSA Encrypt / Decrypt** (`rsa-encrypt-decrypt`): RSA-OAEP public-key encryption and private-key decryption.
- **RSA Sign / Verify** (`rsa-sign-verify`): RSASSA-PKCS1-v1_5 digital signatures and verification.
- **ECDSA Sign & Verify** (`ecdsa-sign`): NIST P-256, P-384, P-521 Elliptic Curve digital signatures.
- **ECDH Key Exchange** (`ecdh-key-exchange`): Interactive simulation of Elliptic Curve Diffie-Hellman secret derivation.
- **PBKDF2 Generator** (`pbkdf2-generator`): Password-Based Key Derivation Function 2 with custom salt and iterations.
- **HKDF Generator** (`hkdf-generator`): HMAC-based Extract-and-Expand Key Derivation Function (RFC 5869).

### 📜 Certificates & Key Inspection
- **PEM Viewer & Inspector** (`pem-viewer`): Analyze PEM blocks, hex dump DER bytes, and view ASN.1 trees.
- **CSR Generator & Inspector** (`csr-generator`): Generate PKCS#10 Certificate Signing Requests and matching private keys.
- **X.509 Certificate Viewer** (`x509-viewer`): Inspect SSL/TLS certificates, Subject, Issuer, Validity, Extensions, and Fingerprints.
- **Public Key Inspector** (`public-key-inspector`): Inspect SPKI public key parameters and SHA-256 fingerprints.
- **Private Key Checker** (`private-key-checker`): Validate PKCS#8 and PKCS#1 private key structures 100% locally.

### 🎟️ Tokens & Identity Encodings
- **JWT Decoder & Inspector** (`jwt-decoder`): Decode JWT headers/claims and verify HMAC/RSA/ECDSA signatures.
- **OAuth 2.0 Token Decoder** (`oauth-token-decoder`): Inspect OAuth access tokens, OIDC tokens, scopes, and expiration dates.
- **SAML Decoder** (`saml-decoder`): Decode SAML Requests and Assertions into pretty-printed XML with attribute extraction.
- **Base64URL Converter** (`base64url-converter`): RFC 4648 Base64URL encoder and decoder.

### 🛡️ Web & Classic Security
- **CSP Builder** (`csp-builder`): Content Security Policy header generator and evaluator.
- **Text Cipher Tools** (`cipher-tools`): Caesar, Vigenère, ROT13, XOR, and Morse code ciphers.
- **HTML Entities** (`html-entities`): HTML entity escaping and unescaping.
- **Password Generator** (`password-generator`): Cryptographically secure random password generator.
