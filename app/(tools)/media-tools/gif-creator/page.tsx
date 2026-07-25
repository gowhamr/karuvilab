import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";
import GifCreatorClientWrapper from "./GifCreatorClientWrapper";

const toolId = "gif-creator";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function GifCreatorPage() {
  const cat = CATEGORIES.find(c => c.id === "media")!;
  return (
    <ToolShell
      title="GIF Creator"
      description="Create high-quality animated GIFs from images locally in your browser. Fast, private, and customizable."
      category={cat}
      toolId={toolId}
    >
      <GifCreatorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-gif"
          title="How it Works: The GIF Format"
          preview="Learn why the GIF format from 1987 is still heavily used today."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Created by CompuServe in 1987, the Graphics Interchange Format (GIF) is one of the oldest image formats still widely used on the web. Despite its age and inefficiency compared to modern formats like WebM or MP4, its universal support across every browser and messaging app keeps it relevant.
            </p>
            <h3>Color Limitation</h3>
            <p>
              A GIF is fundamentally limited to a palette of <strong>256 colors</strong>. When you upload high-resolution photographs to this tool, the image data must be quantized. The algorithm analyzes the image and builds a custom palette of the 256 most important colors to approximate the original image. This is why complex GIFs often look grainy or "dithered".
            </p>
            <h3>LZW Compression</h3>
            <p>
              To reduce file size, GIFs use Lempel–Ziv–Welch (LZW) compression. This is a lossless algorithm that finds repeated patterns of pixels and stores them efficiently in a dictionary. It's the exact same algorithm used in the famous ZIP file format.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
