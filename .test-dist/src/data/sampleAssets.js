/**
 * src/data/sampleAssets.ts
 * Centralized registry for tool sample assets and loading logic.
 */
export const SAMPLE_ASSETS = {
    // File tools — bundled static assets (located in public/samples/)
    imageCompressor: "/samples/image.jpg",
    imageResizer: "/samples/image.jpg",
    colorExtractor: "/samples/image.jpg",
    pdfMerger: ["/samples/sample-1.pdf", "/samples/sample-2.pdf"],
    pdfSplitter: "/samples/sample-1.pdf",
    pdfToWord: "/samples/sample-1.pdf",
    videoTrimmer: "/samples/sample.mp4",
    audioConverter: "/samples/sample.mp3",
    svgOptimizer: "/samples/sample.svg",
    zipExtractor: "/samples/sample.zip",
    fileValidator: "/samples/image.jpg",
    csvToJson: "/samples/sample.csv",
    // Text tools — inline strings
    jsonFormatter: '{\n  "hello": "world",\n  "count": 42,\n  "karuvi": "lab"\n}',
    wordCounter: "The quick brown fox jumps over the lazy dog. KaruviLab provides fast, private, and secure browser-native tools for everyone.",
    markdownEditor: "# Welcome to KaruviLab\n\nThis is a **Markdown** preview. You can edit this text and see the results instantly.\n\n- Local processing\n- No uploads\n- Secure",
    textCaseConverter: "the quick brown fox jumps over the lazy dog",
    base64Encoder: "Hello, KaruviLab! Secure and private tools.",
    hashGenerator: "Hello, KaruviLab! Generate MD5, SHA-256 and more.",
    fakeDataGenerator: null, // Seeded internally in the tool
    // Generator tools — seed values
    qrGenerator: "https://karuvilab.com",
    passwordGenerator: null, // Logic-based, no seed needed
};
/**
 * Utility to load a sample asset based on tool ID.
 * This function returns the raw asset which the tool then processes.
 */
export async function loadSample(toolId) {
    const asset = SAMPLE_ASSETS[toolId];
    if (!asset)
        return null;
    // If it's a string path and starts with /samples/, it might need fetching (local only)
    if (typeof asset === 'string' && asset.startsWith('/samples/')) {
        try {
            const response = await fetch(asset);
            const blob = await response.blob();
            const fileName = asset.split('/').pop() || 'sample';
            return new File([blob], fileName, { type: blob.type });
        }
        catch (e) {
            return null;
        }
    }
    // Handle arrays (e.g., PDF Merger)
    if (Array.isArray(asset)) {
        return Promise.all(asset.map(async (path) => {
            const response = await fetch(path);
            const blob = await response.blob();
            const fileName = path.split('/').pop() || 'sample';
            return new File([blob], fileName, { type: blob.type });
        }));
    }
    return asset;
}
