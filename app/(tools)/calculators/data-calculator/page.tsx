import { Metadata } from "next";
import Script from "next/script";
import DataCalculatorWrapper from "./DataCalculatorWrapper";

export const metadata: Metadata = {
  title: "Advanced Data Calculator – File Size Converter, Transfer Time & Checksum | KaruviLab",
  description: "Convert data units (SI/IEC), calculate download/upload times, estimate cloud storage costs, and generate checksums (MD5, SHA-256) – all offline and privacy-first. No uploads.",
  keywords: ["data calculator", "unit converter", "transfer time", "bandwidth calculator", "storage cost", "checksum generator", "md5", "sha256"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Advanced Data Calculator",
  "description": "A comprehensive suite of data tools: unit converter, transfer time calculator, storage cost estimator, and checksum generator.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0" },
  "featureList": [
    "Data Unit Converter (SI & IEC)",
    "Transfer Time Calculator (Bandwidth)",
    "Storage Cost Estimator (Cloud Presets)",
    "Checksum Generator (MD5, SHA-1, SHA-256, SHA-512)"
  ]
};

export default function DataCalculatorPage() {
  return (
    <>
      <Script
        id="data-calc-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <DataCalculatorWrapper />

      {/* SEO Content Section (Server Rendered) */}
      <section className="mt-20 max-w-4xl mx-auto px-6 space-y-16 pb-20">
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-text">Data Units: SI vs IEC</h2>
          <p className="text-text-3 leading-relaxed text-lg">
            Understanding the difference between decimal (SI) and binary (IEC) units is crucial for data accuracy. 
            Manufacturers often use decimal units (e.g., 1 KB = 1000 Bytes), while operating systems like Windows 
            typically use binary units (e.g., 1 KiB = 1024 Bytes). This discrepancy is why a "1 TB" hard drive 
            shows up as approximately 931 GiB in your system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-text">Calculating Transfer Time</h3>
            <p className="text-sm text-text-3 leading-relaxed">
              Transfer time depends on file size and network bandwidth. However, real-world speeds are rarely constant. 
              Latency, packet loss, and protocol overhead (TCP/IP) typically consume 5-10% of your total bandwidth. 
              Our calculator includes an overhead slider to provide more realistic time estimates.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-text">Why Use Local Checksums?</h3>
            <p className="text-sm text-text-3 leading-relaxed">
              Generating a checksum (like MD5 or SHA-256) confirms that a file hasn't been corrupted or tampered with. 
              Most online hash tools require you to upload your file to their servers. <strong>KaruviLab performs all 
              hashing locally on your device</strong>, ensuring your private documents and sensitive data never leave 
              your browser.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <h3 className="text-2xl font-black text-text">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 gap-6">
            <FAQItem 
              q="What is the difference between MB and MiB?"
              a="MB (Megabyte) is a decimal unit (10^6 bytes), while MiB (Mebibyte) is a binary unit (2^20 bytes). A Megabyte is exactly 1,000,000 bytes, whereas a Mebibyte is 1,048,576 bytes."
            />
            <FAQItem 
              q="How do I calculate download time?"
              a="To calculate download time, divide the file size (in bits) by the connection speed (in bits per second). For example, a 1 GB file is 8 billion bits. On a 100 Mbps connection, it would take roughly 80 seconds, plus overhead."
            />
            <FAQItem 
              q="Is my file safe when generating a checksum?"
              a="Yes. KaruviLab uses the Zero-Upload philosophy. Files selected for hashing are processed by your browser's local Web Worker. We do not have servers that store or even see your file content."
            />
            <FAQItem 
              q="Which hashing algorithm should I use?"
              a="SHA-256 is currently considered the industry standard for security. MD5 and SHA-1 are faster but are no longer recommended for cryptographic security as they are vulnerable to collision attacks, though they are still useful for simple error-checking."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="p-8 bg-surface border border-border rounded-[32px] space-y-4 shadow-sm">
      <h4 className="font-black text-text text-lg">{q}</h4>
      <p className="text-sm text-text-3 leading-relaxed">{a}</p>
    </div>
  );
}
