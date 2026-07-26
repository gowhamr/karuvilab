
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
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
    >
      <DataCalculatorWrapper />

      <LearningHub title="Understanding Data Units">
        
        <LearningSection type="architecture" title="The 1000 vs 1024 Debate">
          <p>When you buy a "1 Terabyte" (1 TB) hard drive and plug it into your Windows computer, Windows says it only has about 931 Gigabytes of space. Did the manufacturer cheat you?</p>
          <p className="mt-2">The confusion stems from two different ways of measuring data: Base-10 (Decimal) and Base-2 (Binary).</p>
        </LearningSection>
        
        <LearningSection type="standards" title="SI vs IEC Standards">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Hard Drive Manufacturers</strong> use the metric SI standard (Base-10). To them, "Kilo" means exactly 1,000. So, 1 Kilobyte (KB) = 1,000 bytes. 1 Megabyte (MB) = 1,000,000 bytes.</li>
            <li><strong>Operating Systems (like Windows)</strong> use binary computer logic (Base-2). Because computers work in powers of 2 (2, 4, 8, 16... 1024), to a computer, "Kilo" naturally means 1,024. So, 1 binary Kilobyte (KiB) = 1,024 bytes.</li>
          </ul>
          <p className="mt-2">To fix this terminology conflict, the International Electrotechnical Commission (IEC) created new names for the binary units in 1998: Kilobyte (KB) = 1,000 bytes, while <strong>Kibibyte (KiB)</strong> = 1,024 bytes.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Windows UX Problem">
          <p>While macOS adopted the correct SI terminology for marketing numbers (showing exactly 1TB when you plug in a 1TB drive), Windows still uses the old, confusing terminology.</p>
          <p className="mt-2">Windows labels files as "KB" or "GB" in the UI, but it actually calculates their sizes using the 1024 binary math (KiB/GiB). This is why storage drives always appear "smaller" when formatted in Windows.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does a 1 TB hard drive show up as approximately 931 GB in Windows?",
                options: [
                  "Because the operating system reserves 69 GB for system files.",
                  "Because manufacturers measure 1 TB as 1,000,000,000,000 bytes (Base-10), but Windows calculates Gigabytes using Base-2 (powers of 1024).",
                  "Because formatting the drive destroys about 7% of the disk sectors.",
                  "Because Windows compresses the files automatically."
                ],
                correctIndex: 1,
                explanation: "The math simply doesn't align. 1,000,000,000,000 bytes divided by (1024 * 1024 * 1024) equals exactly 931.32 Gigabytes (technically Gibibytes)."
              },
              {
                question: "What does the 'i' stand for in units like MiB or GiB?",
                options: [
                  "International",
                  "Internal",
                  "Binary (e.g. Mebibyte, Gibibyte) - explicitly denoting Base-2 math (1024).",
                  "Integrated"
                ],
                correctIndex: 2,
                explanation: "The IEC added the 'i' to create distinct terms (Kibibyte, Mebibyte) to separate computer binary math (1024) from standard metric math (1000)."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
