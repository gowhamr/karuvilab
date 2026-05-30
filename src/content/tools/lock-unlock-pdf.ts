import { ToolContent } from '../../registry/types';

export const lockUnlockPdfContent: ToolContent = {
  detailedDescription: "<p>The <strong>Lock/Unlock PDF</strong> tool is an enterprise-grade security utility that empowers you to encrypt or decrypt PDF documents securely within your browser. Aligned with KaruviLab's uncompromising <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> principles, this tool ensures that your highly sensitive documents—such as financial records, legal contracts, and personal health information—are never exposed to external servers during the encryption or decryption process.</p><p>Driven by robust <strong>Local-First Execution</strong>, our cryptographic engine operates exclusively on your device's hardware. This means the passwords you enter and the files you process remain completely isolated within your local sandbox. You can confidently apply strong password protection or remove existing restrictions from your PDFs without fearing data interception, telemetry tracking, or cloud storage leaks.</p><p>To guarantee uninterrupted productivity in high-security scenarios, this utility offers total <strong>Offline Resilience</strong>. Once the tool has initialized in your browser, you can safely sever your internet connection and continue locking or unlocking documents. This air-gapped capability makes it the perfect solution for handling classified or highly confidential files in sensitive work environments.</p>",
  howTo: [
    "Upload the PDF document you wish to either lock with a password or unlock.",
    "Select the desired action: 'Lock PDF' to add security, or 'Unlock PDF' to remove existing protections.",
    "Enter the required password. For locking, create a strong password; for unlocking, enter the current valid password.",
    "Click the action button to process the cryptography locally on your device.",
    "Download the newly secured or decrypted PDF directly to your local file system."
  ],
  examples: [
    {
      label: "Secure a Financial Report",
      description: "Applies password protection to a sensitive financial document before sharing it.",
      input: "Unencrypted financial_Q4.pdf and a new strong password.",
      output: "A fully encrypted PDF that requires the password to be opened."
    },
    {
      label: "Remove Password from a Bank Statement",
      description: "Decrypts an officially provided bank statement for easier personal archiving.",
      input: "Encrypted bank_statement.pdf and the correct access password.",
      output: "An unencrypted version of the PDF that can be opened freely."
    },
    {
      label: "Protect Legal Contracts",
      description: "Locks a signed contract to prevent unauthorized viewing or modification.",
      input: "Signed legal_contract.pdf.",
      output: "An encrypted PDF securely locked against unauthorized access."
    }
  ],
  faq: [
    {
      question: "Are my passwords or PDF files sent to a server?",
      answer: "No. We utilize a strict Zero-Server-Upload design. Your files and passwords are processed entirely on your device, ensuring maximum privacy."
    },
    {
      question: "Can I use the Lock/Unlock PDF tool offline?",
      answer: "Yes, the tool features complete Offline Resilience. You can use it without an internet connection once the page is fully loaded."
    },
    {
      question: "Can this tool unlock a PDF if I forgot the password?",
      answer: "No. Our tool is designed for legitimate decryption and relies on standard cryptographic principles. You must know the correct password to unlock the file."
    },
    {
      question: "What level of encryption is used when locking a PDF?",
      answer: "We utilize modern, strong encryption standards (such as AES) provided by our robust local PDF processing engine to ensure your documents are secure."
    },
    {
      question: "Is there a limit to the size of the PDF I can lock or unlock?",
      answer: "Because processing happens locally, the limit is based on your device's memory. It easily handles large, multi-page documents securely."
    }
  ],
  useCases: [
    "HR professionals encrypting employee tax documents and payroll records before distributing them via email.",
    "Individuals removing passwords from their monthly utility bills so they can easily merge them into a personal archive.",
    "Lawyers securing confidential case files to ensure that only authorized parties with the password can review the evidence.",
    "Freelancers locking their invoice PDFs to prevent accidental modifications by clients during the payment process."
  ],
  commonErrors: [
    {
      error: "Incorrect Password Error",
      fix: "When unlocking a PDF, ensure you have typed the password exactly as it was created, paying close attention to case sensitivity and special characters."
    },
    {
      error: "Corrupted PDF File",
      fix: "If the tool fails to process the file, verify that the PDF is not already corrupted. Try opening the original file in a standard PDF viewer to confirm its integrity."
    }
  ]
};
