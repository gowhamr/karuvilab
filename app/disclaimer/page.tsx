import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer — KaruviLab",
  description: "Disclaimer for KaruviLab. This tool is independent and not affiliated with any government body.",
  alternates: {
    canonical: "/disclaimer/",
  },
};

export default function DisclaimerPage() {
  const sections = [
    {
      title: "1. General Disclaimer",
      body: "While we strive to keep information accurate, we make no warranties about the completeness or reliability of any validation result or the suitability of files for submission to specific portals.",
    },
    {
      title: "2. No Government Affiliation",
      body: "KaruviLab is an independent, privately operated tool. It is not affiliated with any government body, including UIDAI, Passport Seva, or Income Tax departments.",
    },
    {
      title: "3. Accuracy of Results",
      body: "Validation rules are based on publicly available guidelines. Requirements change frequently; always verify directly with official portals before final submission.",
    },
    {
      title: "4. Limitation of Liability",
      body: "In no event shall Wanderseven or R Gowtham be liable for any loss or consequence arising from reliance on the Tool, including rejection of documents by portals.",
    },
    {
      title: "5. Contact",
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
          <span className="text-text-3">Disclaimer</span>
        </nav>
        <h1 className="text-3xl font-black">Disclaimer</h1>
        <p className="text-text-3">Last updated: April 30, 2026</p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-5 rounded-2xl flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">⚠️</span>
        <div>
          <p className="font-bold text-yellow-800 dark:text-yellow-300">Important</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
            KaruviLab is an independent utility. It is not affiliated with, endorsed by, or associated with any government body, portal, or authority.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(s => (
          <div key={s.title} className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-xl font-bold">{s.title}</h2>
            {s.body && <p className="text-text-2 leading-relaxed">{s.body}</p>}
            {s.contact && (
              <p className="text-text-2">
                If you have any questions about this Disclaimer, please contact us at:{" "}
                <a href="mailto:wanderseven@proton.me" className="text-blue hover:underline">wanderseven@proton.me</a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
