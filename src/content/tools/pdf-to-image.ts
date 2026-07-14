import { ToolContent } from '../../registry/types';

export const pdfToImageContent: ToolContent = {
  detailedDescription: "<p>The <strong>PDF to Image</strong> tool is a specialized, high-efficiency utility built to seamlessly convert PDF pages into JPG or PNG images directly within your browser. Adhering to KaruviLab's strict <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> philosophy, this tool guarantees that your confidential documents, legal contracts, or personal files are never uploaded to any cloud server. Every single conversion happens securely within your local environment.</p><p>By harnessing the power of <strong>Local-First Execution</strong>, the tool renders complex file structures into high-quality images using your device's native processing capabilities. This architecture not only eliminates the security vulnerabilities inherent in online converters but also drastically reduces processing time. You can convert high-resolution images instantly, avoiding the slow upload and download times associated with traditional web-based utilities.</p><p>Furthermore, our tool is built with <strong>Offline Resilience</strong> in mind. Once you have navigated to the PDF to Image page, you can fully disconnect from the internet and continue processing files.</p>",
  howTo: [
    "Select and upload the PDF you wish to convert.",
    "Choose your desired output format (JPG or PNG) and select the pages you want to extract.",
    "Allow a few seconds for the local engine to render the pages securely within your browser.",
    "Review the gallery of converted images that will appear in the results section below.",
    "Select individual images you wish to keep, or choose the 'Download All' option to save them as a ZIP file."
  ],
  examples: [
    {
      label: "Convert a PDF Report to Images",
      description: "Converts each page of a corporate PDF report into high-resolution PNG images.",
      input: "A 5-page PDF report.",
      output: "5 individual PNG files ready for download."
    }
  ],
  faq: [
    {
      question: "Are my documents uploaded to a server to convert to images?",
      answer: "No. We utilize a strict Zero-Server-Upload design. Your files are processed entirely on your device, ensuring maximum privacy."
    },
    {
      question: "Can I use the PDF to Image tool without an internet connection?",
      answer: "Yes, the tool features complete Offline Resilience. You can use it without an internet connection once the page is fully loaded."
    }
  ],
  useCases: [
    "Graphic designers needing to convert a PDF into individual image layers.",
    "Marketing teams retrieving product images from older promotional PDFs where the original image files have been lost."
  ],
  commonErrors: [
    {
      error: "Browser runs out of memory",
      fix: "If you are processing a massive PDF with hundreds of pages, try splitting the PDF into smaller sections first, or close other memory-intensive browser tabs."
    }
  ]
};
