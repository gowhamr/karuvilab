import { ToolContent } from '../../registry/types';

export const videoMetadataContent: ToolContent = {
  detailedDescription: "Instantly analyze your video files to view resolution, codec, bitrate, and other technical metadata. This tool runs entirely in your browser using native APIs, meaning no data is ever uploaded or processed on a server.",
  howTo: [
    "Select or drop your video file.",
    "Wait a moment while the browser analyzes the file header.",
    "Review the detailed technical report, including codec and average bitrate.",
    "Copy the data as JSON or export it for your records."
  ],
  faq: [
    {
      question: "Which files can I analyze?",
      answer: "Most browser-supported containers like MP4, WebM, and MOV are fully supported. Some raw streams might show partial information."
    },
    {
      question: "Is my video uploaded?",
      answer: "No. The analysis happens locally. We only read the metadata chunks required to show you the technical info."
    }
  ],
  useCases: [
    "Checking the exact resolution of a video file",
    "Verifying video codecs for compatibility",
    "Analyzing bitrate to optimize storage",
    "Troubleshooting unplayable or corrupted video files"
  ]
};
