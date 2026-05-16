import { ToolContent } from '../../registry/types';

export const dataCalculator: ToolContent = {
  detailedDescription: "A comprehensive data utility suite for engineers, students, and digital professionals. Convert between SI (decimal) and IEC (binary) data units with precision, calculate exact download or upload times based on network bandwidth, estimate cloud storage costs with provider presets, and generate secure cryptographic checksums locally. Everything runs in your browser using Web Workers and the Web Crypto API, ensuring your files and data never leave your device.",
  howTo: [
    "Switch between the four tabs: Unit Converter, Transfer Time, Storage Cost, or Checksum.",
    "For Unit Converter: Enter a value and select source/target units to see the conversion instantly.",
    "For Transfer Time: Enter file size and connection speed. Adjust the overhead slider for real-world estimates.",
    "For Storage Cost: Enter data volume, monthly cost per GB, and duration. Use presets for common cloud providers like AWS S3.",
    "For Checksum: Paste text or drop a file. Select an algorithm (MD5, SHA-256, etc.) and click generate to compute the hash locally."
  ],
  faq: [
    { question: "What is the difference between MB and MiB?", answer: "MB (Megabyte) is base-10 (1,000,000 bytes), used by hardware manufacturers. MiB (Mebibyte) is base-2 (1,048,576 bytes), used by operating systems like Windows." },
    { question: "Are my files uploaded for hashing?", answer: "No. KaruviLab uses a 'Zero-Upload' architecture. All file hashing happens locally in your browser using a Web Worker and the Web Crypto API." },
    { question: "Why is network overhead important?", answer: "Protocol headers (TCP/IP) and retransmissions take up bandwidth. A 100 Mbps connection usually has 5-10% overhead, meaning actual data throughput is lower." },
    { question: "Which checksum algorithm is most secure?", answer: "SHA-256 and SHA-512 are the current industry standards for security. MD5 and SHA-1 are fast but cryptographically broken and should only be used for simple integrity checks." }
  ],
  useCases: [
    "Verifying integrity of a large ISO download using SHA-256",
    "Estimating how long a 50GB backup will take on a 10Mbps upload",
    "Converting GiB to GB to understand why a '500GB' drive shows up smaller",
    "Budgeting cloud storage costs for a medium-term data archive"
  ],
  examples: [
    { label: "1 TB to GiB", input: "1 TB", output: "931.32 GiB" },
    { label: "Transfer 1GB at 100Mbps", input: "1 GB, 100 Mbps, 5% overhead", output: "~84 seconds" }
  ],
  alternatives: ["CyberChef", "Wolfram Alpha", "AWS Storage Calculator"]
};
