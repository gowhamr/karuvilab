import { ToolContent } from '../../registry/types';

export const splitPdf: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Splitting & Resource Extraction

Welcome to the engineering guide to PDF Splitting. Extracting a single page from a massive PDF is fundamentally different from copying text out of a Word document. It requires meticulous resource mapping.

---

## 1. Prerequisites: The Shared Resource Problem

Imagine a 1,000-page corporate manual. The company's custom Font and the company Logo are used on every single page.
To keep the file size small (e.g., 5MB), the PDF stores the Font and the Logo exactly **once** in its internal database. All 1,000 pages just point a reference link to that single Font object.

**The Split Challenge:**
If you tell a naive computer program to "extract Page 50", it will grab the dictionary object for Page 50 and save it as a new file. But when you open that new file, it will be blank, and the text will be invisible. 
Why? Because the new file is missing the Font and Logo objects that Page 50 was relying on!

---

## 2. The Extraction Architecture

To properly split a PDF, the engine must perform a **Dependency Graph Traversal**.

\`\`\`mermaid
graph TD
    A[User requests Page 50] --> B[Engine locates Page 50 Dictionary]
    B --> C{Scan for Dependencies}
    C --> D[Found: Text Stream Object #10]
    C --> E[Found: Image Object #42 (Logo)]
    C --> F[Found: Font Object #8 (Arial)]
    D --> G[Deep Copy into New PDF]
    E --> G
    F --> G
    G --> H[Update XREF Table]
    H --> I[Output valid 1-Page PDF]
\`\`\`

---

## 3. The File Size Paradox

A common complaint from users is: *"I split a 10MB, 100-page PDF to extract just 1 page, but the new 1-page PDF is 9MB! Why?"*

**The Answer:** 
The single page you extracted likely contained a reference to a massive embedded font file (e.g., a 8MB Asian character set) or a high-resolution background image used throughout the document. Because the engine must ensure the extracted page renders perfectly, it is forced to copy that massive 8MB font into the new file. Thus, extracting 1% of the pages does *not* mean the file size will be 1% of the original.

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Data Harvesting** | ✅ Local Execution | Free online PDF splitters can read the contents of the pages you extract. KaruviLab parses the binary structures strictly offline in your local browser. |
| **Password Protection** | ✅ PDF Standard | If the source PDF is encrypted (User Password), the engine cannot read the object tree to split it. You must provide the password to decrypt the tree before extraction. |

---

## 5. Browser Internals: Copying Pages

Under the hood, KaruviLab uses libraries like \`pdf-lib\`.
1. It creates a brand new, empty \`PDFDocument\` object in RAM.
2. It calls \`PDFDocument.copyPages(sourceDocument, [pageIndices])\`.
3. The library walks the ASN.1 / PDF object graph, identifies every nested resource (Fonts, XObjects, ExtGStates) required by the requested pages.
4. It serializes the new isolated tree into a fresh \`ArrayBuffer\`.

---

## 6. Production Workflows

- **HR & Payroll:** A company's payroll system generates a single, massive 500-page PDF containing the paystubs for all 500 employees. A backend script automatically splits this PDF into 500 individual 1-page PDFs and emails them to the respective employees.
- **Legal Discovery:** Lawyers receive a 5,000-page dump of evidence. They use automated splitters to extract specifically identified page ranges (e.g., Pages 400-450) to submit to the judge as isolated exhibits.

---

## 7. Interactive Quiz

**Beginner:**
1. If you split a 100-page PDF into 100 separate files, are those files uploaded to a server? *(Answer: No. KaruviLab performs the mathematical extraction locally in your browser).*

**Intermediate:**
2. Why might extracting a single page from a 10MB PDF result in a 9MB file? *(Answer: Because the extracted page likely relies on a massive embedded resource, like an 8MB font file, which must be copied over to ensure the new file renders correctly).*

**Advanced:**
3. When the engine extracts a page, how does it know which fonts and images to copy? *(Answer: It traverses the PDF Object Dictionary (the Dependency Graph) for that specific page, recursively copying any referenced XObjects and Font Streams).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Select the PDF you wish to split.",
    "**Step 2:** Choose your extraction mode: Extract specific pages (e.g., '1, 4-7') or Split into individual files.",
    "**Step 3:** Click Split. The tool will parse the dependency graph and package your new files.",
    "**Step 4:** The extracted PDF(s) will be downloaded instantly, often as a ZIP file if multiple files were generated."
  ],
  faq: [
    {
      question: "Why is the extracted file almost the same size as the original?",
      answer: "The page you extracted likely relies on a heavy embedded resource (like a large font or high-res image) that was originally shared across the whole document. The engine must copy that heavy resource into the new file so it renders correctly."
    },
    {
      question: "Can I split an encrypted PDF?",
      answer: "If the PDF requires a password to open, you cannot split it until you provide the password to decrypt the object tree."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Merge PDF", "PDF Editor"]
};
