import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import JsonToTsClientWrapper from '@/src/features/json-to-ts/JsonToTsClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const cat = CATEGORIES.find(c => c.id === 'developer');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("json-to-ts");
}

export default function Page() {
  return (
    <ToolShell 
      toolId="json-to-ts" 
      title="JSON to TypeScript"
      category={cat}
    >
      <JsonToTsClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-inference"
          title="How it Works: Type Inference"
          preview="Learn how algorithms deduce TypeScript interfaces from raw JSON."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              JSON has no concept of types. It only has primitives (strings, numbers, booleans) and structures (objects, arrays). When converting JSON to TypeScript interfaces, we have to use <strong>Type Inference</strong>.
            </p>
            <h3>Handling Nulls and Optionals</h3>
            <p>
              If an array of objects has a key <code>"age"</code> that is a number in the first object, but missing entirely in the second object, a smart type inferencer will mark it as optional: <code>age?: number;</code>. 
            </p>
            <p>
              If a field is sometimes a string and sometimes a number, it will infer a union type: <code>string | number</code>. 
            </p>
            <p>
              This tool traverses the JSON AST recursively, gathering all possible types for every key across all instances, and then reduces them into a minimal, clean set of TypeScript interfaces, allowing you to instantly type your API responses.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
