import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';
import LogAnalyzerClientWrapper from './LogAnalyzerClientWrapper';

const toolId = 'log-analyzer';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="Log File Analyzer & Parser"
      description="Parse, search, filter by severity level, extract IP metrics, and analyze server and application logs locally."
      category={cat}
      toolId={toolId}
    >
      <LogAnalyzerClientWrapper />

      <LearningHub title="Understanding Application Logging">
        
        <LearningSection type="architecture" title="Unstructured vs Structured Logs">
          <p>When an application runs, it emits logs to help developers trace execution. Historically, these logs were unstructured plain-text strings: <code>2023-10-25 14:32:01 [ERROR] Failed to connect to DB at 192.168.1.5</code>.</p>
          <p className="mt-2">To analyze unstructured logs, systems use <strong>Regular Expressions</strong> to extract the timestamp, severity, and IP into separate columns. Writing a regex that perfectly handles every edge case in a giant block of text is notoriously fragile and slow.</p>
        </LearningSection>
        
        <LearningSection type="performance" title="The Structured Solution">
          <p>Modern applications use <strong>Structured Logging</strong>. Instead of a text string, the application outputs a JSON object: <code>{"{"} "time": "2023-10-25...", "level": "ERROR", "message": "Failed...", "ip": "192.168.1.5" {"}"}</code>.</p>
          <p className="mt-2">Because it is already structured, log ingestion engines (like ELK, Datadog, or Splunk) don't need expensive regex parsing. They can ingest the JSON directly, allowing you to instantly query "show me all ERRORs where IP = 192.168.1.5" across billions of rows in milliseconds.</p>
        </LearningSection>

        <LearningSection type="security" title="PII and Log Masking">
          <p>Logs are a massive liability if not handled correctly. A common engineering failure is accidentally logging Personally Identifiable Information (PII) like passwords, credit card numbers (PANs), or API tokens in plain text.</p>
          <p className="mt-2">If a sensitive token ends up in a central logging system, that entire logging cluster becomes a high-value target for hackers. Applications must implement strict middleware to redact or mask sensitive fields <em>before</em> the log is written to disk.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is 'Structured Logging' (e.g., logging as JSON objects) preferred over plain-text logging in modern large-scale applications?",
                options: [
                  "Because JSON takes up less disk space than plain text.",
                  "Because it allows log ingestion systems to index and query specific fields (like 'level' or 'userId') instantly without relying on slow, fragile regular expressions.",
                  "Because JSON automatically encrypts the log data.",
                  "Because browsers can only read JSON."
                ],
                correctIndex: 1,
                explanation: "Structured logs output data in a machine-readable format. This eliminates the need to 'parse' or 'extract' data using regex, making queries significantly faster and more reliable."
              },
              {
                question: "What happens if a developer accidentally logs an unmasked credit card number into the company's central log aggregation server?",
                options: [
                  "The log server automatically detects and deletes the record.",
                  "Nothing, log servers are inherently secure and inaccessible to attackers.",
                  "The central log server is now in violation of PCI-DSS compliance, exposing the company to massive fines and data breach risks.",
                  "The credit card number is safely encrypted because it is inside a JSON object."
                ],
                correctIndex: 2,
                explanation: "Centralized logging systems are often accessed by many employees and lack the strict access controls of primary databases. Leaking PII or PANs into logs is a severe security incident."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
