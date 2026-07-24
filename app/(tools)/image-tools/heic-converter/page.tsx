import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
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
    </ToolShell>
  );
}
