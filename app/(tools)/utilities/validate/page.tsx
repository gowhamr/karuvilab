import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import FileValidatorClientWrapper from './FileValidatorClientWrapper';

const toolId = 'validate';
const cat = CATEGORIES.find(c => c.id === 'utilities');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="File Validator"
      description="Inspect file metadata, verify magic bytes against extension, and check image dimensions."
      category={cat}
      toolId={toolId}
    >
      <FileValidatorClientWrapper />

      <LearningHub title="Understanding File Signatures and Magic Bytes">
        
        <LearningSection type="architecture" title="Extensions are Just Labels">
          <p>In Windows and many desktop environments, a file's format is typically determined by its extension (e.g., <code>document.pdf</code>). The OS sees <code>.pdf</code> and assumes it should open Adobe Acrobat.</p>
          <p className="mt-2">However, an extension is literally just part of the file's name string. It provides zero cryptographic or structural guarantee about the actual binary contents of the file.</p>
        </LearningSection>
        
        <LearningSection type="security" title="What are Magic Bytes?">
          <p>To definitively determine what a file actually is, secure systems ignore the filename entirely and look at the very first few bytes of the raw binary data. These are called "Magic Bytes" or "File Signatures."</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>A real PDF file will always start with <code>25 50 44 46</code> (which translates to <code>%PDF</code> in ASCII).</li>
            <li>A real JPEG image will always start with <code>FF D8 FF E0</code>.</li>
            <li>A real ZIP archive will always start with <code>50 4B 03 04</code>.</li>
          </ul>
        </LearningSection>

        <LearningSection type="performance" title="Security Implications">
          <p>A common and highly effective tactic for malware distributors is to write a malicious Windows Executable (which always starts with the magic bytes <code>4D 5A</code>) and simply rename the file to <code>invoice.pdf.exe</code> or hide the extension.</p>
          <p className="mt-2">This tool reads the raw binary data of the file you upload, checks the first few bytes, and verifies that the Magic Signature actually matches the claimed file extension, helping you spot disguised files before execution.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you rename a text file from 'notes.txt' to 'image.jpg', what happens to its magic bytes?",
                options: [
                  "The OS automatically converts the text into JPEG magic bytes.",
                  "The magic bytes change to match a generic image.",
                  "Nothing. The binary contents (and magic bytes) remain exactly the same; only the filename label changed.",
                  "The file becomes corrupted and cannot be read."
                ],
                correctIndex: 2,
                explanation: "Renaming a file only changes its directory entry, not its binary contents. Security scanners rely on magic bytes specifically because filenames can lie."
              },
              {
                question: "Why do security systems look at Magic Bytes instead of file extensions?",
                options: [
                  "Because Magic Bytes compress the file.",
                  "Because an extension is just a text label that can be easily spoofed by malware to trick a user.",
                  "Because Magic Bytes encrypt the file contents.",
                  "Because Apple computers don't use file extensions."
                ],
                correctIndex: 1,
                explanation: "An attacker can name an executable 'harmless.txt', but they cannot change the executable's magic bytes without breaking the program."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
