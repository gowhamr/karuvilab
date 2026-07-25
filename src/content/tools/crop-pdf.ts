import { ToolContent } from '../../registry/types';

export const cropPdf: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Cropping & Redaction Dangers

Welcome to the engineering guide to PDF Cropping. This handbook exposes a critical security flaw misunderstood by millions of users: the dangerous difference between Cropping a PDF and Redacting a PDF.

---

## 1. Prerequisites: The "CropBox" Illusion

When you crop a photograph in Photoshop and save it, the pixels you cut off are permanently deleted from the file.

When you crop a PDF, **nothing is deleted.**

A PDF page contains several boundary definitions, the most important being the **MediaBox** (the physical paper) and the **CropBox** (what the viewer should actually display on the screen). 

When you use a PDF Crop tool, the software simply shrinks the coordinates of the \`CropBox\`. 

**The Illusion:** When you open the cropped PDF, it looks smaller. But the original text, images, and data outside the new crop area are still sitting perfectly intact inside the file's binary code. The PDF viewer is just actively choosing to hide them from you.

---

## 2. The Threat Model: The "Paul Manafort" Redaction Disaster

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Data Leakage via Cropping** | 🚨 **Vulnerable** | If you crop out a Social Security Number or a confidential paragraph at the bottom of a page, a hacker (or just a curious journalist) can simply open the PDF, revert the CropBox coordinates to their original size, and instantly read the hidden text. |
| **Data Leakage via Black Boxes** | 🚨 **Vulnerable** | Users often draw a black rectangle over sensitive text. This is just a new object drawn *on top* of the text. Anyone can copy-paste the text hidden underneath the black box. |
| **True Security** | ✅ **Redaction / Flattening** | True redaction requires mathematically deleting the text objects from the PDF data stream, or rasterizing (flattening) the document into an image before applying the black box. |

*(Historical Note: In 2019, lawyers for Paul Manafort filed a heavily "redacted" court document. They failed to use true redaction tools and instead used black highlighting boxes. Journalists simply copy-pasted the blacked-out text into Notepad and read highly classified information).*

---

## 3. Browser Internals & Implementation

How does KaruviLab perform a crop?
1. The user draws a visual bounding box over the canvas rendering of the PDF.
2. The UI translates these HTML pixel coordinates into PDF Points (72 points per inch).
3. The engine accounts for the Cartesian coordinate system inversion (PDF \`(0,0)\` is bottom-left).
4. We locate the specific Page Dictionary in the object tree.
5. We rewrite the \`/CropBox [llx lly urx ury]\` array to the new user-defined coordinates.
6. We save the file. The operation is instantaneous because no binary streams are decompressed or rewritten.

---

## 4. Production Workflows

If cropping is dangerous for security, why do we use it?
- **Pre-Press Formatting:** Graphic designers receive a PDF containing "bleed margins" and crop marks. They use crop tools to perfectly slice off these margins before sending the final PDF to the printer.
- **Removing White Space:** Academics reading PDFs on small E-ink devices (like a Kindle) use crop tools to aggressively slice off all the blank white margins, allowing the core text to zoom in and fill the small screen.

---

## 5. Standards & References
- **ISO 32000-1 (Section 14.11.2):** Page Boundaries — Defines the explicit behavior of the CropBox and how viewers must interpret it.
- **NSA / CISA Guidelines:** Both government agencies publish explicit manuals on how to properly sanitize and redact PDFs to avoid catastrophic data leaks caused by improper cropping.

---

## 6. Interactive Quiz

**Beginner:**
1. If I crop a PDF to remove a sensitive paragraph, is it safe to email to someone? *(Answer: ABSOLUTELY NOT. Cropping just hides the text; the data is still perfectly intact inside the file).*

**Intermediate:**
2. What is the difference between the MediaBox and the CropBox? *(Answer: The MediaBox defines the total physical size of the page. The CropBox defines the visible region the PDF viewer is allowed to display).*

**Advanced:**
3. How can I safely remove sensitive information from a PDF? *(Answer: You must use a dedicated Redaction tool that chemically alters the text stream to delete the data, or you must convert the PDF to a flat image (rasterize it) and paint over the pixels).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Upload your target PDF.",
    "**Step 2:** Click and drag on the document to draw your Crop Box.",
    "**Step 3:** Apply the crop. The tool will instantly modify the CropBox coordinates.",
    "**Step 4:** Download the new file. (WARNING: Do not use this tool to hide sensitive information. The cropped data is still retrievable)."
  ],
  faq: [
    {
      question: "Is the data outside the crop area permanently deleted?",
      answer: "No! Cropping a PDF is like putting a picture frame over a large painting. The rest of the painting is still there, hidden behind the frame. Anyone with a PDF editor can easily expand the crop box to see the original content."
    },
    {
      question: "Why did my file size stay the same after cropping?",
      answer: "Because no data was deleted! Only a few coordinate numbers in the file header were changed to tell the viewer to 'zoom in' on a specific area."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Convert to Legal", "Extract Pages"]
};
