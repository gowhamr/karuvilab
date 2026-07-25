import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import JsonToXmlClientWrapper from './JsonToXmlClientWrapper';

const toolId = 'json-to-xml';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="JSON to XML Converter"
      category={cat}
    >
      <JsonToXmlClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-xml"
          title="How it Works: The Impedance Mismatch"
          preview="Learn why translating between JSON and XML is inherently lossy."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              JSON and XML are both data interchange formats, but they have fundamentally different structures. JSON is built on Data Structures (Objects and Arrays), while XML is built on Documents (Nodes and Attributes).
            </p>
            <h3>Attributes vs Elements</h3>
            <p>
              In XML, a node can have attributes: <code>&lt;user id="1"&gt;Alice&lt;/user&gt;</code>. JSON has no concept of attributes. To represent this in JSON, you often have to invent a convention, like prefixing attributes with an underscore: <code>{"{"} "_id": "1", "#text": "Alice" {"}"}</code>.
            </p>
            <h3>Arrays</h3>
            <p>
              In JSON, arrays are explicit: <code>"users": ["Alice", "Bob"]</code>. In XML, arrays do not exist. Instead, you just repeat the same element: <code>&lt;user&gt;Alice&lt;/user&gt;&lt;user&gt;Bob&lt;/user&gt;</code>. When converting from XML back to JSON, if the parser only sees a single <code>&lt;user&gt;</code> element, it has no way of knowing if it was supposed to be an array of length 1, or just an object, leading to frequent bugs in API integrations.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
