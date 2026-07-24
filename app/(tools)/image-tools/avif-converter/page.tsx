import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import AvifConverterClientWrapper from './AvifConverterClientWrapper';

const toolId = 'avif-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="AVIF Converter"
      description="Convert images to the next-gen AVIF format for maximum compression"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Convert your standard images to AVIF, the next-generation image format offering unparalleled compression. Run AVIF encoding entirely in your browser securely and offline for maximum privacy and performance.",
        useCases: ["Creating next-generation web assets","Achieving maximum image compression","Preparing ultra-lightweight portfolio images","Upgrading older WebP/JPEG libraries","Testing AVIF browser compatibility"],
        howTo: ["Select the image you wish to convert.","Adjust the compression quality setting.","Wait for the browser-based encoder to process the file.","Compare the original and new file sizes.","Download your AVIF image."],
        faq: [{"question":"What is AVIF?","answer":"AVIF is an image format derived from the AV1 video codec, offering significantly better compression than WebP and JPEG."},{"question":"Why does AVIF take longer to convert?","answer":"AVIF encoding is highly complex and requires more CPU power, but the resulting file sizes are incredibly small."},{"question":"Are my files uploaded?","answer":"Never. KaruviLab operates on a strict Zero-Server-Upload policy."},{"question":"Do all browsers support AVIF?","answer":"Most modern browsers (Chrome, Firefox, Safari) support AVIF, but older versions might not."},{"question":"Is transparency supported?","answer":"Yes, AVIF fully supports alpha channels (transparency)."}],
        relatedTools: ["webp-converter","image-compressor","image-converter"]
      }}
>
      <AvifConverterClientWrapper />
    </ToolShell>
  );
}
