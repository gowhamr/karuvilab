import { ToolContent } from '../../registry/types';

export const imageCompress: ToolContent = {
  detailedDescription: `
    <p>The Image Compressor is a powerful, browser-based utility designed to reduce image file sizes without compromising visual quality. Whether you are a web developer looking to speed up a website, a photographer prepping images for a portfolio, or just a user needing to shrink photos for email attachments, this tool offers the precise control you need.</p>
    
    <p>Unlike many online tools that force you to upload your sensitive images to a remote server, our Image Compressor performs every operation locally. Because your files never leave your device, you can compress private photos or confidential documents with absolute peace of mind. By leveraging advanced HTML5 Canvas re-encoding and adjustable quality parameters, you get the optimal balance between performance and fidelity.</p>

    <p>The tool supports a wide array of formats, including JPEG, PNG, and WebP, and allows you to preview the results in real-time. This ensures that you can find the perfect 'sweet spot' where your file size is significantly smaller but your image remains sharp and crisp. Perfect for achieving high Google PageSpeed scores, reducing server storage costs, or simply managing your device's limited storage space.</p>
  `,
  howTo: [
    "<strong>Upload:</strong> Drag and drop your image file onto the main upload area or click to select from your device.",
    "<strong>Customize:</strong> Use the quality slider to find your preferred balance. Moving the slider left reduces file size drastically, while moving it right increases image fidelity.",
    "<strong>Compare:</strong> Utilize the split-screen preview to see the original and compressed images side-by-side.",
    "<strong>Download:</strong> Click the 'Download' button to save your newly optimized image to your local storage.",
  ],
  faq: [
    {
      question: "Is this tool truly private?",
      answer: "Yes. KaruviLab tools are built on a local-first, zero-upload architecture. Your image data is processed entirely in your browser's memory and is never transmitted to or stored on any server.",
    },
    {
      question: "Which formats are supported?",
      answer: "We support JPEG, PNG, and WebP input. The tool allows you to convert and export images into optimized JPEG or WebP formats, depending on your needs.",
    },
    {
      question: "Why isn't my PNG getting smaller?",
      answer: "PNG is a 'lossless' format, which means it cannot be aggressively compressed like JPEG without losing image data. If you need smaller file sizes, we recommend converting your PNG to WebP format using our tool.",
    },
    {
      question: "Is there a maximum image size?",
      answer: "To ensure a smooth experience, we recommend images under 20MB. Very large files may hit browser memory limitations. If you encounter issues, try resizing the image to smaller dimensions first.",
    },
  ],
  useCases: [
    "Optimizing e-commerce product photos for faster load times.",
    "Reducing high-resolution camera shots for web-based portfolios.",
    "Shrinking screenshots for email attachments or forum posts.",
    "Passing Core Web Vitals performance benchmarks for SEO.",
  ],
  examples: [
    {
      input: "High-res JPEG (5MB)",
      output: "Compressed JPEG (800KB)",
      description: "Reducing a DSLR photo by 80% while retaining nearly indistinguishable visual quality for web use."
    },
    {
      input: "PNG Screenshot (2MB)",
      output: "WebP (300KB)",
      description: "Converting a lossless PNG to WebP can significantly reduce file size while maintaining excellent quality."
    }
  ],
  commonErrors: [
    {
      error: "Compressed file looks slightly blurry",
      fix: "Your quality slider may be set too low. Try moving the quality parameter higher (e.g., from 60% to 80%) to retain more detail.",
    },
    {
      error: "Transparency is lost",
      fix: "JPEG format does not support transparency. If you need to keep transparent backgrounds, ensure you are exporting to PNG or WebP.",
    },
  ],
  alternatives: ["Squoosh.app", "TinyPNG", "ImageOptim (macOS desktop tool)"],
};
