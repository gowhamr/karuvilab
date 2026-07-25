import { ToolContent } from '../../registry/types';

export const compressPdf: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: PDF Compression Engineering

Welcome to the engineering guide to PDF Compression. Shrinking a document involves aggressive algorithms that balance file size against visual degradation and mathematical efficiency.

---

## 1. Prerequisites: Why are PDFs so large?

A PDF is a container. If you place a 10MB raw photograph into a Word document and save it as a PDF, the PDF will be roughly 10MB. 

The primary culprits for massive PDF files are:
1. **Unoptimized Images:** High DPI (Dots Per Inch) images meant for printing, which are unnecessary for screen viewing.
2. **Embedded Fonts:** To ensure the document looks the same on every computer, editors embed entire font files (like Arial.ttf) into the PDF, even if you only typed three words.
3. **Redundant Objects:** If a logo is placed on 100 pages improperly, the editor might embed the logo 100 separate times instead of referencing it once.

---

## 2. The Compression Arsenal

How do we actually shrink the file? A professional compressor uses multiple different techniques simultaneously.

### Tactic 1: Image Downsampling (Lossy)
If an image is 3000x3000px (300 DPI) but is only displayed in a 2x2 inch box on the page, the compressor will permanently resize the image down to 150 DPI (e.g., 800x800px) and apply aggressive JPEG compression. This single step can reduce a 50MB file to 2MB.

### Tactic 2: Font Subsetting (Lossless)
If you embed a 5MB Chinese font file to write a single sentence, the file balloons. "Font Subsetting" analyzes the document, figures out exactly which 20 characters you used, and deletes the other 50,000 unused characters from the embedded font file, shrinking it to 10KB.

### Tactic 3: FlateDecode Compression (Lossless)
The raw text streams and drawing commands inside the PDF are run through Zlib/Deflate algorithms to compress the underlying code strings (similar to creating a ZIP file).

---

## 3. The Architecture: Why Browsers Struggle

\`\`\`mermaid
graph TD
    A[Large 50MB PDF] -->|Loaded into| B[Browser Web Worker]
    B -->|Requires heavy C++ / WASM Engine| C[Ghostscript / MuPDF]
    C -->|Executes JPEG Algorithms| D[Image Downsampling]
    C -->|Executes Zlib| E[Stream Deflation]
    D --> F[Reconstruct XREF Table]
    E --> F
    F -->|Output| G[Small 3MB PDF]
\`\`\`

**The Browser Limitation:**
Native JavaScript libraries (like \`pdf-lib\`) are excellent at moving pages around, but they do not have the capability to aggressively downsample JPEGs or perform Font Subsetting. 
To achieve true, aggressive compression strictly inside the browser (without uploading to a server), applications must compile massive C/C++ libraries like **Ghostscript** or **MuPDF** into **WebAssembly (WASM)**.

---

## 4. Threat Model & Security Review

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Data Exfiltration** | ✅ WASM Execution | Because PDF compression requires heavy computing power, almost all free tools force you to upload the file to their server. KaruviLab leverages WebAssembly to execute the aggressive C++ compression algorithms entirely offline in your browser. |
| **Visual Loss** | ⚠️ Configuration | Aggressive compression is "Lossy". If you compress architectural blueprints too aggressively, the fine lines and measurements will become permanently unreadable artifacts. |

---

## 5. Production Workflows

- **Email Gateways:** Corporate email servers (like Exchange) often reject attachments over 25MB. Legal teams use PDF compressors to downsample scanned discovery documents so they can be securely emailed to opposing counsel.
- **Web Optimization (Fast Web View):** A specific type of compression reorganizes the PDF's internal XREF table to the very *front* of the file (Linearization). This allows web browsers to download and display Page 1 instantly, while the rest of the 500-page document downloads in the background.

---

## 6. Standards & References
- **JPEG (ISO/IEC 10918-1):** The compression standard used for reducing photographic images within the PDF.
- **Zlib (RFC 1950):** The lossless data-compression library used for FlateDecode streams.

---

## 7. Interactive Quiz

**Beginner:**
1. Why does my PDF look slightly blurry after maximum compression? *(Answer: Maximum compression permanently resizes (downsamples) the images and applies aggressive JPEG compression to save space).*

**Intermediate:**
2. What is Font Subsetting? *(Answer: An algorithm that analyzes which specific letters you typed, and deletes all the unused letters from the embedded font file to save space).*

**Advanced:**
3. Why do most online tools require you to upload the PDF to compress it? *(Answer: Because true image downsampling and font optimization requires massive C++ engines like Ghostscript, which are difficult to run natively in a web browser without advanced WebAssembly).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Select the PDF you wish to shrink.",
    "**Step 2:** Choose your compression level (Recommended vs Extreme). Note that Extreme will visibly reduce image quality.",
    "**Step 3:** The WASM engine will process the file locally.",
    "**Step 4:** Download the optimized file and view the size reduction percentage."
  ],
  faq: [
    {
      question: "Are my files uploaded?",
      answer: "No. KaruviLab uses WebAssembly to run complex compression algorithms entirely offline in your local browser."
    },
    {
      question: "Why didn't my file shrink very much?",
      answer: "If your PDF is entirely text (no images), or if it has already been optimized, compression algorithms cannot shrink it much further. Compression primarily targets unoptimized images and heavy embedded fonts."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [
    {
      error: "Images are completely blurry",
      fix: "You selected 'Extreme' compression on a document with fine details (like architectural plans or charts). Reload the original file and select 'Recommended' or 'Low' compression instead."
    }
  ],
  alternatives: ["Split PDF", "PDF Editor"]
};
