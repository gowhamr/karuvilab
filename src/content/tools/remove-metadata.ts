import { ToolContent } from '../../registry/types';

export const removeMetadata: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Metadata Scrubbing & Anonymization

*(This guide focuses on the engineering mechanisms of securely wiping data. For an overview of what EXIF data is and the privacy threats it poses, refer to the **Edit Metadata** Learning Hub).*

---

## 1. Prerequisites: The Anatomy of a Scrub

When you want to anonymize a photo before uploading it to a public forum, you must "Scrub" the metadata.

**The Naive Approach (Lossy):**
Some tools scrub a JPEG by loading it onto an HTML5 \`<canvas>\` and then re-exporting it as a new JPEG. 
- *Pros:* It guarantees 100% of all hidden data (EXIF, XMP, IPTC) is destroyed because the canvas only cares about pixels.
- *Cons:* Re-exporting a JPEG mathematically re-compresses the image. The photo loses visual quality (generation loss), and the file size changes unpredictably.

**The Professional Approach (Lossless):**
A professional scrubber performs Binary Header Manipulation. It reads the raw \`ArrayBuffer\` of the file, identifies the boundaries of the \`APP1\` (EXIF) and \`APP13\` (IPTC) blocks, and meticulously splices them out of the array without touching the \`Start of Scan (SOS)\` pixel data block.
- *Result:* The image retains 100% of its original pixel quality, and the privacy risk is completely eliminated.

---

## 2. The Danger of "Thumbnail" Leaks

A major vulnerability in metadata is the **EXIF Thumbnail**.

Digital cameras often embed a tiny, low-resolution version of the photo *inside* the EXIF data so the camera screen can display it instantly without decoding the massive 20MB RAW image.

**The Disaster:** If a user edits a photo to crop out their face, but the software fails to update or delete the embedded EXIF thumbnail, the hidden thumbnail will still contain the original, uncropped photo! Hackers routinely extract EXIF thumbnails to see what the image looked like *before* it was cropped or censored. 

When you use KaruviLab's Remove Metadata tool, the entire EXIF block—including the hidden thumbnail—is securely wiped.

---

## 3. Threat Model: Steganography vs Metadata

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **GPS Tracking / Doxxing** | ✅ Metadata Scrub | Wiping the APP1 EXIF block permanently removes the latitude and longitude coordinates. |
| **Steganography** | ❌ None | Steganography is the art of hiding data *inside* the actual pixel colors (e.g., slightly altering the red value of every 10th pixel to spell a secret message). Scrubbing metadata does absolutely nothing to stop Steganography, because the secret is embedded in the image itself, not the header. |

---

## 4. Production Workflows

- **Journalism / Whistleblowing:** SecureDrop systems used by investigative journalists automatically run rigorous metadata scrubbing on every leaked document and photo submitted to them. If they didn't, the EXIF data could expose the whistleblowers' identities to the government.
- **Enterprise Security:** Law firms use automated scrubbing pipelines on PDF and Word documents to ensure hidden tracked changes, author names, and internal server paths are permanently deleted before sending the files to opposing counsel.

---

## 5. Interactive Quiz

**Beginner:**
1. Does scrubbing an image reduce its visual quality? *(Answer: Not if done correctly. A proper scrubber performs a lossless binary splice, deleting the text header without touching the pixel data).*

**Intermediate:**
2. What is the danger of the EXIF Thumbnail? *(Answer: The thumbnail might contain the original version of the photo before you cropped or censored it. If it isn't deleted, hackers can extract it to see what you tried to hide).*

**Advanced:**
3. Can a metadata scrubber detect a secret message hidden via Steganography? *(Answer: No. Steganography alters the mathematical color values of the pixels themselves. Metadata scrubbers only delete the text-based headers).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Select the image or document you wish to anonymize.",
    "**Step 2:** The tool instantly performs a local, lossless binary scan of the file headers.",
    "**Step 3:** Click 'Scrub Data'. The engine will splice out the APP1, EXIF, and XMP blocks.",
    "**Step 4:** Download your mathematically anonymized file, safe for public sharing."
  ],
  faq: [
    {
      question: "Are my files uploaded?",
      answer: "No. For maximum privacy, KaruviLab executes the binary scrubbing algorithms 100% offline in your local browser."
    },
    {
      question: "Why did the file size shrink slightly?",
      answer: "Metadata, especially embedded thumbnails and extensive camera profiles, can take up 50KB to 100KB of space. When wiped, the file size shrinks accordingly."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Edit Metadata"]
};
