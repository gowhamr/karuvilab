import { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy – KV",
  description: "Privacy Policy for KaruviLab. No files are collected or uploaded. All processing runs locally in your browser.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <StructuredData />
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-sm text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">Privacy Policy</span>
        </nav>
        <h1 className="text-3xl font-black">Privacy Policy</h1>
        <p className="text-text-3">Last updated: April 30, 2026</p>
      </div>

      <div className="bg-blue/10 border border-blue/30 p-5 rounded-2xl flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">🔒</span>
        <div>
          <p className="font-bold">Privacy Promise</p>
          <p className="text-sm text-text-2 mt-1">We believe your data is your own. KaruviLab is a &ldquo;Serverless Utility&rdquo; — every operation happens 100% on your device. We do not collect, store, or see your files.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            title: "1. 100% Local Processing",
            body: "KaruviLab is built on the principle of client-side processing. Your files are never sent to a server. They stay in your device's memory until the process is complete.",
          },
          {
            title: "2. Data We Do NOT Collect",
            list: [
              { label: "No Content Logging", detail: "We do not log the contents of your text, images, or documents." },
              { label: "No Personal Information", detail: "We do not ask for your name, email, or phone number." },
              { label: "No Tracking", detail: "We do not use Google Analytics or tracking pixels." },
            ],
          },
          {
            title: "3. Cookies & Local Storage",
            body: "KaruviLab does not use cookies for tracking. We use the browser's localStorage only to remember your preferred theme (Light/Dark mode) and recently visited tools. This data never leaves your device.",
          },
          {
            title: "4. Contact Us",
            body: null,
            contact: true,
          },
        ].map(section => (
          <div key={section.title} className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-xl font-bold">{section.title}</h2>
            {section.body && <p className="text-text-2 leading-relaxed">{section.body}</p>}
            {section.list && (
              <ul className="space-y-2">
                {section.list.map(item => (
                  <li key={item.label} className="flex items-start gap-2 text-sm text-text-2">
                    <span className="text-blue font-bold flex-shrink-0">•</span>
                    <span><strong>{item.label}:</strong> {item.detail}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.contact && (
              <p className="text-text-2 text-sm">
                If you have any questions about our privacy-first approach, feel free to reach out to <strong>R Gowtham</strong> at{" "}
                <a href="mailto:wanderseven@proton.me" className="text-blue hover:underline">wanderseven@proton.me</a>.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
