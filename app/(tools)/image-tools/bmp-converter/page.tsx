import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import BmpConverterClientWrapper from './BmpConverterClientWrapper';

const toolId = 'bmp-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="BMP Converter" description="Convert images to the uncompressed BMP format" category={cat} toolId={toolId}

      content={{
        detailedDescription: "Convert legacy BMP (Bitmap) images to modern formats, or generate strict BMP files for specialized applications. Perform lossless conversions entirely offline with total data privacy.",
        useCases: ["Converting old Windows bitmaps for the web","Generating BMPs for embedded systems","Reducing file sizes of uncompressed BMPs","Standardizing legacy assets","Offline secure format conversion"],
        howTo: ["Upload your image.","Select BMP as the output format if generating one, or select PNG/JPEG if converting from BMP.","Preview the image.","Download the converted file securely.","No server upload required."],
        faq: [{"question":"Why use BMP today?","answer":"BMP is largely obsolete for the web, but it is still required by certain legacy desktop software, industrial systems, and embedded microcontrollers."},{"question":"Is BMP lossless?","answer":"Yes, standard BMP files are uncompressed and lossless, which is why they have very large file sizes."},{"question":"Can I add transparency to BMP?","answer":"Standard 24-bit BMP does not support transparency. Alpha channels require 32-bit BMP, which isn't universally supported."},{"question":"Are my files uploaded?","answer":"Never. All parsing and encoding happens locally in your browser."},{"question":"Can I convert BMP to WebP?","answer":"Yes, simply select WebP as the output format to vastly reduce the file size."}],
        relatedTools: ["tiff-converter","ico-generator","webp-converter"]
      }}
>
      <BmpConverterClientWrapper />
    </ToolShell>
  );
}
