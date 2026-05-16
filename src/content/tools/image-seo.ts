import { ToolContent } from '../../registry/types';

export const imageSeo: ToolContent = {
  detailedDescription:
    "Optimise your images for search engines by generating descriptive, SEO-friendly filenames and alt text. Convert generic filenames like 'IMG_1234.jpg' into keyword-rich strings like 'blue-running-shoes-mesh.jpg' to improve Google Image indexing. Runs 100% locally.",
  howTo: [
    "Upload your image to the tool.",
    "Enter the primary keyword or description of the image content.",
    "The tool generates an SEO-friendly filename and suggested alt text.",
    "Download the image with the new filename or copy the alt text.",
  ],
  faq: [
    {
      question: "Why is filename SEO important?",
      answer: "Search engines use filenames as a primary signal to understand image content. Descriptive names help your images rank in image search results.",
    },
    {
      question: "What makes a good alt text?",
      answer: "Good alt text is descriptive, concise, and includes relevant keywords without 'keyword stuffing'. It should accurately describe the image for screen readers.",
    },
    {
      question: "Does this tool resize my image?",
      answer: "This tool focuses on filenames and metadata. For resizing, use our Image Resizer or Compressor tools.",
    },
  ],
  useCases: [
    "Renaming product photos for an e-commerce store",
    "Preparing blog post images for better search rankings",
    "Ensuring accessibility compliance with accurate alt text",
    "Batch processing portfolio images with consistent naming",
  ],
  alternatives: ["Squoosh (for compression)", "TinyPNG", "Keyword Tool for Images"],
};
