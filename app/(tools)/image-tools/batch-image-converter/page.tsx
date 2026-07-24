import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import BatchImageConverterClientWrapper from './BatchImageConverterClientWrapper';

const toolId = 'batch-image-converter';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Batch Image Converter"
      description="Convert multiple images between formats in one batch operation"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Convert hundreds of images simultaneously without uploading them to a server. Our offline Batch Image Converter uses Web Workers to process massive queues in parallel, ensuring extreme speed and total privacy.",
        useCases: ["Converting camera RAWs or HEICs to JPEG","Batch exporting WebP for web performance","Standardizing asset formats for developers","Compressing a large photo gallery offline","Preparing bulk images for ML training"],
        howTo: ["Drag and drop multiple images or a folder.","Select the target output format (e.g., JPEG, WebP).","Adjust quality and optimization settings.","Click 'Start Batch'.","Download all converted images as a single ZIP file."],
        faq: [{"question":"Is there a limit to how many images I can convert?","answer":"There is no hard limit, but it depends on your device's memory. We recommend batches of up to 500 images at a time for optimal stability."},{"question":"Are my files uploaded for processing?","answer":"Never. The conversion happens entirely locally in your browser using secure Web Workers."},{"question":"Will this slow down my computer?","answer":"We use background threads (Workers) to process images, keeping your browser responsive, but CPU usage will increase during conversion."},{"question":"Can I maintain the original folder structure?","answer":"The ZIP output will contain flattened files, but we are adding structure preservation in a future update."},{"question":"Does it support WebP and AVIF?","answer":"Yes, WebP is fully supported. AVIF support depends on your specific browser capabilities."}],
        relatedTools: ["bulk-resizer","image-compressor","image-converter"]
      }}
>
      <BatchImageConverterClientWrapper />
    </ToolShell>
  );
}
