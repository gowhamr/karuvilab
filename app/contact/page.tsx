import { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Contact – KV",
  description: "Contact KaruviLab. Email us at wanderseven@proton.me for bug reports, feature requests or general enquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <StructuredData />
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-sm text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">Contact Us</span>
        </nav>
        <h1 className="text-3xl font-black">Contact Us</h1>
        <p className="text-text-3">We&apos;re here to help — reach out any time.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
          <h2 className="text-xl font-bold">Get in Touch</h2>
          <p className="text-text-2 leading-relaxed">
            Have a question, a bug to report, or a feature suggestion? We&apos;d love to hear from you. KaruviLab is maintained by a small, dedicated team and we respond to every message.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: "✉️",
              title: "Email Support",
              body: "For general enquiries, feature requests, and bug reports:",
              link: { href: "mailto:wanderseven@proton.me", label: "wanderseven@proton.me" },
              note: "We aim to respond within 1–2 business days.",
            },
            {
              icon: "🌐",
              title: "Website",
              body: "Visit our main website for more tools and resources:",
              link: { href: "https://wanderseven.com", label: "wanderseven.com" },
            },
            {
              icon: "👤",
              title: "Owner",
              body: "This tool is operated by:",
              extra: "R Gowtham · Wanderseven",
            },
          ].map(card => (
            <div key={card.title} className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="font-bold">{card.title}</h3>
              <p className="text-sm text-text-2">{card.body}</p>
              {card.link && (
                <a href={card.link.href} target={card.link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-blue font-medium hover:underline text-sm block">
                  {card.link.label}
                </a>
              )}
              {card.note && <p className="text-xs text-text-4">{card.note}</p>}
              {card.extra && <p className="text-sm font-medium">{card.extra}</p>}
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
          <h2 className="text-xl font-bold">What to Include in Your Message</h2>
          <p className="text-text-2">To help us assist you faster, please include:</p>
          <ul className="space-y-2 text-text-2">
            {[
              "A brief description of your issue or request",
              "The browser and operating system you are using",
              "The file format or tool you were using",
              "Any error messages you saw",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-blue flex-shrink-0 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
          {[
            {
              q: "Is this tool completely free?",
              a: "Yes. KaruviLab is 100% free to use, with no sign-up required and no file upload to any server.",
            },
            {
              q: "Are my files safe and private?",
              a: "Absolutely. All processing happens entirely in your browser using JavaScript. Your files never leave your device.",
            },
            {
              q: "Which browsers are supported?",
              a: "The tool works best on modern browsers: Chrome 90+, Firefox 90+, Safari 15+, and Edge 90+.",
            },
          ].map(faq => (
            <div key={faq.q} className="border-b border-border pb-4 last:border-0 last:pb-0 space-y-1">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="text-sm text-text-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
