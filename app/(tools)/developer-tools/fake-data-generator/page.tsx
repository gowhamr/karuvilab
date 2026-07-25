import FakeDataGeneratorClient from "./FakeDataGeneratorClient";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { generateToolMetadata } from "@/src/lib/seo";

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-mock-data"
          title="How it Works: Why Use Mock Data?"
          preview="Learn why using real user data for testing is a massive security risk."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Testing applications with real user data is often risky or impossible due to privacy regulations like GDPR and CCPA. A simple database dump used in a staging environment can lead to a massive data breach if that staging environment is compromised.
            </p>
            <h3>Data Masking vs Mocking</h3>
            <p>
              <strong>Data Masking</strong> involves taking a real production database and obfuscating the PII (Personally Identifiable Information). While secure, it requires complex scripts to maintain relational integrity (e.g., making sure user ID 5 still links to orders for user ID 5).
            </p>
            <p>
              <strong>Data Mocking</strong> (what this tool does) generates completely synthetic data from scratch. It builds realistic names, emails, and financial metrics using randomization algorithms and predefined dictionaries.
            </p>
            <h3>SQL Seeding</h3>
            <p>
              When building a new app, a database with zero rows makes it impossible to design the UI or test pagination. Developers write "seed scripts" that use mock data to instantly populate the database with thousands of fake users, products, and transactions to simulate a production environment.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
