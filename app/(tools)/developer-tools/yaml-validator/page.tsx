import YamlClientWrapper from "./YamlClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";

const toolId = "yaml-validator";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function YamlValidatorPage() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;

  return (
    <ToolShell
      toolId={toolId}
      title="YAML Validator & Converter"
      description="Validate YAML syntax and convert between YAML and JSON seamlessly."
      category={cat}
    >
      <YamlClientWrapper />

      <LearningHub title="Understanding YAML Parsing and Type Inference">
        
        <LearningSection type="architecture" title="Implicit Typing">
          <p>Unlike JSON, which enforces strict typing by requiring quotes around all strings, YAML relies heavily on <strong>implicit typing</strong> to keep files clean and readable for humans.</p>
          <p className="mt-2">A YAML parser reads an unquoted value and uses a series of regular expressions to infer its type. If it sees <code>age: 25</code>, it infers an Integer. If it sees <code>name: Alice</code>, it infers a String. While this makes writing YAML fast, it introduces severe parsing ambiguities.</p>
        </LearningSection>
        
        <LearningSection type="failures" title="The Norway Problem">
          <p>In the older YAML 1.1 specification, the standard defined a massive set of boolean aliases. Along with <code>true</code> and <code>false</code>, words like <code>yes</code>, <code>no</code>, <code>on</code>, and <code>off</code> were also evaluated as booleans.</p>
          <p className="mt-2">This led to the infamous "Norway Problem" in software engineering. If a developer wrote a list of ISO country codes for a configuration file:</p>
          <pre className="my-2 bg-kv-surface-2 p-3 rounded-md overflow-x-auto text-sm text-kv-text font-mono border border-kv-border">
{`countries:
  - GB
  - FR
  - NO`}
          </pre>
          <p className="mt-2">The parser would infer <code>GB</code> as a string, <code>FR</code> as a string, and <code>NO</code> as the boolean value <code>false</code>. This silently corrupted millions of configuration files globally.</p>
        </LearningSection>

        <LearningSection type="standards" title="YAML 1.2 Standard">
          <p>To fix these issues, the YAML 1.2 specification (released in 2009) modernized the format to match JSON semantics.</p>
          <p className="mt-2">It strictly removed the ambiguous boolean aliases (so <code>yes</code> and <code>no</code> are now just strings). However, a terrifying amount of legacy infrastructure and popular parsers (including PyYAML in Python) still default to the YAML 1.1 spec today. Because of this, security and devops engineers strongly recommend <strong>explicitly quoting</strong> any string that could be mistaken for a number or boolean in YAML.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "In the infamous 'Norway Problem', how did older YAML parsers interpret the string 'NO' in a list of country codes?",
                options: [
                  "They threw a syntax error.",
                  "They interpreted it as the boolean value 'false'.",
                  "They interpreted it as the integer 0.",
                  "They correctly interpreted it as a string."
                ],
                correctIndex: 1,
                explanation: "Under YAML 1.1, the string 'NO' (unquoted) was treated as a boolean alias for false, causing massive data corruption bugs in Geo-IP systems."
              },
              {
                question: "How can you protect a YAML file from unexpected type inference bugs?",
                options: [
                  "Run it through a minifier.",
                  "Only use lowercase letters.",
                  "Explicitly wrap strings in quotes (e.g., 'NO', '25', 'true').",
                  "Avoid using lists."
                ],
                correctIndex: 2,
                explanation: "Wrapping a value in quotes forces the YAML parser to treat it as a String, bypassing the regex-based implicit type inference."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
