import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      content={{
        detailedDescription: "Seamlessly convert Apple's HEIC photos to standard JPEG or PNG formats offline. Our tool decodes HEIC files directly in your browser, ensuring your private mobile photos never touch a remote server.",
        useCases: ["Viewing iPhone photos on Windows","Uploading HEIC photos to websites that require JPEG","Converting HEIC backups securely offline","Extracting high-quality PNGs from HEIC","Standardizing family photo albums"],
        howTo: ["Drag and drop your HEIC image into the tool.","Wait a moment for the local decoder to process the file.","Choose to export as either JPEG or PNG.","Adjust the output quality if using JPEG.","Click Download to save the converted photo."],
        faq: [{"question":"Are my private iPhone photos uploaded?","answer":"No. The HEIC decoding happens securely inside your browser using WebAssembly."},{"question":"Why is HEIC not supported everywhere?","answer":"HEIC is a proprietary format based on the HEVC video codec, primarily used by Apple. Licensing restrictions prevent wide adoption."},{"question":"Can I convert Live Photos?","answer":"Currently, this tool extracts the primary still frame from the HEIC file, not the motion video."},{"question":"Does the quality degrade?","answer":"If you export as PNG, the extraction is lossless. Exporting as JPEG will apply standard compression."},{"question":"Is there a limit to file size?","answer":"Large HEIC files require browser memory. Extreme sizes may crash low-RAM devices, but typical 10MB iPhone photos work perfectly."}],
        relatedTools: ["webp-converter","image-converter","batch-image-converter"]
      }}
>
      <HeicConverterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-hevc"
          title="How it Works: The HEVC Video Codec"
          preview="Learn why Windows and Android struggle to open your iPhone photos."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you take a photo on an iPhone, Apple doesn't save it as a JPEG. To save space, they use <strong>HEIC</strong> (High Efficiency Image Container). Similar to AVIF, an HEIC image is actually just a single still frame encoded using a video codec called <strong>HEVC (H.265)</strong>.
            </p>
            <h3>Patents and Licensing</h3>
            <p>
              Why don't all browsers just support HEIC natively? <strong>Patents</strong>. The HEVC algorithm is heavily patented by multiple corporations. If Google added native HEIC support to Chrome, or Mozilla to Firefox, they would have to pay millions in licensing fees. Apple pays these fees, which is why HEIC works flawlessly on Macs and iPhones, but fails on Windows or the open web.
            </p>
            <h3>WebAssembly Decoding</h3>
            <p>
              To bypass this limitation without uploading your private photos to a server, this tool uses a compiled <strong>WebAssembly (WASM)</strong> decoder. We run the complex C++ decompression algorithm directly inside your browser's secure sandbox. It mathematically decodes the proprietary HEVC video frame back into raw RGB pixels, which we then easily re-encode into an open, royalty-free format like JPEG or PNG.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
