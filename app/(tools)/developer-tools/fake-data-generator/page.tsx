import FakeDataGeneratorClient from "./FakeDataGeneratorClient";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { CheckCircle2, ShieldCheck, Database, FileJson, Table as TableIcon } from "lucide-react";

const toolId = "fake-data-generator";
const category = CATEGORIES.find((c) => c.id === "developer")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function FakeDataGeneratorPage() {
  return (
    <ToolShell
      title="Fake Data Generator"
      description="Generate realistic mock data for testing and development. Export to JSON, CSV, or SQL formats instantly."
      category={category}
      toolId={toolId}
    >
      <FakeDataGeneratorClient />

      <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-text tracking-tight">Generate Realistic Mock Data Instantly</h2>
            <p className="text-lg text-text-3 leading-relaxed">
              Testing applications with real user data is often risky or impossible due to privacy regulations. Our **Fake Data Generator** provides a safe, efficient way to create high-quality datasets for software testing, database seeding, and UI prototyping.
            </p>
            <p className="text-text-3 leading-relaxed">
              Whether you need a simple list of names and emails or a complex relational dataset with professional titles, financial metrics, and technical identifiers, our tool generates randomized yet realistic data based on industry-standard patterns.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl">
                <FileJson className="w-4 h-4 text-blue" />
                <span className="text-sm font-bold">JSON Support</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl">
                <TableIcon className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold">CSV Export</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl">
                <Database className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold">SQL Inserts</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-5xl p-10 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-text">How to Use the Generator</h3>
            <ol className="space-y-6">
              <li className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-black text-sm">1</div>
                <div className="space-y-1">
                  <p className="font-bold text-text">Define Volume:</p>
                  <p className="text-sm text-text-3">Enter the number of records you need (up to 2000 per batch).</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-black text-sm">2</div>
                <div className="space-y-1">
                  <p className="font-bold text-text">Select Fields:</p>
                  <p className="text-sm text-text-3">Choose from Personal, Professional, Technical, or Financial data categories.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-black text-sm">3</div>
                <div className="space-y-1">
                  <p className="font-bold text-text">Choose Format:</p>
                  <p className="text-sm text-text-3">Select between JSON (arrays), CSV (spreadsheet), or SQL (INSERT statements).</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-black text-sm">4</div>
                <div className="space-y-1">
                  <p className="font-bold text-text">Generate & Export:</p>
                  <p className="text-sm text-text-3">Preview the data and download the file instantly to your machine.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-20 space-y-12">
          <h2 className="text-3xl font-black text-text text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                q: "What data types can I generate?",
                a: "You can generate names, addresses, emails, job titles, companies, IP addresses, usernames, salaries, and even masked credit card numbers."
              },
              {
                q: "Is the data truly random?",
                a: "Yes. Every record is generated using browser-native randomization algorithms to ensure high entropy and realistic distribution."
              },
              {
                q: "Is there a limit on records?",
                a: "To ensure main-thread responsiveness, we cap generations at 2,000 records per click. You can run it multiple times for larger sets."
              },
              {
                q: "How does the SQL export work?",
                a: "It generates a series of standard INSERT INTO statements. You can easily modify the table name or copy the snippets into your migration scripts."
              },
              {
                q: "Is my generation private?",
                a: "Absolutely. No data is sent to KaruviLab servers. All randomization and formatting happen locally in your browser's execution context."
              },
              {
                q: "Can I use this for production data?",
                a: "No. This data is entirely fictional and intended for testing, development, and demonstration purposes only."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-surface border border-border rounded-3xl p-8 space-y-3">
                <h4 className="font-bold text-text leading-tight">{faq.q}</h4>
                <p className="text-sm text-text-3 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-12 bg-surface border border-border rounded-6xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-32 h-32 text-blue" />
          </div>
          <div className="relative z-10 space-y-6 max-w-3xl">
            <h3 className="text-2xl font-black text-text flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue" />
              Privacy & Security Standards
            </h3>
            <p className="text-text-3 text-lg italic leading-relaxed">
              "KaruviLab operates on a Zero-Server-Upload policy. Unlike many online generators that track your inputs, our Fake Data Generator processes every byte locally. Your testing environment remains secure, and your workflows remain private."
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-blue uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" />
              GDPR & CCPA Compliant by Design
            </div>
          </div>
        </div>
      </section>
    </ToolShell>
  );
}
