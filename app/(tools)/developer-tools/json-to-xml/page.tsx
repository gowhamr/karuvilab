import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import JsonToXmlClientWrapper from './JsonToXmlClientWrapper';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="The JSON to XML Impedance Mismatch">
        
        <LearningSection type="architecture" title="Fundamental Differences">
          <p>Translating between JSON and XML is inherently "lossy". They are not simply two ways to write the exact same thing; they have fundamentally different structural paradigms.</p>
          <p className="mt-2">JSON is built on <strong>Data Structures</strong> (Objects and Arrays), whereas XML is built on <strong>Documents</strong> (Nodes and Attributes).</p>
        </LearningSection>
        
        <LearningSection type="api" title="Attributes vs Elements">
          <p>In XML, a node can have Attributes alongside its text value: <code>&lt;user id="1"&gt;Alice&lt;/user&gt;</code>.</p>
          <p className="mt-2">JSON has absolutely no concept of attributes. To represent this XML in JSON, you are forced to invent a non-standard convention, such as prefixing attribute keys with an underscore or an at-symbol: <code>{"{"} "@id": "1", "#text": "Alice" {"}"}</code>. When converting JSON back to XML, the converter must explicitly know your chosen convention to rebuild the attributes properly.</p>
        </LearningSection>

        <LearningSection type="failures" title="The Array Problem">
          <p>In JSON, Arrays are explicit: <code>"users": ["Alice", "Bob"]</code>.</p>
          <p className="mt-2">In XML, Arrays do not exist. To represent a list, you simply repeat the same XML element consecutively: <code>&lt;user&gt;Alice&lt;/user&gt;&lt;user&gt;Bob&lt;/user&gt;</code>.</p>
          <p className="mt-2">The fatal flaw occurs when converting XML back to JSON. If the XML parser only sees a <em>single</em> <code>&lt;user&gt;</code> element in the document, it has no mathematical way of knowing if it was intended to be an Array of length 1, or just a standard Object. This ambiguity leads to frequent crashing bugs in API integrations when a usually-plural list happens to only return one item.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why is converting XML containing attributes to JSON problematic?",
                options: [
                  "Because JSON does not support strings.",
                  "Because JSON has no native concept of 'Attributes', forcing parsers to invent messy workarounds like '@attr_name'.",
                  "Because XML attributes are encrypted.",
                  "Because JSON objects can only have 10 keys."
                ],
                correctIndex: 1,
                explanation: "JSON only has Keys and Values. It lacks the metadata layer that XML Attributes provide, creating an 'impedance mismatch' between the two specs."
              },
              {
                question: "What is the primary danger when converting XML back into JSON regarding lists of items?",
                options: [
                  "XML cannot store lists of items.",
                  "The JSON will run out of memory.",
                  "If an XML list only contains one item, the parser might incorrectly convert it into a JSON Object instead of a JSON Array of length 1.",
                  "The items will be sorted alphabetically in JSON."
                ],
                correctIndex: 2,
                explanation: "Because XML expresses arrays simply by repeating elements, a single element provides no structural clue that it is part of a list, often breaking code that expects to call .map() or .length on the parsed JSON."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
