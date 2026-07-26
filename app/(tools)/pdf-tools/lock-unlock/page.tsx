import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import LockUnlockPdfClientWrapper from './LockUnlockPdfClientWrapper';

const toolId = 'lock-unlock';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Lock / Unlock PDF"
      description="Add password protection to a PDF or remove it — all in your browser."
      category={cat}
      toolId={toolId}
    >
      <LockUnlockPdfClientWrapper />

      <LearningHub title="Understanding PDF Encryption Protocols">
        
        <LearningSection type="architecture" title="The Dual-Password System">
          <p>The PDF specification (ISO 32000) defines a unique dual-password security system. A single PDF can have two different passwords, granting different levels of access.</p>
        </LearningSection>
        
        <LearningSection type="security" title="User vs Owner Passwords">
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>The User Password (Open Password):</strong> This is the password required just to open and view the document. If a PDF has a User Password, the entire file (text, images, and metadata) is mathematically encrypted. <strong>You cannot bypass this.</strong> Without the password, the data is just random noise.</li>
            <li><strong>The Owner Password (Permissions Password):</strong> This password is used to restrict what you can do <em>after</em> you open the file. It controls a 32-bit integer flag inside the PDF called the <strong>P (Permissions) flag</strong>. This flag dictates whether printing, copying text, or editing the document is allowed.</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="The Flaw in Permissions">
          <p>If a PDF only has an <strong>Owner Password</strong> (meaning you can read it, but can't print it), this tool can strip those restrictions instantly.</p>
          <p className="mt-2">Because the file is readable, the PDF parser can read the internal object streams. The "restrictions" (like blocking the print button) are entirely enforced by the PDF viewer software (like Adobe Acrobat) obeying the Permissions flag on the honor system.</p>
          <p className="mt-2">Our tool simply parses the readable PDF, drops the encryption dictionary entirely, and saves a fresh copy of the data without the restriction flags.</p>
        </LearningSection>

        <LearningSection type="algorithm" title="Encryption Standards">
          <p>Historically, PDFs used <strong>RC4 (40-bit & 128-bit)</strong>, which is now considered cryptographically broken and obsolete.</p>
          <p className="mt-2">The modern standard used by this tool when locking PDFs is <strong>AES-256</strong> (Advanced Encryption Standard). As long as you choose a strong password, an AES-256 encrypted PDF cannot be brute-forced by any modern computer.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Can this tool (or any tool) instantly unlock a PDF that requires a password just to open and view the text?",
                options: [
                  "Yes, by stripping the Permissions flag.",
                  "Yes, by exploiting an Adobe vulnerability.",
                  "No. If it has a User (Open) Password, the actual contents are mathematically encrypted and cannot be bypassed.",
                  "Yes, but only on a Mac."
                ],
                correctIndex: 2,
                explanation: "An Open password encrypts the actual bytes of the file. Without the password to generate the decryption key, the file is unreadable noise."
              },
              {
                question: "How does 'Owner Password' printing restriction actually work?",
                options: [
                  "The printer driver blocks the file.",
                  "The PDF viewer reads a 'Permissions Flag' and voluntarily disables its own Print button.",
                  "The file is encrypted specifically for the printer.",
                  "The file is converted to images."
                ],
                correctIndex: 1,
                explanation: "Permission restrictions rely on the PDF viewer acting in good faith. If the viewer ignores the flag (or if a tool like ours rewrites the file without the flag), the restrictions disappear."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
