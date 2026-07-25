import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-encryption"
          title="How it Works: User vs Owner Passwords"
          preview="Learn the difference between the two distinct passwords in a PDF file."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The PDF specification (ISO 32000) defines a unique dual-password security system. A single PDF can have two different passwords, granting different levels of access:
            </p>
            <h3>1. The User Password (Open Password)</h3>
            <p>
              This is the password required just to open and view the document. If a PDF has a User Password, the entire file (text, images, and metadata) is mathematically encrypted. <strong>You cannot bypass this.</strong> Without the password, the data is just random noise.
            </p>
            <h3>2. The Owner Password (Permissions Password)</h3>
            <p>
              This password is used to restrict what you can do <em>after</em> you open the file. It controls a 32-bit integer flag inside the PDF called the <strong>P (Permissions) flag</strong>. This flag dictates whether printing, copying text, or editing the document is allowed. 
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-unlocking"
          title="Why can you 'Unlock' a PDF instantly?"
          preview="The security flaw in PDF permission flags."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If a PDF only has an <strong>Owner Password</strong> (meaning you can open it without typing a password, but you can't print or edit it), this tool can strip those restrictions instantly. How?
            </p>
            <p>
              Because the file is already readable, the PDF parser can read the internal object streams. The "restrictions" (like blocking the print button) are entirely enforced by the PDF viewer software (like Adobe Acrobat) reading the Permissions flag and deciding to disable its own UI buttons. 
            </p>
            <p>
              Our tool simply parses the readable PDF, drops the encryption dictionary, and saves a fresh copy of the data without the restriction flags. This is standard behavior and perfectly legal for documents you own.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-standards"
          title="Encryption Standards: AES vs RC4"
          preview="A brief history of PDF cryptographic algorithms."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <ul>
              <li><strong>RC4 (40-bit & 128-bit):</strong> Used in older PDFs (Acrobat 3 to Acrobat 6). It is now considered cryptographically broken and obsolete.</li>
              <li><strong>AES-128 & AES-256:</strong> The modern standard used by this tool when locking PDFs. AES (Advanced Encryption Standard) is military-grade encryption. As long as you choose a strong password, an AES-256 encrypted PDF cannot be brute-forced by any modern computer.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
