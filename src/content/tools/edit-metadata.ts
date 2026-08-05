import { ToolContent } from '../../registry/types';

export const editMetadata: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Image Metadata & EXIF Forensics

Welcome to the engineering guide to digital forensics. This handbook reveals the invisible data silently attached to every photograph you take, and how it is used for both utility and surveillance.

---

## 1. Prerequisites: What is EXIF?

When you take a photo with a smartphone, the resulting JPEG file is not just a grid of colored pixels. The camera embeds a hidden database of text into the file header. This is called **EXIF** (Exchangeable Image File Format).

**What does it store?**
- **Hardware:** Exact phone model (e.g., iPhone 15 Pro), lens type, serial number.
- **Exposure:** Shutter speed, aperture, ISO, flash status.
- **Location:** Exact GPS coordinates (Latitude, Longitude, Altitude) of where you were standing when you pressed the shutter.
- **Timestamp:** The exact millisecond the photo was taken.

---

## 2. The Architecture: Inside the JPEG

A JPEG file is divided into Segments called "Markers".
1. **SOI (Start of Image):** \`FF D8\`
2. **APP0 (Application 0):** JFIF data (standard image header).
3. **APP1 (Application 1):** The EXIF data block. This is where the secrets live.
4. **SOS (Start of Scan):** The actual compressed pixel data.
5. **EOI (End of Image):** \`FF D9\`

EXIF data is stored in **IFDs** (Image File Directories). 
When you edit metadata using KaruviLab, the engine parses the APP1 hex block, locates the specific IFD Tag (e.g., Tag \`0x8825\` for GPS Info), and rewrites the byte values before saving the file.

---

## 3. Threat Model & Privacy Disasters

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **Physical Stalking (Doxxing)** | 🚨 Vulnerable | If you post a photo of your new dog to an obscure forum, anyone can download the image, read the APP1 block, and extract the exact GPS coordinates of your living room. |
| **Corporate Espionage** | 🚨 Vulnerable | A leaked photo of an unreleased prototype might contain EXIF data revealing the exact employee whose phone took the picture, including the date and office location. |
| **Social Media Sanitization** | ✅ Platform Scrubbing | Major platforms like Facebook, Instagram, and Twitter automatically strip EXIF data when you upload a photo to protect your privacy. However, uploading to personal blogs, email, or obscure messaging boards often leaves the data intact. |

---

## 4. Production Workflows

Why do we need EXIF if it's a privacy risk?
- **Digital Asset Management (DAM):** Photographers dump 5,000 photos from a wedding into Lightroom. The software instantly organizes them chronologically and by camera lens using EXIF data.
- **Police Forensics:** When law enforcement seizes a hard drive, they extract the EXIF serial numbers from illegal photos to prove a specific physical camera was used to take them.

---

## 5. Browser Internals: Local Extraction

Extracting EXIF data natively in JavaScript requires careful ArrayBuffer manipulation. 
Instead of loading a massive 20MB RAW image entirely into RAM, the KaruviLab engine reads just the first 128KB of the file. It scans for the \`FF E1\` (APP1) marker, extracts the IFD tags using a DataView, and then stops reading. This makes metadata extraction instantaneous, even on massive files.

---

## 6. Standards & References
- **JEITA CP-3451:** The official EXIF specification standardizing the IFD tag numbers (e.g., Tag 271 = Equipment Make).
- **IPTC & XMP:** Additional metadata standards embedded in modern files (often found in APP13) used by Adobe and news agencies to embed copyright and captions.

---

## 7. Interactive Quiz

**Beginner:**
1. Does my phone record where a photo was taken? *(Answer: Yes, unless you specifically turn off Location Services for the camera app, it silently embeds your exact GPS coordinates into the image file).*

**Intermediate:**
2. If I crop a photo, does it delete the EXIF location? *(Answer: No! Cropping only modifies the pixels. The hidden text database in the file header remains perfectly intact).*

**Advanced:**
3. How do websites like Facebook protect you from EXIF doxxing? *(Answer: Their backend servers run an image processing pipeline (like ImageMagick) that automatically strips the APP1 EXIF block from the JPEG header before serving the image to the public).*

---

`,
  howTo: [
    "**Step 1:** Select an image (JPEG/TIFF) from your device.",
    "**Step 2:** The tool instantly parses the APP1 marker locally in your browser and displays a table of all hidden EXIF tags.",
    "**Step 3:** To alter the forensic trail, edit specific fields (like Author, Copyright, or Camera Model).",
    "**Step 4:** Click Save to rewrite the binary header and download the modified file."
  ],
  faq: [
    {
      question: "Are my photos uploaded to analyze the data?",
      answer: "No. KaruviLab parses the binary headers entirely in your local browser memory. Your sensitive GPS coordinates never leave your device."
    },
    {
      question: "Why does my PNG file have no EXIF data?",
      answer: "While it is technically possible, the EXIF standard was originally designed for JPEG and TIFF files from digital cameras. PNGs are usually generated by computers (screenshots, UI graphics) and rarely contain EXIF blocks."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Remove Metadata", "Image to Base64"]
};
