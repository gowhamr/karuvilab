import { ToolContent } from '../../registry/types';

export const extractPages: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Page Extraction

*(This guide focuses on the specific nuances of extracting subsets of documents. For a deep dive into the Dependency Graph and File Size paradoxes, refer to the **Split PDF** Learning Hub).*

---

## 1. Prerequisites: The Page Tree Structure

In a PDF, pages are not stored in a simple list. They are stored in a highly balanced **Tree Structure** (often a B-Tree).
The Root of the document points to a \`/Pages\` dictionary. That dictionary might point to 10 "Kids" (Branches). Each branch points to 10 more "Kids", until you finally reach the actual \`/Page\` object (Leaf).

**Why a Tree?** 
If you open a 10,000-page architectural manual and try to jump to Page 8,500, parsing a flat list of 8,500 objects would be incredibly slow. By storing pages in a tree, the PDF reader can traverse branches logarithmically, finding Page 8,500 in just a few microsecond hops.

---

## 2. The Extraction Challenge: Rebuilding the Tree

When you extract "Pages 5-10" from a document:
1. The engine cannot just copy the leaf objects.
2. It must traverse the tree of the source document to locate those specific leaves.
3. It must create a brand new \`/Pages\` Root in the new document.
4. It must calculate a new \`Count\` attribute (which is mandatory in the PDF specification) so the reader knows exactly how many pages exist in this new tree.
5. It must update the \`Parent\` references of the extracted pages to point to the new Root.

---

## 3. Advanced Concepts: AcroForms & Interactive Elements

Extracting a page becomes massively complicated if the PDF is an interactive form (an AcroForm).

**The Problem:**
Form fields (like a signature box or a text input) are not actually attached to the Page they are drawn on. They exist in a global \`/AcroForm\` dictionary at the root of the document, and the page merely holds a visual reference (an Annotation) to them.

If a naive extraction tool copies Page 1, it will copy the Annotation, but it will leave behind the actual global Form Field logic. The resulting extracted page will have a broken, un-clickable, or missing form box.

**The Solution:**
A professional extraction engine must detect annotations on the extracted page, traverse back up to the Root Catalog of the source document, extract the corresponding fields from the \`/AcroForm\` array, and deep-copy them into a brand new \`/AcroForm\` array in the target document.

---

## 4. Production Workflows

- **Financial Auditing:** Auditors request a 400-page General Ledger from a company. To highlight a discrepancy, they extract the 3 specific pages containing the anomaly, maintaining the exact layout and vector quality, and attach them to an executive summary.
- **Book Publishing:** Authors extract specific chapters (e.g., Pages 10-35) from a massive manuscript PDF to send to specialized editors or proofreaders, reducing file transfer times.

---

## 5. Standards & References
- **ISO 32000-1 (Section 7.7.3):** The Page Tree — Defines the rigid requirements for the \`Kids\`, \`Count\`, and \`Parent\` attributes.
- **ISO 32000-1 (Section 12.7):** Interactive Forms — Defines how AcroForms are globally managed and linked to page annotations.

---

## 6. Interactive Quiz

**Beginner:**
1. If I extract 5 pages from a 100-page document, is my original file deleted? *(Answer: No. The original file remains untouched. Extraction creates a brand new copy of those specific pages).*

**Intermediate:**
2. Why are pages stored in a Tree structure instead of a flat list? *(Answer: To provide extremely fast, logarithmic lookup times when a user wants to jump to a specific page in a massive 10,000-page document).*

**Advanced:**
3. Why do interactive text boxes sometimes disappear or break when a page is extracted? *(Answer: Because form fields (AcroForms) are stored globally at the root of the document, not on the page itself. If the extraction tool doesn't explicitly copy the global form logic over, the page annotation breaks).*

---

`,
  howTo: [
    "**Step 1:** Upload your source PDF document.",
    "**Step 2:** Enter the specific page ranges you want to extract (e.g., '1-5, 8, 11-13').",
    "**Step 3:** Click Extract. The engine will parse the Page Tree, isolate the dependencies, and package a new file.",
    "**Step 4:** Download your newly extracted document."
  ],
  faq: [
    {
      question: "Can I extract pages from a password-protected file?",
      answer: "Only if you have the password. The engine must decrypt the document's binary tree before it can locate and extract the requested pages."
    },
    {
      question: "Will the extracted pages look identical?",
      answer: "Yes. Extraction is a mathematically lossless operation. All vector paths, images, and fonts are preserved at 100% original quality."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Split PDF", "Merge PDF"]
};
