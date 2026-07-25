import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import CodeFormatterClientWrapper from './CodeFormatterClientWrapper';

const toolId = 'format';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Code Formatter"
      description="Format JSON, HTML, CSS, SQL, and Markdown. Note: for production-quality formatting, consider Prettier locally."
      category={cat}
      toolId={toolId}
    >
      <CodeFormatterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-formatter"
          title="How it Works: Abstract Syntax Trees"
          preview="Learn how formatters understand your code to format it safely."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Formatting code isn't as simple as just adding spaces after every curly brace. A reliable formatter must understand the actual structure of the code, so it doesn't accidentally break things (like splitting a URL string in half).
            </p>
            <h3>Parsing to an AST</h3>
            <p>
              To do this safely, formatters typically parse the source code into an <strong>Abstract Syntax Tree (AST)</strong>. The AST is a massive JSON object representing every variable, function, and block of logic.
            </p>
            <p>
              Once the AST is built, the formatter completely ignores all the original whitespace from the file. It traverses the tree and prints the code back out from scratch, applying a consistent set of rules (like indenting inside blocks) as it goes. This guarantees that the final code functions exactly the same, but with perfectly uniform spacing.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
