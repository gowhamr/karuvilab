import { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer – KV",
  description: "Official Disclaimer for KaruviLab. Information regarding tool accuracy, government non-affiliation, and limitation of liability.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  const sections = [
    {
      title: "1. Information Accuracy",
      body: "The information and calculation results provided by KaruviLab are for general informational purposes only. While we strive for 100% accuracy and keep our algorithms updated based on the latest standards, we make no warranties or guarantees regarding the absolute completeness, reliability, or precision of any result produced by the tools.",
    },
    {
      title: "2. No Government Affiliation",
      body: "KaruviLab is an independent, privately-owned platform. It is NOT affiliated with, authorized by, endorsed by, or in any way officially connected to any government body, agency, or authority, including but not limited to UIDAI, Income Tax Department, Passport Seva, or any municipal corporation. All tools provided are independent implementations for user convenience.",
    },
    {
      title: "3. Financial & Legal Advice",
      body: "Calculators (including EMI, SIP, Tax, and Investment tools) are intended to provide estimates only. They do not constitute financial, investment, or legal advice. Users should consult with qualified professionals before making any significant financial decisions based on the outputs of these tools.",
    },
    {
      title: "4. Network & Utility Tools",
      body: "Tools such as the Internet Speed Tester and File Validators provide real-time snapshots of performance or data. These results can be affected by various external factors including hardware, browser environment, and network congestion. They should not be used as a basis for professional certification or legal disputes.",
    },
    {
      title: "5. Limitation of Liability",
      body: "In no event shall KaruviLab, its developers, or its parent entity be liable for any direct, indirect, consequential, or incidental damages or losses arising from the use of, or inability to use, the tools provided on this website. Users assume full responsibility for any actions taken based on the information provided.",
    },
    {
      title: "6. Contact Information",
      body: null,
      contact: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 px-4 md:px-0">
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-xs font-bold text-text-4 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <span className="text-text-2">Disclaimer</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text">Legal Disclaimer</h1>
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-blue rounded-full" />
          <p className="text-text-4 text-sm font-bold">Last updated: May 11, 2026</p>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[32px] flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>
          <p className="font-black text-red-500 uppercase tracking-widest text-xs mb-1">Critical Notice</p>
          <p className="text-sm text-text-2 leading-relaxed font-medium">
            KaruviLab is an <strong className="text-text">Independent Utility</strong>. We are not associated with any government portal or official authority. Use of these tools does not guarantee acceptance of documents or data by third-party systems.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((s, i) => (
          <div key={s.title} className="bg-surface border border-border p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-[10px] font-black text-text-4 group-hover:border-blue/30 group-hover:text-blue transition-all">
                  0{i + 1}
               </div>
               <div className="space-y-3 flex-1">
                <h2 className="text-xl font-black text-text">{s.title}</h2>
                {s.body && <p className="text-text-3 leading-relaxed font-medium text-[15px]">{s.body}</p>}
                {s.contact && (
                  <p className="text-text-3 font-medium text-[15px]">
                    If you have any questions or concerns regarding this Disclaimer, please reach out to us at:{" "}
                    <a href="mailto:KaruviLab@proton.me" className="text-blue hover:underline font-bold">KaruviLab@proton.me</a>
                  </p>
                )}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 border-t border-border text-center">
        <p className="text-xs text-text-4 font-bold uppercase tracking-[0.3em]">Precision • Privacy • Performance</p>
      </div>
    </div>
  );
}
