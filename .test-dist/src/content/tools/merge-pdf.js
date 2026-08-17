export const mergePdf = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Merging & Structure

Welcome to the engineering guide to PDF Merging. Combining two documents sounds like a simple operation, but under the hood, it requires complex manipulation of binary tree structures and resource deduplication.

---

## 1. Prerequisites: The Illusion of Pages

When you look at a PDF, you see "Pages". But a computer does not see pages.

A PDF is essentially a massive database of reusable objects (Fonts, Images, Text Streams, Color Spaces). A "Page" is simply a lightweight dictionary object that says: *"Display Image Object #14 here, and use Font Object #8 to write this text."*

This architecture makes PDFs incredibly efficient. If your company logo appears on all 100 pages, the image is only stored in the file **once**, and all 100 pages reference that single object.

---

## 2. The Engineering Challenge of Merging

\`\`\`mermaid
graph TD
    A[PDF A: Page 1] -->|Uses| C[Font: Arial - Object #5]
    B[PDF B: Page 1] -->|Uses| D[Font: Arial - Object #12]
    E[Merged PDF Process] -->| Naive Copy | F[Contains Two Copies of Arial]
    E -->| Smart Copy | G[Deduplicates to One Arial Object]
    C --> G
    D --> G
\`\`\`

If you blindly concatenate the bytes of \`File A\` and \`File B\`, the file will corrupt, because both files have an "Object #1" and they will collide.

To merge PDFs properly, the engine must:
1. Parse the entire object tree of File A.
2. Parse the entire object tree of File B.
3. **Re-index:** Increment the object ID numbers of File B so they don't collide with File A (e.g., File B's Object #1 becomes Object #500).
4. **Merge the Catalogs:** Update the Root catalog to list the pages from both files in sequential order.
5. **Deduplicate:** (Advanced engines) detect if both files embedded the exact same Arial font, and strip out the duplicate to save file size.

---

## 3. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Cloud Data Harvesting** | ✅ Local Execution | Free online "Merge PDF" tools are notorious for harvesting financial documents and selling the extracted data. KaruviLab merges the PDFs entirely in your browser's local RAM. |
| **Malware Injection** | ⚠️ PDF Viewers | Merging two PDFs does not scan them for malware. If one PDF contains a malicious JavaScript payload, the resulting merged PDF will also contain it. |
| **Digital Signature Invalidation** | 🚨 Format Rules | If you merge a PDF that has been cryptographically signed (like a legal contract), **the signature will be permanently destroyed**. Modifying the file structure automatically invalidates the cryptographic hash. |

---

## 4. Browser Internals & Memory Limits

Merging massive documents is highly stressful on a web browser.
1. **ArrayBuffer Loading:** Both PDFs must be loaded entirely into RAM. A 50MB and a 60MB PDF will instantly consume 110MB of RAM just for the raw bytes.
2. **Decompression:** PDF streams are compressed (usually using FlateDecode/zlib). The engine must decompress the structures to read the trees, which can balloon RAM usage to 400MB+.
3. **Web Workers:** To prevent the browser tab from crashing or freezing, KaruviLab offloads this heavy ArrayBuffer manipulation to a background Web Worker thread.

---

## 5. Production Workflows

- **Legal & Compliance:** Law firms frequently receive hundreds of separate evidence files (emails, images, documents). They use automated PDF merging tools to combine them into a single, paginated "Trial Binder" with a unified Table of Contents.
- **Enterprise Reporting:** A corporate backend generates a sales report chart (PDF A) and a legal disclaimer (PDF B). Before emailing the client, the server programmatically merges them to ensure the disclaimer cannot be accidentally separated from the data.

---

## 6. Standards & References
- **ISO 32000-1:** Document management — Portable document format.

---

## 7. Interactive Quiz

**Beginner:**
1. Is it safe to merge my bank statements on KaruviLab? *(Answer: Yes, because the merging happens strictly locally on your device. The files are never uploaded).*

**Intermediate:**
2. Why can't you just stick the bytes of PDF B at the end of PDF A? *(Answer: Because both PDFs have their own internal numbering systems and indices (XREF). They will collide and corrupt the file. The objects must be mathematically re-indexed).*

**Advanced:**
3. What happens if you merge a digitally signed, legally binding contract with another page? *(Answer: The digital signature is instantly invalidated. Signatures guarantee the document structure hasn't changed; merging changes the structure).*

---

`,
    howTo: [
        "**Step 1:** Select two or more PDF files from your device.",
        "**Step 2:** Drag and drop the files to arrange them in your desired order.",
        "**Step 3:** Click 'Merge PDFs'.",
        "**Step 4:** The WebAssembly engine will instantly re-index and combine the documents locally, prompting a download of the final file."
    ],
    faq: [
        {
            question: "Why did my merged PDF lose its digital signatures?",
            answer: "Digital signatures are designed to break if a document is modified in any way. Merging mathematically alters the file structure, which inherently voids any existing signatures."
        },
        {
            question: "Is there a limit to how many files I can merge?",
            answer: "There is no hardcoded limit, but merging happens in your browser's RAM. If you try to merge 50 massive files simultaneously, your browser tab may run out of memory and crash."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["Split PDF", "PDF Editor"]
};
