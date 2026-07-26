import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding the GIF Format">
        
        <LearningSection type="architecture" title="A Legacy Format">
          <p>Created by CompuServe in 1987, the Graphics Interchange Format (GIF) is one of the oldest image formats still widely used on the web. Despite its age and massive inefficiency compared to modern formats like WebM or MP4, its universal support across every browser, OS, and messaging app keeps it relevant.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="The 256 Color Limitation">
          <p>A GIF is fundamentally limited to a palette of <strong>maximum 256 colors</strong> per frame.</p>
          <p className="mt-2">When you upload high-resolution 24-bit photographs (which can contain millions of colors) to this tool, the image data must be <strong>quantized</strong>. The algorithm analyzes the image and builds a custom mathematical palette of the 256 most important colors to approximate the original image.</p>
          <p className="mt-2">Because 256 colors isn't enough for smooth gradients, the encoder uses <strong>Dithering</strong>—scattering pixels of different available colors next to each other to create the optical illusion of a missing color. This is why complex GIFs often look grainy.</p>
        </LearningSection>

        <LearningSection type="api" title="LZW Compression">
          <p>To reduce file size, GIFs use Lempel–Ziv–Welch (LZW) compression. This is a lossless algorithm that finds repeated patterns of pixels (like a large area of solid blue sky) and stores them efficiently in a dictionary.</p>
          <p className="mt-2">Interestingly, LZW is the exact same algorithm used in the famous ZIP file format. Because it relies on exact pixel matching, applying dithering (which adds noise) usually destroys LZW compression efficiency, causing the file size to balloon.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why do high-quality photographs often look grainy when converted to a GIF?",
                options: [
                  "Because GIFs are limited to a maximum of 256 colors per frame.",
                  "Because GIFs automatically reduce the resolution to 480p.",
                  "Because of LZW compression artifacts.",
                  "Because browsers blur GIFs to save memory."
                ],
                correctIndex: 0,
                explanation: "The format's strict 8-bit color palette forces encoders to drop millions of colors, relying on dithering (scattering dots) to simulate the missing shades."
              },
              {
                question: "How does applying Dithering usually affect the file size of a GIF?",
                options: [
                  "It makes the file size much smaller.",
                  "It has no effect on file size.",
                  "It significantly increases the file size.",
                  "It depends on the browser."
                ],
                correctIndex: 2,
                explanation: "GIFs use LZW compression, which looks for repeating horizontal patterns of the exact same color. Dithering scrambles these patterns into noise, breaking the compression and increasing file size."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
