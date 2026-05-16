import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageCompressorClientWrapper from './ImageCompressorClientWrapper';

const toolId = 'image-compress';
const cat = CATEGORIES.find(c => c.id === 'image')!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ImageCompressorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Compressor",
    "description": "Browser‑based image compression and conversion tool. No file upload, offline capable.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0" },
    "featureList": [
      "Lossy and Lossless Compression",
      "Batch Processing",
      "Format Conversion",
      "Resizing",
      "Before/After Preview"
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does your image compressor protect my privacy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All image processing happens entirely within your browser using Web Workers and OffscreenCanvas. No image data is ever uploaded to our servers. Your privacy is 100% guaranteed as everything stays local to your device."
        }
      },
      {
        "@type": "Question",
        "name": "What’s the difference between lossy and lossless compression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lossy compression (like JPEG) removes some image data to significantly reduce file size, which might slightly affect quality. Lossless compression (available for PNG) reduces file size without any quality loss by using more efficient encoding."
        }
      },
      {
        "@type": "Question",
        "name": "Can I compress multiple images at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Use our 'Batch Processing' tab to drag and drop multiple images. You can apply global settings to all images or adjust them individually, then download all compressed files as a single ZIP."
        }
      },
      {
        "@type": "Question",
        "name": "Which format gives the best compression?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WebP and AVIF generally provide much better compression than JPEG or PNG while maintaining high visual quality. AVIF is the most modern and efficient format, though WebP has broader browser support."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, once the page is loaded, the tool works completely offline. All the compression logic is bundled into the application and runs locally in your browser."
        }
      }
    ]
  };

  return (
    <ToolShell
      title="Image Compressor"
      description="Professional-grade image optimization suite. Lossless compression, batch processing, and format conversion — all 100% private in your browser."
      category={cat}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />

      <ImageCompressorClientWrapper />

      <section className="mt-20 border-t border-border pt-16 space-y-12">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-text-4 font-bold uppercase text-xs tracking-widest">Everything you need to know about our local image compressor</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {faqData.mainEntity.map((item, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-2">{item.name}</h3>
              <p className="text-[13px] text-text-4 leading-relaxed font-medium">{item.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue/5 border border-blue/10 p-10 rounded-[40px] text-center space-y-4">
          <h3 className="text-xl font-black uppercase tracking-tight">Ready to optimize your images?</h3>
          <p className="text-sm text-text-4 font-bold uppercase tracking-widest max-w-xl mx-auto">Start by uploading a single image or switch to batch mode for high-volume tasks. No signup, no limits, no uploads.</p>
        </div>
      </section>
    </ToolShell>
  );
}
