import { ToolContent } from '../../registry/types';

export const imageCrop: ToolContent = {
  detailedDescription:
    "Crop images interactively with freeform selection or locked aspect ratios (1:1, 4:3, 16:9, etc.) using a drag-and-drop crop interface. Preview the crop before applying and download the result. All cropping is done in your browser using Canvas — no upload needed.",
  howTo: [
    "Upload an image using the file picker.",
    "Drag the crop handles to define the crop area, or set a fixed aspect ratio.",
    "Fine-tune the crop region by dragging it.",
    "Click 'Apply Crop' to render the cropped image.",
    "Download the result.",
  ],
  faq: [
    {
      question: "Can I crop to an exact pixel size?",
      answer:
        "Yes. Enter exact pixel values for width and height in the crop settings to define a precise crop region.",
    },
    {
      question: "Does cropping reduce file size?",
      answer:
        "Yes, significantly. A smaller canvas contains fewer pixels and therefore produces a smaller file on export.",
    },
    {
      question: "Can I undo a crop?",
      answer:
        "The original image remains loaded. Simply adjust the crop handles and re-apply without re-uploading.",
    },
  ],
  useCases: [
    "Cropping a profile photo to a square for social media",
    "Removing unwanted borders or watermarks from an image",
    "Extracting a region of interest from a screenshot",
    "Preparing a 16:9 thumbnail for a video upload",
  ],
  commonErrors: [
    {
      error: "Crop area snaps back unexpectedly",
      fix: "If a fixed aspect ratio is locked, the crop area adjusts automatically to maintain the ratio as you resize.",
    },
    {
      error: "Cropped output is blurry",
      fix: "You may have cropped to a very small region and it appears enlarged. Increase the crop area or work with a higher-resolution source image.",
    },
  ],
  alternatives: ["Squoosh.app", "Canva", "GIMP"],
};
