import { ToolContent } from '../../registry/types';

export const audioConverterContent: ToolContent = {
  detailedDescription: "Convert your audio files between popular formats like WAV and MP3 entirely in your browser. No files are uploaded to any server, ensuring total privacy for your sensitive recordings.",
  howTo: [
    "Upload your source audio file.",
    "Select the desired output format (MP3 or WAV).",
    "Click 'Convert' to process the file locally.",
    "Download the converted file once ready."
  ],
  faq: [
    {
      question: "Is there a limit on file size?",
      answer: "The limit is determined by your device's available memory. For the best experience, we recommend files under 50MB."
    },
    {
      question: "Which formats can I convert to?",
      answer: "Currently, we support high-quality MP3 (128kbps) and lossless WAV output."
    }
  ],
  useCases: [
    "Converting voice memos for better compatibility",
    "Compressing large WAV files into smaller MP3s",
    "Extracting audio from supported media containers",
    "Pre-processing audio for web or application use"
  ]
};
