export const faceBlurContent = {
    detailedDescription: `
<p>The AI Face Blur & Privacy Shield automatically detects human faces in photos and applies smooth Gaussian blur or privacy pixelation. Powered by local YOLOv8 ONNX object detection, it protects personal privacy, identity, and sensitive PII data in photos prior to online publication or document sharing.</p>

<p>Privacy regulations (such as GDPR, CCPA, and HIPAA) require redacting faces and identifiable features in public photos. KaruviLab's detection engine runs 100% locally inside your browser—ensuring sensitive photos of children, bystanders, or confidential documents are never uploaded to third-party servers.</p>

<p>You can customize the privacy mode (Gaussian Blur, Heavy Pixelate, or Blackout Box), adjust blur radius intensity, and manually tweak bounding box selections before exporting high-resolution privacy-compliant images.</p>
`,
    howTo: [
        "<strong>Upload Image:</strong> Select or drop a photo containing faces or identities.",
        "<strong>Auto-Detect Faces:</strong> The AI model scans the image tensor and identifies facial bounding boxes.",
        "<strong>Choose Blur Style:</strong> Select Gaussian Blur, Pixelation, or Solid Blackout Redaction.",
        "<strong>Download Image:</strong> Save your privacy-protected image to your local device."
    ],
    faq: [
        { question: "Is my photo sent to any cloud server?", answer: "No. All facial recognition and blurring occurs entirely in your browser using local ONNX inference." },
        { question: "Can the blur be undone by someone else?", answer: "No. The output image is flattened into a permanent raster PNG, permanently destroying underlying face pixels." },
        { question: "Does it detect multiple faces in crowd photos?", answer: "Yes. The YOLOv8 object detector supports multi-object detection across high-density crowd photos." },
        { question: "What privacy styles are available?", answer: "Gaussian Blur, Heavy Pixelate, and Solid Blackout Box." },
        { question: "Can I adjust the blur intensity?", answer: "Yes, you can adjust blur radius slider from 5px to 50px." }
    ],
    examples: [
        { label: "Public Crowd Photo", input: "Street photograph with bystanders", output: "Anonymized Crowd Photo", description: "Blurring background bystanders for blog publication." },
        { label: "ID & Document Photo", input: "ID card or passport photo", output: "Redacted Document", description: "Obscuring face and photo details for identity verification privacy." },
        { label: "Child Privacy Protection", input: "Family vacation photo", output: "Privacy Shielded Photo", description: "Protecting minors' identity before sharing photos on social media." }
    ]
};
export default faceBlurContent;
