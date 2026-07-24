import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import WebPConverterClientWrapper from './WebPConverterClientWrapper';

const toolId = 'webp-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell title="WebP Converter" description="Convert any image to the highly optimized WebP format" category={cat} toolId={toolId}

      content={{
        detailedDescription: "Convert your images to the modern WebP format for superior compression and faster page loads. This browser-based tool allows you to convert JPEG, PNG, and other formats into highly optimized WebP images instantly without any server uploads.",
        useCases: ["Optimizing images for web development","Reducing photo file sizes for storage","Improving website page speed scores","Converting heavy PNGs to lightweight WebP","Batch exporting WebP assets securely offline"],
        howTo: ["Upload one or more images into the drop zone.","Select the desired compression quality (e.g., 80%).","Preview the estimated size savings.","Click 'Convert' to process the images.","Download the optimized WebP files instantly."],
        faq: [{"question":"What is WebP?","answer":"WebP is a modern image format that provides superior lossless and lossy compression for images on the web, often reducing sizes by 30% compared to JPEG."},{"question":"Does this tool upload my images?","answer":"No, all conversions are securely executed in your local browser."},{"question":"Does WebP support transparency?","answer":"Yes, WebP supports transparent backgrounds, making it a great replacement for heavy PNG files."},{"question":"Will this run on mobile browsers?","answer":"Yes, KaruviLab works entirely offline on modern mobile and desktop browsers."},{"question":"Are the conversions lossless?","answer":"You can choose the quality level. 100% quality is nearly lossless, while lower values introduce lossy compression for smaller file sizes."}],
        relatedTools: ["avif-converter","image-compressor","batch-image-converter"]
      }}
>
      <WebPConverterClientWrapper />
    </ToolShell>
  );
}
