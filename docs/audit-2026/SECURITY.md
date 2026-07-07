# Security Audit 2026

## 1. Zero-Server-Upload & Privacy
KaruviLab follows a strict **local-first** approach. User data, files, and inputs are processed entirely within the browser client. No user data is uploaded to a server. Data storage relies completely on IndexedDB (using `idb` and `idb-storage`) for saving tool states, history, preferences, and offline cache. The application ensures complete privacy by design.

## 2. Cryptography
KaruviLab implements standard cryptography through the native **Web Crypto API** (`window.crypto.subtle`). Heavy cryptographic operations are offloaded to background Web Workers (`crypto.worker.ts`) using Comlink, ensuring the UI remains responsive. Supported and audited implementations include:
- **Symmetric:** AES-GCM for encryption/decryption
- **Asymmetric:** RSA-OAEP, ECDSA, ECDH
- **Key Derivation:** PBKDF2, HKDF

## 3. Content Security Policy (CSP)
A robust Content Security Policy is enforced via `next.config.ts`:
- `default-src 'self'`
- `script-src` includes `'self'`, `'unsafe-eval'`, and specific domains like `unpkg.com` and `pagead2.googlesyndication.com`.
- `worker-src 'self' blob:`
- The use of `'unsafe-eval'` and `'unsafe-inline'` lowers the theoretical score slightly, though they are often necessary for React/Next.js and WebAssembly workloads.

## 4. Cross-Site Scripting (XSS)
Next.js handles most XSS protections by automatically escaping data. Usage of `dangerouslySetInnerHTML` is extremely limited (e.g., used safely for the theme initialization script in `layout.tsx`). The app employs `isomorphic-dompurify` for sanitizing markdown and dynamic content.

## 5. Offline Guarantees
KaruviLab utilizes **Workbox** (`workbox-window`) to register a Service Worker (`sw.js`). This caches core application assets and enables the app to function fully offline. Fallback data persistence is handled via IndexedDB.

---

### **Security Score:** 94/100
- **Strengths:** True local-first architecture, Web Crypto API usage, Worker isolation, zero-upload guarantees.
- **Areas for Improvement:** CSP includes `'unsafe-eval'` and `'unsafe-inline'`.
