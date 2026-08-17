export const bgRemover = {
    detailedDescription: `
<p>The Background Remover is a specialized image editing utility that allows you to isolate subjects by removing their backgrounds with a single click. Ideal for creating product photos for e-commerce, prepping profile pictures, or designing social media graphics, this tool provides a fast and efficient way to handle common design tasks without needing complex software like Photoshop.</p>

<p>Unlike many online background removal services that upload your photos to a server for AI processing—often compromising your privacy and owning your data—KaruviLab's Background Remover operates entirely within your browser. By utilizing advanced color-matching and edge-detection algorithms locally, you can process sensitive personal or professional images with complete confidentiality. The tool is designed to work best with solid or high-contrast backgrounds.</p>

<p>Once the background is removed, you can export your subject as a transparent PNG. This ensures that you can easily overlay your images onto any other design or background. The local-first architecture also means you don't have to wait for large file uploads or downloads, making it one of the fastest ways to clean up your image assets.</p>
`,
    howTo: [
        "<strong>Upload Image:</strong> Select or drag a photo into the tool area.",
        "<strong>Click Subject:</strong> Click on the background color you want to remove.",
        "<strong>Adjust Tolerance:</strong> Use the sensitivity slider to fine-tune the removal if edges are too sharp or too soft.",
        "<strong>Preview:</strong> Check the transparency against the checkerboard grid.",
        "<strong>Download PNG:</strong> Save your subject with a transparent background to your device.",
    ],
    faq: [
        { question: "Does it work on complex backgrounds?", answer: "It works best on solid or distinct backgrounds. Busy backgrounds with many colors may require more manual tuning." },
        { question: "Is the output a PNG?", answer: "Yes, the tool exports a high-quality PNG with an alpha channel for transparency." },
        { question: "Can I remove people?", answer: "Yes, it can remove backgrounds from photos of people, provided there is sufficient contrast between the subject and the backdrop." },
        { question: "Is it as good as AI removers?", answer: "Our tool focuses on privacy and speed using deterministic algorithms. For simple to moderate tasks, it is excellent and much more secure than cloud AI." },
        { question: "Are my photos private?", answer: "100%. No image data ever leaves your browser. All processing is strictly local." }
    ],
    examples: [
        { label: "Product Photo", input: "Item on white backdrop", output: "Transparent PNG", description: "Isolating a product for an e-commerce listing." },
        { label: "Profile Pic", input: "Selfie on blue wall", output: "Isolated subject", description: "Removing a wall background for a professional headshot." },
        { label: "Logo Cleanup", input: "JPG logo with white BG", output: "Transparent Logo", description: "Converting a flat JPG logo into a usable transparent asset." }
    ]
};
