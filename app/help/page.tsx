import { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Help & FAQ – KV",
  description: "Help, FAQ, and troubleshooting for KaruviLab. Learn how each browser-based tool works.",
};

const FAQS = [
  {
    q: "Is my data safe?",
    a: "Yes, 100%. KaruviLab uses client-side JavaScript to process files. Your documents never leave your device.",
  },
  {
    q: "Does it work without the internet?",
    a: "Most tools work completely offline once the page has loaded. PDF tools that load from CDN need an initial connection.",
  },
  {
    q: "Can I use this for government applications?",
    a: "Yes. We specifically design our tools to meet the requirements of official portals and exam forms.",
  },
  {
    q: "What file types are supported?",
    a: "Images (JPG, PNG, WebP, AVIF, etc.), PDFs, and various developer formats like JSON, CSV, and Markdown.",
  },
  {
    q: "A tool failed. What now?",
    a: (
      <span>
        First, refresh the page. If the problem persists, try a different browser or contact us via the{" "}
        <Link href="/contact" className="text-blue hover:underline">
          contact page
        </Link>
        .
      </span>
    ),
  },
  {
    q: "Are there file size limits?",
    a: "Limits depend on your device's available RAM. Most modern devices handle files up to several hundred megabytes.",
  },
];

const HOW_IT_WORKS = [
  { icon: "🔒", title: "100% local processing", desc: "Every file you drop in is processed by your browser using JavaScript. Nothing is uploaded to a server." },
  { icon: "⚡", title: "Instant results", desc: "Because there's no upload step, your output is ready as soon as your device finishes the calculation." },
  { icon: "🌍", title: "Works offline", desc: "After the page loads, most tools keep working without an internet connection — perfect for sensitive documents." },
  { icon: "🇮🇳", title: "Built for portals", desc: "Compressors and validators target the strict size, format, and resolution rules of government portals." },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <StructuredData />
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-sm text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">Help & FAQ</span>
        </nav>
        <h1 className="text-3xl font-black">Help &amp; FAQ</h1>
        <p className="text-text-3">How KaruviLab works, common questions, and troubleshooting.</p>
      </div>

      {/* How it works */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xl font-bold">How KaruviLab works</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {HOW_IT_WORKS.map(item => (
            <div key={item.title} className="bg-bg border border-border rounded-xl p-4 space-y-1">
              <p className="font-bold text-sm">{item.icon} {item.title}</p>
              <p className="text-sm text-text-3 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xl font-bold">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(faq => (
            <details key={faq.q} className="border border-border rounded-xl overflow-hidden group">
              <summary className="px-5 py-4 font-semibold cursor-pointer list-none flex items-center justify-between gap-3 hover:bg-bg/50 transition-colors">
                <span>{faq.q}</span>
                <span className="text-text-4 text-lg font-bold flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-text-2 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* Still need help */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xl font-bold">Still need help?</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl text-sm font-semibold hover:bg-blue hover:text-white hover:border-blue transition-all">
            ✉️ Contact us
          </Link>
          <Link href="/about" className="inline-flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl text-sm font-semibold hover:bg-blue hover:text-white hover:border-blue transition-all">
            ℹ️ About Us
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl text-sm font-semibold hover:bg-blue hover:text-white hover:border-blue transition-all">
            🏠 All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
