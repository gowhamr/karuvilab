export const imageToPdf = {
    detailedDescription: "Combine one or more images (JPEG, PNG, WebP) into a single PDF document using pdf-lib in the browser. Arrange images in order, choose page orientation, and download the result instantly. No images are uploaded to any server.",
    howTo: [
        "Upload one or more images using the file picker.",
        "Drag images to reorder them as desired.",
        "Choose page size (A4, Letter) and orientation (portrait/landscape).",
        "Click 'Convert to PDF' and download the result.",
    ],
    faq: [
        {
            question: "Each image becomes one page?",
            answer: "Yes. Each uploaded image is placed on its own PDF page, scaled to fit the chosen page dimensions.",
        },
        {
            question: "Is image quality reduced in the PDF?",
            answer: "Images are embedded at their original resolution. If you chose a page size smaller than the image, it will be scaled down proportionally.",
        },
        {
            question: "Can I add a scanned multi-page document?",
            answer: "Yes. Upload each scanned page as a separate image and the tool will compile them into a multi-page PDF.",
        },
    ],
    useCases: [
        "Scanning physical documents by photographing each page",
        "Combining receipt photos into a single PDF for expense reporting",
        "Creating a photo album in PDF format",
        "Submitting multiple images as a single file to a portal",
    ],
    commonErrors: [
        {
            error: "Images appear rotated in the PDF",
            fix: "Rotate the images before uploading, or use an image editor to correct orientation. EXIF rotation data is not always respected.",
        },
        {
            error: "PDF file is very large",
            fix: "Compress the source images first using the Image Compress tool before converting to PDF.",
        },
    ],
    alternatives: ["ilovepdf.com", "Smallpdf.com", "Adobe Acrobat"],
};
