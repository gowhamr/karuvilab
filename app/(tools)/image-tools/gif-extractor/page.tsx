import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import GifExtractorClientWrapper from './GifExtractorClientWrapper';

const toolId = 'gif-extractor';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="GIF Frame Extractor"
      description="Extract individual frames from animated GIFs"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Extract individual frames from animated GIF images offline. This client-side tool lets you scrub through GIF frames and download the exact moment as a high-quality PNG or JPEG.",
        useCases: ["Extracting a specific meme frame","Analyzing animated sprites frame-by-frame","Converting a GIF moment to a static avatar","Breaking down animations for study","Offline secure GIF processing"],
        howTo: ["Upload an animated GIF.","Use the timeline slider to find the exact frame you want.","Preview the isolated frame.","Select PNG or JPEG format.","Download the static image."],
        faq: [{"question":"Are my GIFs uploaded to a server?","answer":"No, all GIF decoding and frame extraction happens securely in your browser."},{"question":"Can I extract all frames at once?","answer":"Currently, you can extract one frame at a time. A bulk export feature is planned for future updates."},{"question":"Is the extracted frame high quality?","answer":"GIFs are inherently low-color (256 colors). The extracted PNG will be a perfect pixel match to the original frame."},{"question":"Will this work offline?","answer":"Yes, once KaruviLab is loaded, it operates completely offline."},{"question":"Can I create a GIF from frames?","answer":"This tool is for extracting frames. To create a GIF, use our GIF Creator tool."}],
        relatedTools: ["svg-converter","image-converter","video-trim"]
      }}
>
      <GifExtractorClientWrapper />
    </ToolShell>
  );
}
