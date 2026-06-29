import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import Base64ClientWrapper from './Base64ClientWrapper';

const toolId = 'base64';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to text. Supports standard and URL-safe variants."
      category={cat}
      toolId={toolId}
      content={{
        detailedDescription: "Base64 encoding is a process of converting binary data into an ASCII string format by translating it into a radix-64 representation. This is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data. This tool allows you to easily encode plain text to Base64 and decode Base64 strings back to their original form. It also supports the URL-safe variant, which replaces '+' with '-' and '/' with '_', and removes padding characters, making it suitable for use in URLs and filenames.",
        howTo: [
          "Choose whether you want to Encode or Decode using the toggle buttons.",
          "Enter your text in the input area.",
          "Optionally enable 'URL-safe Base64' for web-safe encoding.",
          "The result will appear automatically in the output section.",
          "Click the copy button to copy the result to your clipboard."
        ],
        faq: [
          {
            question: "What is Base64 encoding?",
            answer: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is often used to transmit data over protocols that only support text."
          },
          {
            question: "What is URL-safe Base64?",
            answer: "URL-safe Base64 is a variation where characters that have special meaning in URLs (like '+' and '/') are replaced with '-' and '_', and padding '=' is omitted."
          }
        ],
        relatedTools: ["hash-generator", "password-generator", "url-encoder"]
      }}
    >
      <Base64ClientWrapper />
    </ToolShell>
  );
}
