import { ToolContent } from '../../registry/types';

export const qrcode: ToolContent = {
  detailedDescription: `
<p>The KaruviLab QR Code Generator is a versatile, browser-native tool that lets you create high-quality QR codes for a wide variety of use cases. Whether you need to encode a complex URL for marketing materials, generate a vCard for seamless contact sharing, or create a quick-connect QR code for your guest Wi-Fi, our tool provides total control and reliability.</p>

<p>Because this generator operates entirely within your browser, your data remains completely private. When you generate a QR code for sensitive information—such as Wi-Fi credentials or private text—none of that data is ever sent to or processed by a remote server. You can generate unlimited codes with the peace of mind that your input remains exclusively on your device.</p>

<p>We provide advanced customization options to ensure your QR codes are both functional and visually appealing. Adjust the size, select the appropriate error correction level to ensure readability even when printed or damaged, and choose custom colors to align with your personal brand or business identity. Once you are satisfied with your design, you can download your code in high-resolution PNG or vector-based SVG formats for professional print projects.</p>
`,
  howTo: [
    "<strong>Enter Data:</strong> Choose the content type (URL, Text, or Wi-Fi) and enter the information you want to encode.",
    "<strong>Customize:</strong> Use the settings panel to change the color, size, and error correction level.",
    "<strong>Preview:</strong> The QR code updates in real-time as you make adjustments.",
    "<strong>Download:</strong> Select 'Download PNG' for digital use or 'Download SVG' if you need an infinitely scalable format for professional printing.",
  ],
  faq: [
    {
      question: "What is the Error Correction level?",
      answer: "Error correction allows QR codes to be scanned successfully even if the image is partially damaged or obscured. Level L (7%) is best for simple data; Level H (30%) is much more robust for printed materials but produces a more complex (denser) visual pattern.",
    },
    {
      question: "How much data can I store in one code?",
      answer: "A standard QR code can hold approximately 4,296 alphanumeric characters. Note that the more data you add, the 'denser' the resulting code becomes, which may require it to be printed at a larger size for reliable scanning.",
    },
    {
      question: "Why should I use SVG instead of PNG?",
      answer: "SVG is a vector format. It remains perfectly crisp regardless of how much you scale it up or down, making it the superior choice for high-quality printing on business cards, brochures, or posters.",
    },
    {
      question: "Is it safe to generate Wi-Fi QR codes here?",
      answer: "Yes. Your Wi-Fi network name and password are never transmitted over the network. They are converted into code entirely locally on your computer.",
    },
  ],
  useCases: [
    "Instant guest Wi-Fi access in cafes, hotels, or offices.",
    "Connecting printed marketing materials to digital landing pages.",
    "Encoding vCard contact information for business card distribution.",
    "Quick, contactless payment links for merchants and market stalls.",
  ],
  examples: [
    {
      input: "URL: https://karuvilab.com",
      output: "[Dynamic QR Code Graphic]",
      description: "A standard QR code for sharing a website link instantly."
    },
    {
      input: "Wi-Fi: Network=Guest, Pass=secret123",
      output: "[Dynamic Wi-Fi QR Code Graphic]",
      description: "A specialized QR code that allows devices to automatically connect to a secure network."
    }
  ],
  commonErrors: [
    {
      error: "The QR code doesn't scan",
      fix: "The code might be too dense for your camera, or the contrast is too low. Try increasing the print size or changing the colors to use a dark foreground on a light background.",
    },
    {
      error: "URL link is incorrect",
      fix: "Ensure your URL begins with `https://` or `http://`. Without the prefix, some scanners may treat the content as plain text instead of a clickable link.",
    },
  ],
  alternatives: ["qr-code-generator.com", "goqr.me", "QRCode Monkey"],
};
