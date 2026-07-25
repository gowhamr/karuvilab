import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-workers"
          title="How it Works: Multi-threading with Web Workers"
          preview="Learn how your browser can process 100 images at once without freezing."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              By default, JavaScript is <strong>single-threaded</strong>. It can only do one thing at a time. If it tries to decode and encode 100 images on the main thread, your entire browser tab will freeze, and you won't even be able to click a button or scroll the page.
            </p>
            <h3>Concurrency and Orchestration</h3>
            <p>
              To solve this, this tool spawns a pool of <strong>Web Workers</strong>. Think of Workers as invisible background tabs. Our <code>WorkerOrchestrator</code> looks at how many CPU cores your device has (using <code>navigator.hardwareConcurrency</code>) and spawns exactly that many workers.
            </p>
            <p>
              It then takes your batch of 100 images and distributes them across the CPU cores. If you have an 8-core machine, it processes 8 images simultaneously in the background while leaving the main thread perfectly smooth so the UI can update the progress bar at 60 frames per second.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
