export const imageResizer = {
    detailedDescription: "Resize images to exact pixel dimensions or by a percentage scale using the browser's Canvas API. Optionally lock the aspect ratio to prevent distortion. Supports JPEG, PNG, and WebP. No image data is uploaded — everything is processed locally.",
    howTo: [
        "Upload your image using the file picker or drag-and-drop.",
        "Enter the desired width and/or height in pixels.",
        "Toggle 'Lock aspect ratio' to resize proportionally.",
        "Click 'Resize' to process the image.",
        "Download the resized image.",
    ],
    faq: [
        {
            question: "Can I upscale an image?",
            answer: "Yes, but upscaling (increasing dimensions beyond the original) will reduce sharpness because the browser interpolates pixels. There is no AI upscaling.",
        },
        {
            question: "What interpolation method is used?",
            answer: "The browser's default canvas interpolation, which is bilinear. It produces smooth results for downscaling and acceptable results for moderate upscaling.",
        },
        {
            question: "Does resizing preserve EXIF metadata?",
            answer: "No. Canvas-based processing strips EXIF data (orientation, GPS, camera info). If metadata is important, use a desktop tool like ImageMagick.",
        },
    ],
    useCases: [
        "Resizing a profile photo to the exact dimensions required by a platform",
        "Reducing image dimensions before uploading to a CMS",
        "Creating thumbnail images for a gallery",
        "Preparing images at multiple resolutions for responsive design",
    ],
    commonErrors: [
        {
            error: "Resized image appears stretched",
            fix: "Enable 'Lock aspect ratio' before resizing, or only enter one dimension and let the other calculate automatically.",
        },
        {
            error: "Image appears rotated after resizing",
            fix: "The original image has an EXIF orientation tag that the canvas ignores. Rotate manually using the rotation tool before resizing.",
        },
    ],
    alternatives: ["Squoosh.app", "Bulk Image Resizer", "GIMP"],
};
