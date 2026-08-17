export const extractImagesContent = {
    detailedDescription: "<p>The <strong>Extract Images</strong> tool is a specialized, high-efficiency utility built to seamlessly pull embedded images out of documents and PDF files directly within your browser. Adhering to KaruviLab's strict <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> philosophy, this tool guarantees that your confidential documents, legal contracts, or personal files are never uploaded to any cloud server. Every single image extraction happens securely within your local environment.</p><p>By harnessing the power of <strong>Local-First Execution</strong>, the tool parses complex file structures in milliseconds using your device's native processing capabilities. This architecture not only eliminates the security vulnerabilities inherent in online converters but also drastically reduces processing time. You can extract dozens of high-resolution images instantly, avoiding the slow upload and download times associated with traditional web-based utilities.</p><p>Furthermore, our tool is built with <strong>Offline Resilience</strong> in mind. Once you have navigated to the Extract Images page, you can fully disconnect from the internet and continue processing files. This offline capability ensures that professionals working in high-security environments, or those with spotty internet connections, can maintain their workflow without interruption.</p>",
    howTo: [
        "Select and upload the PDF or document file containing the embedded images you wish to extract.",
        "Allow a few seconds for the local engine to parse the file structure securely within your browser.",
        "Review the gallery of extracted images that will appear in the results section below.",
        "Select individual images you wish to keep, or choose the 'Download All' option to save them as a ZIP file.",
        "Verify that the images have been saved securely to your device's local storage."
    ],
    examples: [
        {
            label: "Extract Photos from a PDF Report",
            description: "Pulls out high-resolution photographs embedded within an annual corporate PDF report.",
            input: "A 50-page corporate PDF report containing 12 images.",
            output: "12 individual JPEG/PNG files extracted and ready for download."
        },
        {
            label: "Isolate Charts from Presentations",
            description: "Extracts graphical charts and diagrams from a saved document format.",
            input: "A slide deck saved as a PDF containing vector charts.",
            output: "Original image files of the charts extracted without quality loss."
        },
        {
            label: "Retrieve Scanned Document Pages",
            description: "Extracts the original scanned image files that were bundled together into a single PDF.",
            input: "A scanned legal document containing 5 page images.",
            output: "5 individual image files corresponding to the scanned pages."
        }
    ],
    faq: [
        {
            question: "Are my documents uploaded to a server to extract the images?",
            answer: "No. We utilize a strict Zero-Server-Upload design. Your files are processed entirely on your device, ensuring maximum privacy."
        },
        {
            question: "Can I use the Extract Images tool without an internet connection?",
            answer: "Yes, the tool features complete Offline Resilience. You can use it without an internet connection once the page is fully loaded."
        },
        {
            question: "Will the extracted images lose their original quality?",
            answer: "No, our Local-First Execution engine extracts the raw image data exactly as it was embedded in the document, preserving the original resolution and quality."
        },
        {
            question: "What file formats are supported for the extracted images?",
            answer: "The tool typically extracts images in their native embedded formats, such as JPEG, PNG, or TIFF, depending on how they were originally saved in the document."
        },
        {
            question: "Is there a limit to the size of the PDF I can process?",
            answer: "Because processing happens locally, the limit is based on your device's memory. It can easily handle large documents with dozens of high-resolution images."
        }
    ],
    useCases: [
        "Graphic designers needing to recover original high-resolution assets from a client's flattened PDF brochure.",
        "Researchers extracting scientific charts and diagrams from published academic papers for citation and review.",
        "Legal professionals separating scanned evidence photos from a large, consolidated digital case file.",
        "Marketing teams retrieving product images from older promotional PDFs where the original image files have been lost."
    ],
    commonErrors: [
        {
            error: "No images found in document",
            fix: "Ensure the document actually contains raster images (like JPEGs or PNGs). The tool cannot extract vector graphics or text that merely looks like an image."
        },
        {
            error: "Browser runs out of memory",
            fix: "If you are processing a massive PDF with hundreds of huge images, try splitting the PDF into smaller sections first, or close other memory-intensive browser tabs."
        }
    ]
};
