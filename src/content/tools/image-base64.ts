import { ToolContent } from '../../registry/types';

export const imageBase64: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Base64 Encoding & Data URIs

Welcome to the engineering guide to Image Base64 Encoding. This handbook explains how you can turn a photograph into a massive string of text, and why you should (or shouldn't) do it.

---

## 1. Prerequisites: The Problem with Binary

The internet relies on text-based protocols (like HTML, CSS, and JSON). These protocols expect standard ASCII characters (A-Z, 0-9).
An image is a **binary** file. If you try to paste a raw PNG file directly into an HTML document, the browser will interpret the binary bytes as gibberish control characters and break the page.

**The Solution:** Base64 Encoding.
Base64 mathematically translates binary bytes into safe, printable ASCII characters. It takes 3 bytes of binary data (24 bits) and splits them into 4 chunks of 6 bits. Each 6-bit chunk maps to a specific letter in the Base64 alphabet (\`A-Z, a-z, 0-9, +, /\`).

---

## 2. The 33% Penalty

**The Cost of Base64:** Because it uses 4 text characters to represent every 3 bytes of binary data, **Base64 encoding always increases the file size by exactly 33%.**

If you have a 3MB JPEG image, converting it to Base64 will result in a 4MB text string. This is a massive penalty for web performance.

---

## 3. Data URIs: Embedding Images in Code

Once encoded, the text is formatted as a **Data URI**.
Format: \`data:[<mediatype>][;base64],<data>\`
Example: \`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\`

You can paste this entire string directly into the \`src\` attribute of an HTML \`<img>\` tag, or into a CSS \`background-image\` property. The browser decodes the text back into binary pixels on the fly.

---

## 4. Threat Model & Performance Disasters

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **HTML Blocking** | 🚨 Architecture | The browser parser executes HTML from top to bottom. If you embed a 2MB Base64 image directly into your HTML file, the browser cannot load the rest of the page until it finishes downloading and parsing those 2 million characters of text. This causes severe page load delays. |
| **Cache Bypassing** | 🚨 Architecture | Standard images (\`<img src="logo.png">\`) are cached by the browser. If you navigate to a new page, the browser loads the logo from cache instantly. If you embed the logo as Base64 in your HTML, it cannot be cached independently. It must be downloaded again every time the HTML is requested. |
| **Malware Injection** | ⚠️ WAF Rules | Hackers sometimes embed malicious payloads using Base64 Data URIs to bypass simple Web Application Firewalls (WAFs) that only scan for standard \`<script>\` tags. |

---

## 5. Production Workflows

If Base64 causes a 33% size penalty and ruins caching, why do engineers use it?

- **HTML Email Templates:** Email clients (like Outlook or Gmail) often block external image URLs for privacy reasons. Embedding the company logo as a Base64 Data URI directly inside the email's HTML code ensures the logo displays instantly without the user having to click "Download Pictures".
- **Micro-Optimization (CSS Sprites):** If you have a tiny 500-byte icon (like a magnifying glass), the HTTP network overhead required to request that file from the server might take longer than just downloading the file itself. Embedding the 500-byte Base64 string directly into the CSS file saves an HTTP request and speeds up the page. (Note: HTTP/2 multiplexing has largely made this optimization obsolete).

---

## 6. Interactive Quiz

**Beginner:**
1. Does converting an image to Base64 reduce its file size? *(Answer: No. It actually increases the file size by 33%).*

**Intermediate:**
2. Why does Base64 increase the file size? *(Answer: Because it takes 3 bytes of dense binary data and stretches them out into 4 bytes of safe ASCII text characters).*

**Advanced:**
3. Why is embedding large Base64 images directly into HTML considered terrible for web performance? *(Answer: It dramatically inflates the HTML file size, blocks the browser parser from rendering the rest of the page, and prevents the image from being cached independently in the user's browser).*

---

`,
  howTo: [
    "**Step 1:** Upload an image (PNG, JPEG, WebP, SVG).",
    "**Step 2:** The tool instantly converts the binary data into a Base64 text string.",
    "**Step 3:** Copy the raw string, or copy the formatted HTML <img> tag or CSS code snippet.",
    "**Step 4:** Paste the code directly into your project to render the image without an external file."
  ],
  faq: [
    {
      question: "Is there a file size limit?",
      answer: "While KaruviLab processes the data locally, converting a massive 20MB image into Base64 will freeze your browser tab as it attempts to generate and render 26 million characters of text. Stick to small icons and logos."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Color Palette Extractor", "Remove Metadata"]
};
