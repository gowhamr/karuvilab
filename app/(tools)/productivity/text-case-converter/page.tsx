import TextCaseConverterClientWrapper from "./TextCaseConverterClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import { Metadata } from "next";

const toolId = "text-case-converter";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TextCaseConverterPage() {
  const cat = CATEGORIES.find(c => c.id === 'productivity')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Sentence case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and alternating case."
      category={cat}
    >
      <TextCaseConverterClientWrapper />

      <LearningHub title="Understanding Casing Standards">
        
        <LearningSection type="architecture" title="Programming Case Conventions">
          <p>Different programming languages and frameworks enforce strict conventions for how variables, functions, and files should be named. This is because spaces aren't allowed in most variable names.</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>camelCase:</strong> Used for JavaScript/TypeScript variables and functions. (e.g., <code>firstName</code>)</li>
            <li><strong>PascalCase:</strong> Used for React Components, Classes, and Java/C# types. (e.g., <code>UserProfile</code>)</li>
            <li><strong>snake_case:</strong> The standard for Python variables and PostgreSQL database columns. (e.g., <code>user_id</code>)</li>
            <li><strong>kebab-case:</strong> Mandatory for URLs (slugs), CSS class names, and HTML attributes. (e.g., <code>btn-primary</code>)</li>
          </ul>
        </LearningSection>
        
        <LearningSection type="api" title="The Unicode Lowercase Problem">
          <p>Converting text to uppercase or lowercase seems simple until you encounter international characters. The standard JavaScript <code>toLowerCase()</code> function only works correctly for standard ASCII characters.</p>
          <p className="mt-2">For example, the Turkish language has two types of 'i' (dotted and dotless). A standard <code>toLowerCase()</code> on the Turkish uppercase 'I' might produce the wrong character. Professional text manipulation libraries must use <code>toLocaleLowerCase('tr-TR')</code> or advanced Unicode-aware libraries to correctly change casing across all global languages.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Which casing convention is standard for creating URLs and CSS classes?",
                options: [
                  "camelCase (e.g., btnPrimary)",
                  "kebab-case (e.g., btn-primary)",
                  "snake_case (e.g., btn_primary)",
                  "PascalCase (e.g., BtnPrimary)"
                ],
                correctIndex: 1,
                explanation: "kebab-case is web-standard for URLs and CSS because it is universally safe and easily readable."
              },
              {
                question: "Why is a simple text.toLowerCase() dangerous in global applications?",
                options: [
                  "Because it deletes numbers.",
                  "Because it can't handle spaces.",
                  "Because it fails to correctly convert certain characters in languages like Turkish (e.g., dotted vs dotless 'i').",
                  "Because it is too slow for modern browsers."
                ],
                correctIndex: 2,
                explanation: "Unicode casing rules change depending on the user's locale, meaning a hardcoded lowercasing function can corrupt text in certain languages."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
