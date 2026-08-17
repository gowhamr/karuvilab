export const convertToLegal = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Coordinate Geometry & Layout Conversion

Welcome to the engineering guide to PDF Dimensions. Changing a document from A4 to Legal size is not just a matter of changing a setting; it involves complex affine transformation matrices and coordinate geometry.

---

## 1. Prerequisites: The PDF Bounding Boxes

In physical printing, paper goes through different stages (printing, cutting, binding). To support professional printing, every PDF page defines up to five distinct invisible "Boxes":

1. **MediaBox:** The physical size of the paper (e.g., 8.5 x 11 inches).
2. **CropBox:** The region the PDF viewer is actually instructed to display on your screen.
3. **BleedBox:** The region to which ink should extend so that when the paper is cut, there are no white margins.
4. **TrimBox:** The exact dimension the paper will be cut to.
5. **ArtBox:** The boundary of the meaningful content (excluding blank margins).

When you "convert to Legal", you are primarily rewriting the **MediaBox** and **CropBox** coordinates.

---

## 2. The Coordinate System Paradox

Unlike HTML/CSS where \`(0,0)\` is at the **top-left** of the screen, the PDF coordinate system follows standard Cartesian geometry: \`(0,0)\` is at the **bottom-left** of the page.

If you have an A4 page (8.27 × 11.69 inches) and you blindly change the MediaBox to Legal size (8.5 × 14 inches), the PDF engine extends the page upwards and to the right. Your original content will suddenly be stuck in the bottom-left corner with massive blank margins at the top!

---

## 3. The Engineering Challenge: Affine Transformations

To convert an A4 document to Legal size while keeping the content perfectly centered and scaled, the engine must apply an **Affine Transformation Matrix**.

\`\`\`mermaid
graph TD
    A[Original A4 Page] --> B[Calculate Scale Ratio]
    B --> C[Calculate X/Y Translation offsets to center content]
    C --> D[Generate Transformation Matrix]
    D --> E[Inject matrix into Page Content Stream]
    E --> F[Update MediaBox to Legal Dimensions]
    F --> G[Perfectly Scaled Legal PDF]
\`\`\`

If we scale the content by $1.2$x and move it $50$ points right and $100$ points up, we inject the matrix:
\`1.2 0 0 1.2 50 100 cm\`
Because PDFs are vector-based, multiplying every text and drawing coordinate by this matrix scales the document infinitely without losing a single pixel of quality.

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Signature Invalidation** | 🚨 Format Rules | Resizing the layout modifies the Page dictionaries. If the PDF is cryptographically signed, this geometric modification instantly destroys the digital signature's validity. |
| **Data Loss** | ✅ Lossless Math | Because the resize is achieved via a mathematical transformation matrix on vector objects, no actual data or resolution is lost during the conversion. |

---

## 5. Browser Internals: Implementation

To perform this conversion strictly in the browser using \`pdf-lib\`:
1. We iterate through every page in the document.
2. We read the original \`MediaBox\` array (e.g., \`[0, 0, 595.28, 841.89]\` for A4).
3. We set the new \`MediaBox\` to Legal dimensions (8.5 x 14 inches = \`[0, 0, 612, 1008]\` points).
4. We calculate the difference in aspect ratios to determine the scale factor.
5. We calculate the translation needed to center the scaled content in the new larger box.
6. We wrap the page's existing content stream in \`q ... Q\` (save/restore graphics state) and prepend the calculated transformation matrix.

---

## 6. Production Workflows

- **Court Filings:** Many jurisdictions strictly mandate that all electronic filings must be submitted in Legal size (8.5 x 14). Lawyers use automated batch scripts to geometrically convert hundreds of standard Letter/A4 evidence PDFs into Legal size before uploading them to the court's E-Filing system.
- **Commercial Printing:** Pre-press automated software automatically scales client-submitted artwork to match the exact dimensions of the target printing press, injecting custom BleedBox coordinates.

---

## 7. Standards & References
- **ISO 32000-1 (Section 14.11):** Page Boundaries — Details the definitions of MediaBox, CropBox, TrimBox, and BleedBox.

---

## 8. Interactive Quiz

**Beginner:**
1. Does scaling a PDF to a larger paper size make the text blurry? *(Answer: No. Text in a PDF is vector-based, meaning it is drawn using mathematical formulas that scale infinitely without pixelation).*

**Intermediate:**
2. Where is coordinate (0,0) on a PDF page? *(Answer: The bottom-left corner, unlike web pages which start at the top-left).*

**Advanced:**
3. Why does the engine need a Transformation Matrix to resize the page, instead of just changing the paper size setting? *(Answer: If you only change the paper size, the content will stay at its original size anchored to the bottom-left corner, leaving massive empty margins. The matrix mathematically scales and centers the existing content to fit the new paper).*

---

`,
    howTo: [
        "**Step 1:** Upload your A4, Letter, or custom-sized PDF.",
        "**Step 2:** Select the target format (Legal Size is default).",
        "**Step 3:** Choose your scaling preference (Center & Scale to fit, or preserve original scale).",
        "**Step 4:** Click Convert. The tool calculates the geometry and outputs the new file."
    ],
    faq: [
        {
            question: "Will this ruin the resolution of my images?",
            answer: "No. The actual image data is untouched. We simply apply a mathematical scaling instruction. However, if you scale a low-resolution image to a massive canvas, it may visually appear pixelated when viewed."
        },
        {
            question: "Why did my digital signature disappear?",
            answer: "Changing the physical dimensions of the pages requires modifying the core document structure, which automatically voids any cryptographic signatures applied to the original file."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["Crop PDF", "PDF Editor"]
};
