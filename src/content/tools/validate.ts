import { ToolContent } from '../../registry/types';

export const fileValidator: ToolContent = {
  detailedDescription:
    "Validate files against specific requirements before uploading them to government portals or applications. Check file size (KB/MB), dimensions (pixels), and MIME types instantly. The tool alerts you to common security issues and format mismatches. No files are uploaded.",
  howTo: [
    "Select a validation profile (e.g., 'Passport Seva', 'PAN Card', or 'Custom').",
    "Upload the file you want to validate.",
    "Review the pass/fail indicators for size, type, and dimensions.",
    "Follow the provided instructions to fix any failed requirements.",
  ],
  faq: [
    {
      question: "Is my document safe?",
      answer: "Yes. The validation is performed entirely using JavaScript in your browser. Your sensitive documents never leave your device.",
    },
    {
      question: "Does it support PDF validation?",
      answer: "Yes. It checks PDF page counts, file size, and basic integrity to ensure compatibility with portal uploaders.",
    },
    {
      question: "Can I create custom rules?",
      answer: "Yes. Use the 'Custom' mode to define your own size limits and allowed extensions.",
    },
  ],
  useCases: [
    "Checking passport photos for portal upload compatibility",
    "Ensuring tax documents are under the 2MB size limit",
    "Validating signatures for online application forms",
    "Verifying file extensions match the actual file content",
  ],
  alternatives: ["Online File Validator", "CheckFileType.com", "VirusTotal (for security)"],
};
