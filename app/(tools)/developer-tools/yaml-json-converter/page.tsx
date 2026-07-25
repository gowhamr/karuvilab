import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import YamlJsonClientWrapper from './YamlJsonClientWrapper';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-yaml"
          title="How it Works: YAML is a Superset of JSON"
          preview="Learn why every valid JSON file is technically a valid YAML file."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              YAML and JSON are often seen as competing formats, but they are actually mathematically related: YAML version 1.2 is a strict superset of JSON. This means that <strong>every valid JSON file is automatically a valid YAML file.</strong>
            </p>
            <h3>Why convert?</h3>
            <p>
              If a YAML parser can natively read JSON, why do we need converters?
            </p>
            <p>
              Because the reverse is not true. JSON parsers cannot read YAML features like unquoted strings, comments, anchors (<code>&amp;id</code>), or multi-line block scalars (<code>|</code>). If an application only ships with a JSON parser (like a web browser with native <code>JSON.parse</code>), you must compile your YAML down to JSON before feeding it to the application.
            </p>
            <p>
              Because YAML contains features that don't exist in JSON (like comments), converting YAML to JSON is an inherently lossy process.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
