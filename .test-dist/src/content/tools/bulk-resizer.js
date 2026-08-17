export const bulkResizer = {
    detailedDescription: "Resize multiple images at once directly in your browser. Maintain aspect ratio, set custom width/height, and process dozens of files in seconds. Uses the Canvas API for high-performance client-side resizing — your private photos never leave your device.",
    howTo: [
        "Drag and drop multiple images or click 'Select Files'.",
        "Set your target dimensions or percentage scale.",
        "Choose whether to 'Fit', 'Fill', or 'Stretch' the images.",
        "Click 'Process All' and download the resized images in a ZIP file.",
    ],
    faq: [
        {
            question: "How many images can I process at once?",
            answer: "You can process up to 50 images at a time. The limit depends on your browser's available memory.",
        },
        {
            question: "Does it lower image quality?",
            answer: "Resizing naturally involves resampling. We use high-quality interpolation to ensure your images stay sharp while reducing dimensions.",
        },
        {
            question: "Is there a file size limit?",
            answer: "We recommend individual files be under 20MB for the best performance on mobile and desktop browsers.",
        },
    ],
    useCases: [
        "Preparing product images for a web gallery",
        "Batch resizing photos for email attachments",
        "Creating thumbnails for a blog or portfolio",
        "Normalizing image sizes for a social media campaign",
    ],
    alternatives: ["BIRME (Bulk Image Resizing Made Easy)", "BulkResizePhotos.com", "Adobe Express Batch Resize"],
};
