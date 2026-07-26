import FakeDataGeneratorClient from "./FakeDataGeneratorClient";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

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

      <LearningHub title="Understanding Data Mocking">
        
        <LearningSection type="architecture" title="Why Use Mock Data?">
          <p>Testing applications with real user data is often risky or completely illegal due to privacy regulations like GDPR and CCPA.</p>
          <p className="mt-2">If developers use a raw dump of the production database in a local or staging environment, any security compromise in those lower environments leads to a massive breach of Personally Identifiable Information (PII).</p>
        </LearningSection>
        
        <LearningSection type="security" title="Data Masking vs Mocking">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Data Masking:</strong> Taking a real production database and running a script to scramble or redact the PII (e.g., turning "John Doe" into "User_849"). This maintains relational integrity (foreign keys still match), but it is complex to implement securely.</li>
            <li><strong>Data Mocking:</strong> Generating completely synthetic data from scratch using randomization algorithms and predefined dictionaries. This guarantees zero PII leakage, but requires you to build the relational logic yourself.</li>
          </ul>
        </LearningSection>

        <LearningSection type="api" title="Database Seeding">
          <p>When building a new app, a database with zero rows makes it impossible to design the UI, test pagination, or measure query performance.</p>
          <p className="mt-2">Engineers write "seed scripts" that utilize mock data generators to instantly populate the development database with tens of thousands of fake users, products, and transactions. This allows the team to simulate a high-load production environment on day one.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is it considered a bad practice to test new features using a copy of the production database?",
                options: [
                  "Because production databases are too large to fit on a developer's laptop.",
                  "Because production databases change too quickly, making tests flaky.",
                  "Because local and staging environments usually have weaker security, creating a massive risk of a PII data breach.",
                  "Because database licenses forbid copying the data."
                ],
                correctIndex: 2,
                explanation: "Production data contains real customer PII. Exposing that data to lower-security environments or developer laptops is a critical security vulnerability and violates privacy laws."
              },
              {
                question: "What is a 'Seed Script'?",
                options: [
                  "A script used to backup the database.",
                  "A script that populates an empty database with initial, often mocked, data so the application can be tested.",
                  "A script that deletes all user data.",
                  "A script that encrypts passwords."
                ],
                correctIndex: 1,
                explanation: "Seeding a database means planting the initial data required to make the application functional for testing and UI development."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
