export const watermarkPdf = {
    detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Watermarking & The Graphics State

Welcome to the engineering guide to PDF Watermarking. Stamping a "CONFIDENTIAL" overlay onto a document introduces fascinating challenges in PDF Z-indexing, opacity, and graphic object manipulation.

---

## 1. Prerequisites: Layers in a PDF

In Photoshop, you have explicit "Layers". In a PDF, there are no true layers in the traditional sense. 
Instead, a PDF page is a continuous stream of drawing instructions executed from top to bottom.

\`\`\`text
1. Draw background image.
2. Draw paragraph 1 text.
3. Draw table lines.
4. Draw paragraph 2 text.
\`\`\`

If you want a watermark to appear *behind* the text but *in front* of the background, you must mathematically inject the watermark drawing instructions exactly between step 1 and step 2.

---

## 2. The Graphics State Architecture (ExtGState)

Drawing a semi-transparent "CONFIDENTIAL" stamp diagonally across a page requires modifying the **Extended Graphics State (ExtGState)**.

### Opacity (Alpha Blending)
Unlike CSS where you can just type \`opacity: 0.5\`, PDF requires you to define a specific dictionary object containing the \`ca\` (Stroke Opacity) and \`CA\` (Fill Opacity) values, and then apply that dictionary to the graphics stream before drawing the text.

### Affine Transformations (Rotation)
To make the text diagonal, the engine must apply a transformation matrix. Instead of saying "Rotate 45 degrees", the PDF standard requires a 6-value mathematical matrix: \`[cos(θ) sin(θ) -sin(θ) cos(θ) Tx Ty]\`. The browser engine calculates this matrix to translate the text to the center of the page and rotate it.

---

## 3. Threat Model: The "Removable Watermark" Flaw

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Document Leaks** | ⚠️ Psychological | A watermark deters casual leaks by identifying the source (e.g., "Assigned to John Doe"). |
| **Watermark Removal** | 🚨 Vulnerable | **A standard PDF watermark is incredibly easy to remove.** Because a PDF is just a list of objects, a hacker can open the file in Adobe Illustrator or a specialized PDF editor, select the "CONFIDENTIAL" text object, and press Delete. |

### The Ultimate Mitigation: Rasterization (Flattening)
If you require absolute security where the watermark cannot be deleted, you must **Flatten** or **Rasterize** the PDF. This means converting the entire vector PDF into a single flat JPEG image. The text, the background, and the watermark are permanently fused into a single layer of pixels. 
*(Note: Flattening ruins the ability to search or highlight text).*

---

## 4. Browser Internals: Drawing the Watermark

When you use KaruviLab to apply a watermark:
1. \`pdf-lib\` loads the binary tree into RAM.
2. It generates a new Font Object and embeds it in the file.
3. It iterates over the \`Pages\` array.
4. For each page, it calculates the center coordinates \`(width/2, height/2)\`.
5. It injects a new graphics stream at the end of the page's content stream (drawing it *on top* of everything else), applying the rotation matrix and the ExtGState opacity dictionary.
6. The modified ArrayBuffer is exported.

---

## 5. Production Workflows

- **Legal Discovery (Bates Stamping):** Law firms use specialized watermark tools to automatically stamp sequential numbers (e.g., \`DEFENDANT-0001\`) on the bottom right corner of thousands of evidence pages.
- **Corporate Compliance:** Automated backend systems dynamically generate watermarks containing the downloader's email address and timestamp across confidential memos to track the source of any potential leaks.

---

## 6. Standards & References
- **ISO 32000-1 (Section 8.4):** Graphic State — Details the mathematics of the transformation matrix.
- **ISO 32000-1 (Section 11):** Transparency — Details alpha blending and ExtGState dictionaries.

---

## 7. Interactive Quiz

**Beginner:**
1. Does adding a watermark permanently lock the PDF? *(Answer: No. It simply adds a new text or image object to the page).*

**Intermediate:**
2. Why is it so easy for a hacker to remove a standard PDF watermark? *(Answer: Because PDFs are vector documents made of distinct objects. A hacker can easily select the watermark object in an editor and delete it).*

**Advanced:**
3. How do you permanently fuse a watermark to a document so it cannot be selected or deleted? *(Answer: By Rasterizing or Flattening the PDF, which converts the entire vector document into a single, flat pixel image).*

---

`,
    howTo: [
        "**Step 1:** Upload your target PDF.",
        "**Step 2:** Enter the Text for your watermark (e.g., 'CONFIDENTIAL' or 'DRAFT').",
        "**Step 3:** Adjust the Opacity (transparency), Font Size, and Rotation angle.",
        "**Step 4:** Click 'Apply Watermark'. The engine will instantly inject the text across all pages.",
        "**Step 5:** Download the watermarked file."
    ],
    faq: [
        {
            question: "Can someone remove the watermark I add here?",
            answer: "Yes. Unless you convert the PDF to an image (flattening), any watermark added to a standard PDF is just a text object that can be deleted using advanced PDF editing software."
        },
        {
            question: "Why doesn't the watermark appear behind my images?",
            answer: "In a PDF, new elements are drawn on top of older elements. If your PDF consists of a massive scanned image covering the whole page, placing a watermark 'behind' it would make it completely invisible."
        }
    ],
    useCases: [],
    examples: [],
    commonErrors: [],
    alternatives: ["PDF Editor", "Lock / Unlock PDF"]
};
