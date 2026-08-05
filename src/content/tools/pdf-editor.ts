import { ToolContent } from '../../registry/types';

export const pdfEditor: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Architecture & Editing

Welcome to the definitive engineering guide to the Portable Document Format (PDF). This handbook demystifies why the most common file format in the business world is notoriously difficult to edit, and how modern browser engines overcome this.

---

## 1. Prerequisites: The Digital Paper Paradox

Why is it so easy to edit a Microsoft Word document (.docx) but so hard to edit a PDF?

**Word Documents** are structured logically like a web page. If you type a new word, the text dynamically flows, pushes the next paragraph down, and automatically creates a new page if necessary.

**PDF Documents** are structured visually like a printed piece of paper. The format explicitly states: *"Draw the letter 'A' at exactly X: 120, Y: 450 using Helvetica size 12."* 
Because it is a static canvas of exact coordinates, if you try to insert a new sentence, the PDF engine doesn't know how to "push" the rest of the text down. Editing a PDF is mathematically closer to editing an image than editing a text document.

---

## 2. The PDF Ecosystem & Data Flow

\`\`\`mermaid
graph TD
    A[Original Document Word/HTML] -->|Printed / Exported| B[PDF File Generated]
    B -->|Loaded into Browser| C[PDF.js Rendering Engine]
    C -->|Draws to| D[HTML5 Canvas <canvas>]
    D -->|User Interaction| E[Text/Signatures placed via Coordinates]
    E -->|Modifications applied via| F[pdf-lib ArrayBuffer]
    F -->|Serialized| G[New Modified PDF Downloaded]
\`\`\`

---

## 3. Architecture Deep Dive: The PDF DOM

A PDF file is not just a blob of data; it has a rigid internal tree structure, much like the DOM of a web page.

1. **The Header:** Specifies the version (e.g., \`%PDF-1.7\`).
2. **The Body (Objects):** Contains thousands of independent objects (Text streams, Images, Fonts).
3. **The Cross-Reference Table (XREF):** This is the secret to PDF performance. It acts as an index, storing the exact byte offset of every object in the file. This allows a PDF Reader to instantly jump to Page 800 without having to load Pages 1-799 into memory.
4. **The Trailer:** Contains the location of the XREF table and the Root Catalog (the top of the tree).

When you "edit" a PDF, you are modifying objects in the Body and rewriting the XREF table so the reader knows where the new objects live.

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Data Privacy Breach** | ✅ Local Execution | Standard PDF editors (like Adobe Acrobat Online or ILovePDF) require you to upload your highly sensitive tax returns to their cloud servers. KaruviLab processes the PDF entirely in your local browser RAM. No files are ever uploaded. |
| **Malicious JavaScript** | ⚠️ Viewer Restrictions | PDFs can technically contain embedded JavaScript (used for dynamic forms). Hackers use this to exploit PDF readers. Safe viewers disable JS execution by default. |
| **Tampering** | ❌ Digital Signatures | If a PDF is just text, anyone can edit it. To prove a PDF hasn't been altered, it must be cryptographically signed using an X.509 certificate (Digital Signature). |

---

## 5. Browser Internals: Rendering vs Editing

Editing a PDF in a browser requires two entirely different engines working simultaneously:

1. **The Renderer (Mozilla PDF.js):** 
   This engine reads the PDF commands and paints the exact pixels onto an HTML5 \`<canvas>\`. It is highly optimized but strictly read-only.
2. **The Manipulator (pdf-lib):** 
   This engine parses the raw binary \`ArrayBuffer\` of the PDF. When you drag a signature onto the canvas at X:200, Y:300, \`pdf-lib\` mathematically translates those DOM coordinates into PDF points (1/72 of an inch) and injects a new visual object into the PDF's binary tree.

Because manipulating a 50MB PDF tree blocks the JavaScript main thread, KaruviLab offloads this heavy array processing to background Web Workers to keep the UI smooth.

---

## 6. Production Workflows

How are PDFs programmatically manipulated in the enterprise?
- **Banking / Fintech:** When you generate a monthly bank statement, a backend server doesn't draw it from scratch. It loads a static PDF template and injects dynamic text (your balance) into specific absolute coordinates.
- **E-Signatures (DocuSign):** The platform renders the PDF as an image to the user. When the user clicks "Sign", the backend injects an image of their signature into the PDF and then wraps the entire file in a cryptographic X.509 signature to legally lock the document.

---

## 7. Performance Benchmarks & Limitations

- **Memory Usage:** Parsing a PDF requires reading the entire binary structure into RAM. A 100MB PDF might require 400MB of RAM to decompress and manipulate the object tree.
- **Incremental Updates:** Instead of rewriting a massive 1GB PDF file to add one signature, the PDF standard allows "Incremental Updates". The editor appends the new signature object and a *new* XREF table exclusively to the very end of the file. This is extremely fast, but it makes the file size slightly larger.

---

## 8. Standards & References
- **ISO 32000-1:** The official ISO standardization of PDF 1.7 (Adobe relinquished control in 2008).
- **ISO 19005 (PDF/A):** A strict subset of PDF designed for long-term archiving (forbids encryption, audio, and external references).

---

## 9. Interactive Quiz

**Beginner:**
1. Is a PDF structured like a Word document or a static canvas? *(Answer: A static canvas of exact X/Y coordinates).*
2. Are your files uploaded to a server when using KaruviLab's PDF Editor? *(Answer: No. All editing happens locally in your browser).*

**Intermediate:**
3. What is the XREF (Cross-Reference) table? *(Answer: An index at the end of the file that stores the exact byte location of every object, allowing readers to jump to any page instantly without loading the whole file).*

**Advanced:**
4. Why is inserting text into the middle of a PDF paragraph incredibly difficult? *(Answer: Because the PDF format does not have a concept of "text flow" or "margins". The text is hardcoded to absolute coordinates. Inserting a word requires the editor engine to manually recalculate the coordinates of every subsequent word on the page).*

---

`,
  howTo: [
    "**Step 1:** Select a PDF file from your device. It will load instantly since nothing is uploaded.",
    "**Step 2:** Click the 'Text' or 'Draw' tools in the toolbar to add new content.",
    "**Step 3:** Click and drag anywhere on the document to place your annotations.",
    "**Step 4:** Click 'Export' to serialize the changes and download the modified PDF file."
  ],
  faq: [
    {
      question: "Why can't I edit the existing text in the PDF?",
      answer: "This tool allows you to overlay new text, images, and signatures on top of the document. Actually deleting or reflowing existing text requires complex font-reconstruction algorithms that often break the document layout."
    },
    {
      question: "Are my sensitive documents safe here?",
      answer: "Absolutely. The editing engine is powered by WebAssembly and JavaScript running 100% locally on your machine. We never see your documents."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [
    {
      error: "Document freezes or crashes browser",
      fix: "If you open a massive PDF (e.g., 500+ pages or highly detailed architectural blueprints), your browser may run out of RAM. Try splitting the PDF into smaller chunks first."
    }
  ],
  alternatives: ["Merge PDF", "Split PDF"]
};
