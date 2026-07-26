import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import YamlJsonClientWrapper from './YamlJsonClientWrapper';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

const toolId = 'yaml-json-converter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="YAML ↔ JSON Converter"
      description="Bi-directional YAML to JSON and JSON to YAML converter with syntax validation."
      category={cat}
      toolId={toolId}
    >
      <YamlJsonClientWrapper />

      <LearningHub title="Understanding YAML and JSON Interoperability">
        
        <LearningSection type="architecture" title="YAML is a Superset of JSON">
          <p>YAML and JSON are often seen as competing formats for configuration files, but they are mathematically related: YAML version 1.2 was explicitly designed as a strict superset of JSON.</p>
          <p className="mt-2">This means that <strong>every valid JSON file is automatically a valid YAML file.</strong> A fully compliant YAML parser should be able to read standard JSON syntax perfectly.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Why Do We Need Converters?">
          <p>If a YAML parser can natively read JSON, why do we need tools to convert between them?</p>
          <p className="mt-2">Because the relationship is strictly one-way. JSON parsers cannot read YAML-specific features like unquoted strings, comments, anchors (<code>&id</code>), or multi-line block scalars (<code>|</code>).</p>
          <p className="mt-2">If an application environment only provides a JSON parser (like a web browser with native <code>JSON.parse()</code>), you must "compile" your YAML down to JSON before feeding it into the application.</p>
        </LearningSection>

        <LearningSection type="performance" title="The Data Loss Problem">
          <p>Because YAML contains structural features that simply do not exist in the JSON specification, converting YAML to JSON is an inherently <strong>lossy process</strong>.</p>
          <p className="mt-2">Most notably, JSON does not support comments. Any explanatory comments written in your YAML file will be permanently deleted when converted to JSON. Additionally, YAML anchors and aliases (which allow you to DRY up your config by referencing a block multiple times) will be fully resolved and expanded, causing the JSON file size to inflate significantly compared to the original YAML.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which of the following statements about the relationship between YAML and JSON is true?",
                options: [
                  "Every valid YAML file is a valid JSON file.",
                  "Every valid JSON file is a valid YAML file.",
                  "YAML and JSON share no syntax rules.",
                  "JSON is a superset of YAML."
                ],
                correctIndex: 1,
                explanation: "YAML 1.2 is a superset of JSON. This means standard JSON arrays [] and objects {} are perfectly legal syntax inside a YAML file."
              },
              {
                question: "What happens to YAML comments (#) when converted to JSON?",
                options: [
                  "They are converted to standard JSON /* comments */.",
                  "They are converted to special '__comment__' string keys.",
                  "They are permanently lost because the JSON specification does not support comments.",
                  "They trigger a syntax error."
                ],
                correctIndex: 2,
                explanation: "JSON strictly forbids comments of any kind. Any parser converting YAML to JSON must strip them out."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
