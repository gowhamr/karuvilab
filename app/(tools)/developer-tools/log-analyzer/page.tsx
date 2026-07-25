import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-logs"
          title="How it Works: Unstructured vs Structured Logs"
          preview="Learn why logging as JSON is better than logging plain text."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When an application runs, it emits logs to help developers understand what it is doing. Historically, these logs were unstructured text strings like: <code>2023-10-25 14:32:01 [ERROR] Failed to connect to database at 192.168.1.5</code>.
            </p>
            <h3>Parsing Unstructured Logs</h3>
            <p>
              To analyze unstructured logs, tools (like this one) use <strong>Regular Expressions</strong> to "extract" the timestamp, the severity level, and the message into separate columns. While this works, writing a regex that perfectly handles every edge case in a giant block of text is slow and fragile.
            </p>
            <h3>Structured Logging</h3>
            <p>
              Modern systems use Structured Logging. Instead of a text string, the application outputs a JSON object: <code>&#123; "time": "2023-10-25...", "level": "ERROR", "message": "Failed...", "ip": "192.168.1.5" &#125;</code>. 
            </p>
            <p>
              Because it's already structured, log ingestion systems (like Datadog or ELK) don't need regex. They can instantly index the JSON properties, allowing you to instantly query things like "show me all ERRORs where IP = 192.168.1.5" across billions of rows.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
