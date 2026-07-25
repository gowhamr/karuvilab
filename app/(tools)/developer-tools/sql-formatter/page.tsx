import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import SqlFormatterClientWrapper from './SqlFormatterClientWrapper';

const toolId = 'sql-formatter';
const cat = CATEGORIES.find(c => c.id === 'developer');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell
      title="SQL Formatter & Beautifier"
      description="Format, indent, and beautify SQL queries with custom keyword capitalization and indent spaces."
      category={cat}
      toolId={toolId}
    >
      <SqlFormatterClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-sql"
          title="How it Works: Dialect-Aware Parsing"
          preview="Learn why formatting SQL is harder than formatting JSON."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike JSON which has one strict universal standard, SQL has dozens of different "dialects" (PostgreSQL, MySQL, SQLite, T-SQL, etc.). Formatting SQL accurately requires understanding the specific grammar of that dialect.
            </p>
            <h3>Lexical Analysis (Tokenization)</h3>
            <p>
              Before formatting, the string is passed through a Lexer, which breaks it down into an array of tokens. For example, <code>SELECT * FROM users;</code> becomes <code>["SELECT", "Whitespace", "*", "Whitespace", "FROM", "Whitespace", "users", "Punctuation"]</code>.
            </p>
            <p>
              The formatter then iterates through these tokens, discarding the original whitespace, and applying structural rules. When it sees a <code>SELECT</code> token, it knows the following columns should be indented. When it hits a <code>FROM</code> token, it drops down to a new line and outdents. This state-machine approach ensures perfectly aligned queries regardless of how messy the original input was.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
