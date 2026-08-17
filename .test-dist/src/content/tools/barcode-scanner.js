export const barcodeScannerContent = {
    detailedDescription: "<p>The <strong>Barcode Scanner</strong> tool is a highly secure, high-performance utility designed to decode barcodes directly within your browser. By upholding KaruviLab's <strong>Privacy-First</strong> and <strong>Zero-Server-Upload</strong> mandates, this tool guarantees that the images you capture or upload are never sent to external servers. Your camera feed and image data remain strictly on your local machine.</p><p>We leverage advanced Web APIs to achieve lightning-fast <strong>Local-First Execution</strong>. This means the barcode detection algorithm runs entirely using your device's processing power, avoiding the latency and security risks of cloud-based alternatives. Whether you are scanning shipping labels, product codes, or inventory tags, you can trust that your sensitive operational data is completely protected from unauthorized access.</p><p>Moreover, this application boasts full <strong>Offline Resilience</strong>. Once you have accessed the tool, you can disconnect from the network and continue scanning barcodes effortlessly. This makes it an ideal solution for warehouse environments, remote fieldwork, or any situation where internet connectivity is unreliable or nonexistent.</p>",
    howTo: [
        "Click the 'Start Camera' button to allow the tool access to your device's webcam, or choose to upload an image file containing a barcode.",
        "If using the camera, align the barcode within the designated scanning area on your screen.",
        "Wait a brief moment for the local engine to detect and decode the barcode data.",
        "Review the extracted information displayed in the results section below the scanner.",
        "Use the 'Copy' or 'Export' buttons to save the decoded data to your clipboard or local storage."
    ],
    examples: [
        {
            label: "Scan EAN-13 Product Code",
            description: "Reads a standard retail product barcode from an uploaded image.",
            input: "Image of a grocery item barcode.",
            output: "Decoded Result: 9780201379624"
        },
        {
            label: "Decode QR Code via Webcam",
            description: "Extracts a URL embedded in a standard QR code.",
            input: "Camera pointed at a promotional poster.",
            output: "Decoded Result: https://karuvilab.com"
        },
        {
            label: "Scan Shipping Label (Code 128)",
            description: "Decodes a complex alphanumeric tracking number from a shipping label.",
            input: "Image of a courier package barcode.",
            output: "Decoded Result: 1Z9999999999999999"
        }
    ],
    faq: [
        {
            question: "Are my images or camera feed sent to the cloud?",
            answer: "Absolutely not. We utilize a strict Zero-Server-Upload design. Your camera feed and uploaded images are processed entirely on your device."
        },
        {
            question: "Can I scan barcodes without an internet connection?",
            answer: "Yes, the tool is built with full Offline Resilience. Once loaded, it performs all local scanning operations perfectly without any network access."
        },
        {
            question: "Which barcode formats do you support?",
            answer: "We support a wide range of standard formats including QR codes, EAN-13, UPC-A, Code 128, and Code 39, depending on your browser's native capabilities."
        },
        {
            question: "Why is the camera not starting?",
            answer: "Ensure that you have granted camera permissions to your browser. If denied previously, you may need to update your browser's site settings."
        },
        {
            question: "Is this tool safe for scanning confidential inventory data?",
            answer: "Yes, because of our Privacy-First Local-First Execution model, the data never leaves your environment, making it completely secure for enterprise use."
        }
    ],
    useCases: [
        "Warehouse workers scanning inventory items in areas with poor or no Wi-Fi connectivity.",
        "Retail employees quickly verifying product codes without needing dedicated hardware.",
        "Event organizers validating attendee tickets or badges using QR codes directly from a laptop or mobile device.",
        "Consumers scanning promotional codes securely without exposing their data to tracking servers."
    ],
    commonErrors: [
        {
            error: "Barcode Not Detected",
            fix: "Ensure the barcode is well-lit, in focus, and takes up a significant portion of the image or camera feed. Avoid glare on glossy labels."
        },
        {
            error: "Camera Access Denied",
            fix: "Check your browser's security settings and ensure that KaruviLab has explicit permission to access your device's camera."
        }
    ]
};
