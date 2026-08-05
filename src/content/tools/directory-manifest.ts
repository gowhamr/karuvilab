import { ToolContent } from '../../registry/types';

export const directoryManifest: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Directory Manifests & Integrity Checking

Welcome to the engineering guide to Directory Manifests. This handbook explains how operating systems, package managers, and game engines guarantee that thousands of complex files are exactly where they are supposed to be.

---

## 1. Prerequisites: The "Missing File" Disaster

When you download a massive software package (like a 50GB video game or a complex NPM node_modules folder), the package contains thousands of deeply nested files and folders.

**The Problem:** What happens if the download glitches, or a virus silently corrupts exactly one tiny DLL file in a sub-folder?
If you just try to run the software, it might launch, run for an hour, and then crash catastrophically when it finally tries to load the corrupted DLL. 

**The Solution:** A **Manifest File**.
Before the software launches, the system reads a single "Manifest" file. This file contains a strict list of every single file that is *supposed* to exist, exactly where it belongs, and exactly what its mathematical signature (Hash) should be. If the reality of the folder doesn't match the Manifest perfectly, the system instantly halts and requests a redownload.

---

## 2. Core Concepts: The Anatomy of a Manifest

A professional directory manifest usually takes the form of a JSON or XML file containing:
1. **Relative Paths:** The exact location (e.g., \`assets/textures/wood.png\`).
2. **File Size:** The exact byte count (e.g., \`140592 bytes\`).
3. **Checksum / Hash:** The cryptographic signature (e.g., SHA-256) of the file's binary contents.

---

## 3. Engineering Challenge: Integrity vs Speed

Checking a manifest requires the computer to open every single file on the hard drive, read the bytes into RAM, and calculate the SHA-256 hash. 

- **Speed:** If the directory is 50GB, hashing every file might take several minutes. You cannot make a user wait 5 minutes every time they launch a video game.
- **Optimization:** Modern manifests use a multi-tiered approach.
  1. First, quickly check if the file *exists*.
  2. Second, quickly check if the *file size* (in bytes) matches the manifest.
  3. Only perform the heavy, slow *cryptographic hash* if the size differs, or if it is a highly sensitive security update.

---

## 4. Threat Model & Supply Chain Attacks

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Silent Data Corruption** | ✅ Hashes | If a hard drive sector fails and flips one bit in a PNG image, the SHA-256 hash completely changes. The manifest spots this instantly. |
| **Supply Chain Hacks** | ✅ Subresource Integrity (SRI) | In web development, developers import libraries from external CDNs (e.g., \`<script src="bootstrap.js" integrity="sha384-xyz...">\`). If a hacker compromises the CDN and alters the code, the browser hashes the downloaded file, sees it doesn't match the \`integrity\` manifest, and refuses to execute it. |
| **Manifest Tampering** | 🚨 **Vulnerable** | If a hacker replaces a DLL with malware, what stops them from just updating the Manifest file with the new hash? **Digital Signatures.** The Manifest file itself must be cryptographically signed by the developer (using PGP or X.509) to prove the manifest hasn't been altered. |

---

## 5. Production Workflows

- **NPM & Package.json:** Every time you run \`npm install\`, Node evaluates the \`package-lock.json\` (a manifest). It downloads the packages, calculates their SHA-512 hashes, and verifies they perfectly match the lockfile to prevent malicious code injection.
- **PWA (Progressive Web Apps):** Modern offline web apps use a Web App Manifest and Service Worker caches. The service worker relies on a strict manifest list of URLs and hashes to know exactly which assets to store offline, ensuring the app works without internet.

---

## 6. Interactive Quiz

**Beginner:**
1. What is a directory manifest? *(Answer: A master list detailing every file that is supposed to be in a folder, where it belongs, and its expected mathematical signature).*

**Intermediate:**
2. Why don't systems just check if the file size matches, instead of performing a heavy cryptographic hash? *(Answer: Because a hacker can easily write malware that is the exact same byte size as the original file. A cryptographic hash (like SHA-256) mathematically proves the internal contents haven't changed).*

**Advanced:**
3. How do web browsers use manifests to protect against Supply Chain attacks on CDNs? *(Answer: Using Subresource Integrity (SRI). The developer includes the expected hash in the HTML \`<script>\` tag. If the CDN is hacked and the file is altered, the browser detects the hash mismatch and refuses to execute the malicious code).*

---

`,
  howTo: [
    "**Step 1:** Select a directory (folder) from your local file system.",
    "**Step 2:** (Optional) Select whether you want the engine to calculate a Cryptographic Hash (SHA-256) for each file. This takes longer but ensures true integrity.",
    "**Step 3:** The engine traverses the directory tree locally and generates the output.",
    "**Step 4:** Export the manifest as formatted JSON or a generic Text Tree."
  ],
  faq: [
    {
      question: "Are my files uploaded?",
      answer: "No. The File System Access API traverses the directory and computes all file sizes and hashes strictly within your local browser's memory."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Hash Generator", "Base64"]
};
