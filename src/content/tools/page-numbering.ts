import { ToolContent } from '../../registry/types';

export const pageNumberingContent: ToolContent = {
  detailedDescription: "<p>The <strong>Page Numbering</strong> tool is an essential document formatting utility designed to seamlessly stamp page numbers onto your PDFs directly in your browser. Firmly rooted in KaruviLab's <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> philosophy, this tool guarantees that your academic papers, legal briefs, and corporate reports never leave your device. All document modifications are executed securely within your local environment.</p><p>By leveraging robust <strong>Local-First Execution</strong>, the Page Numbering tool parses and updates your PDFs with blazing speed. You can customize the positioning, formatting, and starting number of your pages instantly, without waiting for slow cloud uploads or dealing with queued processing delays. This completely local workflow eliminates the risk of exposing sensitive or proprietary document contents to third-party tracking or data harvesting.</p><p>Additionally, this tool is engineered for true <strong>Offline Resilience</strong>. Once the application is loaded, you can safely disconnect from the internet and continue formatting your documents. Whether you are finalizing a presentation on a flight or organizing legal files in an air-gapped room, the Page Numbering tool ensures your productivity remains uninterrupted and your data remains private.</p>",
  howTo: [
    "Upload the PDF document that requires page numbering.",
    "Configure the numbering settings, including the starting number, position (e.g., bottom-right), and format.",
    "Click the action button to apply the page numbers locally to the document.",
    "Preview the modified document to ensure the numbers are placed correctly.",
    "Download the updated PDF file directly to your device's local storage."
  ],
  examples: [
    {
      label: "Number an Academic Thesis",
      description: "Adds standard bottom-center page numbers to a lengthy academic document.",
      input: "A 150-page thesis PDF without page numbers.",
      output: "The same PDF with numbers 1 through 150 sequentially stamped at the bottom center."
    },
    {
      label: "Format a Legal Brief",
      description: "Applies page numbers starting from a specific digit to align with an existing case file.",
      input: "A 20-page legal brief, configured to start numbering at page 50.",
      output: "The PDF with pages numbered from 50 to 69 in the top-right corner."
    },
    {
      label: "Add Page X of Y Format",
      description: "Stamps a descriptive 'Page 1 of 10' style format to a corporate report.",
      input: "A 10-page quarterly report PDF.",
      output: "The PDF with 'Page X of 10' formatting applied to every page."
    }
  ],
  faq: [
    {
      question: "Are my documents uploaded to a server to add page numbers?",
      answer: "No. We utilize a strict Zero-Server-Upload design. Your files are processed entirely on your device, ensuring maximum privacy."
    },
    {
      question: "Can I use the Page Numbering tool without an internet connection?",
      answer: "Yes, the tool features complete Offline Resilience. You can use it without an internet connection once the page is fully loaded."
    },
    {
      question: "Can I choose where the page numbers are placed?",
      answer: "Absolutely. The tool provides options to place the numbers in various positions, such as the bottom-center, top-right, or bottom-left corners."
    },
    {
      question: "Will adding page numbers alter the original content of my PDF?",
      answer: "No, the tool simply stamps the numbers onto the existing pages without modifying your original text, images, or layout."
    },
    {
      question: "Can I skip the title page when numbering?",
      answer: "Yes, you can configure the tool to start numbering from a specific page index, effectively skipping title pages or tables of contents."
    }
  ],
  useCases: [
    "University students formatting their final dissertations according to strict academic submission guidelines.",
    "Legal professionals ensuring that court briefs have sequential, easily referenceable page numbers across multiple merged documents.",
    "Corporate administrative assistants adding professional 'Page X of Y' markers to board meeting presentations.",
    "Authors finalizing manuscripts for self-publishing by ensuring accurate pagination for the table of contents."
  ],
  commonErrors: [
    {
      error: "Numbers overlapping text",
      fix: "If the page numbers overlap with existing document content, try adjusting the margin settings or selecting a different position (e.g., top-right instead of bottom-center)."
    },
    {
      error: "Encrypted PDF Error",
      fix: "The tool cannot modify password-protected or encrypted PDFs. Please use the Unlock PDF tool first to remove the restrictions before applying page numbers."
    }
  ]
};
