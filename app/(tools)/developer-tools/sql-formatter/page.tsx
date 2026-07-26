import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import SqlFormatterClientWrapper from './SqlFormatterClientWrapper';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding SQL Parsers and Formatting">
        
        <LearningSection type="architecture" title="Dialect-Aware Parsing">
          <p>Unlike JSON which has one strict universal standard, SQL is heavily fragmented into dozens of different "dialects" (PostgreSQL, MySQL, SQLite, T-SQL, etc.).</p>
          <p className="mt-2">Formatting SQL accurately requires understanding the specific grammar of that dialect. For example, some dialects use double quotes <code>"</code> for strings, while others use them strictly for identifiers (table names). A formatter must know the dialect to avoid corrupting the query logic.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Lexical Analysis (Tokenization)">
          <p>Before any formatting happens, the raw query string is passed through a <strong>Lexer</strong>, which breaks it down into an array of discrete tokens.</p>
          <p className="mt-2">For example, <code>SELECT * FROM users;</code> becomes an array: <code>["SELECT", "Whitespace", "*", "Whitespace", "FROM", "Whitespace", "users", "Punctuation"]</code>.</p>
          <p className="mt-2">The formatter then iterates through these tokens, discarding the original whitespace entirely. When it encounters a <code>SELECT</code> token, it knows the subsequent columns should be indented. When it hits a <code>FROM</code> or <code>WHERE</code> token, it triggers a new line and outdents. This state-machine approach ensures perfectly aligned queries regardless of how messy the original input was.</p>
        </LearningSection>

        <LearningSection type="failures" title="Syntax vs Formatting">
          <p>A SQL formatter is not a SQL validator. Because formatters usually rely on regex-based tokenizers rather than building a full Abstract Syntax Tree (which would be prohibitively slow and complex for every dialect in the browser), they will happily format completely invalid SQL (like <code>SELECT FROM WHERE WHERE;</code>).</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why must a SQL formatter be 'Dialect-Aware'?",
                options: [
                  "Because different databases use different character encodings.",
                  "Because different SQL databases (like Postgres vs MySQL) have slightly different syntax rules, reserved keywords, and quoting behaviors.",
                  "To connect to the database securely.",
                  "Because SQL is a compiled language."
                ],
                correctIndex: 1,
                explanation: "SQL is highly fragmented. What is valid syntax in T-SQL (SQL Server) might throw a syntax error in Postgres."
              },
              {
                question: "What is the role of a 'Lexer' in the formatting process?",
                options: [
                  "It connects to the database to verify the tables exist.",
                  "It executes the query to see if it works.",
                  "It breaks the raw string down into a sequence of classified tokens (e.g., Keywords, Identifiers, Punctuation) so the formatter can understand the structure.",
                  "It encrypts the SQL string."
                ],
                correctIndex: 2,
                explanation: "The Lexer performs 'Lexical Analysis', turning a dumb string into an array of meaningful tokens that the formatter can write rules against."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
