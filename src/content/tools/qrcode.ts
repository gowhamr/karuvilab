import { ToolContent } from '../../registry/types';

export const qrcode: ToolContent = {
  detailedDescription:
    "Generate QR codes for URLs, plain text, Wi-Fi credentials, and more instantly in the browser. Customize the size, error correction level, and colors. Download the QR code as a PNG or SVG for use in print or digital materials. No data is sent to any server.",
  howTo: [
    "Select the content type: URL, Text, or Wi-Fi.",
    "Enter your content in the input field.",
    "The QR code preview updates in real time.",
    "Adjust size and error correction level if needed.",
    "Click 'Download PNG' or 'Download SVG' to save.",
  ],
  faq: [
    {
      question: "What is the error correction level?",
      answer:
        "Error correction allows QR codes to be read even when partially damaged or obscured. Level L (7%) is smallest; level H (30%) is most resilient but produces a denser code.",
    },
    {
      question: "How much data can a QR code hold?",
      answer:
        "A standard QR code can store up to ~4,296 alphanumeric characters. Longer content produces a denser, harder-to-scan code.",
    },
    {
      question: "Can I add a logo inside the QR code?",
      answer:
        "Yes, if the tool supports logo overlay. Use a high error correction level (Q or H) when adding a logo so the code remains scannable.",
    },
    {
      question: "Will the QR code work forever?",
      answer:
        "The QR code itself never expires. However, if it encodes a URL, the code stops working if the URL is taken down.",
    },
  ],
  useCases: [
    "Sharing a Wi-Fi password at a café or event",
    "Linking a printed flyer to a website",
    "Encoding a contact vCard for business cards",
    "Providing a quick payment link at a market stall",
  ],
  examples: [
    {
      label: "QR for URL",
      input: "https://karuvilab.com",
      output: "[QR code image encoding the URL]",
    },
  ],
  commonErrors: [
    {
      error: "QR code scans but opens a broken link",
      fix: "Double-check the URL for typos. Include the `https://` prefix.",
    },
    {
      error: "QR code is too dense to scan reliably",
      fix: "Shorten the URL using a URL shortener, or increase the physical print size.",
    },
    {
      error: "Downloaded PNG is blurry",
      fix: "Increase the size setting before downloading, or download the SVG for infinite resolution.",
    },
  ],
  alternatives: ["qr-code-generator.com", "goqr.me", "QRCode Monkey"],
};
