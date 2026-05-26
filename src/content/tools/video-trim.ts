import { ToolContent } from '../../registry/types';

export const videoTrimContent: ToolContent = {
  detailedDescription: "Cut and trim your videos locally without any server-side processing. Our tool uses browser-native APIs to ensure your data stays 100% private and the operation is near-instant.",
  howTo: [
    "Select or drop your video file (MP4, WebM, or MOV).",
    "Use the timeline sliders to select the start and end points for your trim.",
    "Preview the selection using the 'Play Selection' button.",
    "Click 'Trim Video' to generate the new file.",
    "Download your trimmed video instantly."
  ],
  faq: [
    {
      question: "Which formats are supported?",
      answer: "We support standard browser formats including MP4 (H.264), WebM, and MOV. Some high-bitrate or specialized formats might require a modern browser."
    },
    {
      question: "Is there any quality loss?",
      answer: "Our trimmer uses high-performance re-recording which preserves excellent visual quality while maintaining local-only processing."
    }
  ],
  useCases: [
    "Removing unwanted intros or outros from videos",
    "Creating short clips for social media sharing",
    "Cutting specific highlights from recorded meetings",
    "Trimming large video files to save storage locally"
  ]
};
