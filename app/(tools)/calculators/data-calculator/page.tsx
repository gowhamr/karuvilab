import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import DataCalculatorWrapper from "./DataCalculatorWrapper";

const toolId = "data-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function DataCalculatorPage() {
  return (
    <ToolShell
      title="Advanced Data Calculator"
      description="Convert data units (SI/IEC), calculate transfer times, estimate storage costs, and generate secure local checksums."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Understanding the difference between decimal (SI) and binary (IEC) units is crucial for data accuracy. Manufacturers often use decimal units (e.g., 1 KB = 1000 Bytes), while operating systems typically use binary units (e.g., 1 KiB = 1024 Bytes). Our calculator handles both with precision.",
        useCases: [
          "Accurately converting hard drive sizes (SI to IEC)",
          "Estimating download and upload times for large files",
          "Calculating cloud storage costs based on data volume",
          "Verifying file integrity with local MD5 or SHA-256 hashes",
          "Planning bandwidth requirements for streaming or backups"
        ],
        howTo: [
          "Select the 'Unit Converter' to transform between bits, bytes, KB, KiB, etc.",
          "Use the 'Transfer Time' tab to estimate how long a download will take.",
          "Check the 'Storage Cost' section to compare cloud provider pricing.",
          "Drop a file into the 'Checksum' tool to generate a secure local hash.",
          "Toggle between SI (1000) and IEC (1024) standards for precise results."
        ],
        faq: [
          {
            question: "What is the difference between MB and MiB?",
            answer: "MB (Megabyte) is a decimal unit (1,000,000 bytes), while MiB (Mebibyte) is a binary unit (1,048,576 bytes). Operating systems usually report storage in MiB/GiB."
          },
          {
            question: "How do I calculate download time?",
            answer: "Divide the total file size in bits by your connection speed in bits per second. Our tool automatically accounts for protocol overhead for more realistic results."
          },
          {
            question: "Is my file safe when generating a checksum?",
            answer: "Yes. KaruviLab uses the Zero-Upload philosophy. Files are processed entirely by your browser's local Web Worker. We never see your data."
          },
          {
            question: "Which hashing algorithm should I use?",
            answer: "SHA-256 is currently the industry standard for security. MD5 and SHA-1 are faster but less secure, suitable primarily for simple error-checking."
          }
        ],
        relatedTools: ["unit-converter", "numeral-converter", "smart-converter"]
      }}
    >
      <DataCalculatorWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-storage-units"
          title="How it Works: The 1000 vs 1024 Debate"
          preview="Learn why your new '1 Terabyte' hard drive only shows up as 931 Gigabytes in Windows."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you buy a "1 Terabyte" (1 TB) hard drive and plug it into your Windows computer, Windows says it only has about 931 Gigabytes of space. Did the manufacturer cheat you?
            </p>
            <h3>SI vs IEC Standards</h3>
            <p>
              The confusion stems from two different ways of measuring data: Base-10 (Decimal) and Base-2 (Binary).
            </p>
            <ul>
              <li><strong>Hard Drive Manufacturers</strong> use the metric SI standard (Base-10). To them, "Kilo" means exactly 1,000. So, 1 Kilobyte (KB) = 1,000 bytes. 1 Megabyte (MB) = 1,000,000 bytes.</li>
              <li><strong>Operating Systems (like Windows)</strong> use binary computer logic (Base-2). Because computers work in powers of 2 (2, 4, 8, 16... 1024), to a computer, "Kilo" naturally means 1,024. So, 1 binary Kilobyte (KiB) = 1,024 bytes.</li>
            </ul>
            <h3>The IEC Standard</h3>
            <p>
              To fix this confusing terminology, the International Electrotechnical Commission (IEC) created new names for the binary units in 1998:
            </p>
            <ul>
              <li>Kilobyte (KB) = 1,000 bytes</li>
              <li>Kibibyte (KiB) = 1,024 bytes</li>
            </ul>
            <p>
              Unfortunately, while macOS adopted the correct SI terminology for marketing numbers, Windows still uses the old terminology—it labels files as "KB" or "GB" but calculates them using the 1024 binary math.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
