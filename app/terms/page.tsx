import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — KaruviLab",
  description: "Terms & Conditions for KaruviLab. Read our usage rules and disclaimer of warranties.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing and using KaruviLab (\"the Tool\"), you accept and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use the Tool.",
    },
    {
      title: "2. Description of the Tool",
      body: "KaruviLab is a free, browser-based utility that allows users to compress, convert, create, and validate image and PDF files, and provides a range of developer and SEO tools. The Tool is provided by R Gowtham under the Wanderseven brand.",
    },
    {
      title: "3. Use of the Tool",
      body: "You agree to use the Tool only for lawful purposes. You must not attempt to reverse-engineer the Tool's source code beyond what is permitted by applicable open-source licences, or use automated scripts to abuse the Tool.",
    },
    {
      title: "4. Disclaimer of Warranties",
      body: "The Tool is provided on an \"as is\" and \"as available\" basis without warranties of any kind. We do not guarantee that the output will meet the specific requirements of any government portal or authority.",
    },
    {
      title: "5. Limitation of Liability",
      body: "Wanderseven and R Gowtham shall not be liable for any direct or indirect damages arising from your use of or inability to use the Tool, including any file loss or processing errors.",
    },
    {
      title: "6. Contact",
      body: null,
      contact: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-sm text-text-4">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-3">Terms & Conditions</span>
        </nav>
        <h1 className="text-3xl font-black">Terms &amp; Conditions</h1>
        <p className="text-text-3">Last updated: April 30, 2026</p>
      </div>

      <div className="space-y-4">
        {sections.map(s => (
          <div key={s.title} className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-xl font-bold">{s.title}</h2>
            {s.body && <p className="text-text-2 leading-relaxed">{s.body}</p>}
            {s.contact && (
              <p className="text-text-2 leading-relaxed">
                For any queries regarding these Terms &amp; Conditions, please contact:{" "}
                <a href="mailto:wanderseven@proton.me" className="text-blue hover:underline">wanderseven@proton.me</a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
