import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import HeicConverterClientWrapper from './HeicConverterClientWrapper';

const toolId = 'heic-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="HEIC to JPG"
      description="Convert Apple HEIC photos to standard JPEG locally in your browser"
      category={cat}
      toolId={toolId}
    >
      <HeicConverterClientWrapper />

      <LearningHub title="Understanding Apple's HEIC Format">
        
        <LearningSection type="architecture" title="Not Just an Image">
          <p>When you take a photo on an iPhone, Apple doesn't save it as a traditional JPEG. To save space, they use <strong>HEIC</strong> (High Efficiency Image Container).</p>
          <p className="mt-2">Similar to the modern AVIF format, an HEIC image is actually just a single still frame encoded using a highly-efficient video codec called <strong>HEVC (H.265)</strong>.</p>
        </LearningSection>
        
        <LearningSection type="algorithm" title="Patents and Licensing">
          <p>Why don't all browsers just support HEIC natively? <strong>Patents</strong>.</p>
          <p className="mt-2">The HEVC compression algorithm is heavily patented by multiple corporations. If Google added native HEIC support to Chrome, or Mozilla to Firefox, they would have to pay millions in licensing fees. Apple pays these fees, which is why HEIC works flawlessly on Macs and iPhones, but fails on Windows or the open web.</p>
        </LearningSection>

        <LearningSection type="api" title="WebAssembly Decoding">
          <p>To bypass this limitation without uploading your private photos to a server, this tool uses a compiled <strong>WebAssembly (WASM)</strong> decoder.</p>
          <p className="mt-2">We run a complex C++ decompression algorithm directly inside your browser's secure sandbox. It mathematically decodes the proprietary HEVC video frame back into raw RGB pixels, which we then easily re-encode into an open, royalty-free format like JPEG or PNG using standard browser APIs.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does an HEIC file fail to open natively in Chrome or Firefox?",
                options: [
                  "Because it is too large for the browser to process.",
                  "Because it relies on the patented HEVC (H.265) video codec, and browser vendors do not want to pay the expensive licensing fees to include the decoder.",
                  "Because it is an older, obsolete format.",
                  "Because Apple actively blocks browsers from reading it."
                ],
                correctIndex: 1,
                explanation: "Format support is often dictated by legal and financial constraints, not just technical ones. Web browsers refuse to pay HEVC patent pools."
              },
              {
                question: "How does this tool decode HEIC files if the browser natively refuses to?",
                options: [
                  "It sends the file to a cloud server to convert it.",
                  "It downloads an executable virus to the user's computer.",
                  "It uses WebAssembly (WASM) to run a custom C++ decoder directly inside the web page.",
                  "It tricks the browser into thinking it is a PNG."
                ],
                correctIndex: 2,
                explanation: "WebAssembly allows developers to compile complex C++ libraries (like libheif) and run them securely inside the browser, filling in the gaps of missing native APIs."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
