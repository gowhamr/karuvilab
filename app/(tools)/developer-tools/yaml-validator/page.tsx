import YamlClientWrapper from "./YamlClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-norway"
          title="How it Works: The Norway Problem"
          preview="Learn the most infamous bug in YAML parsing history."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike JSON, YAML allows you to omit quotes around strings. A parser reads the value and tries to infer its type. If it sees <code>age: 25</code>, it infers an Integer. If it sees <code>name: Alice</code>, it infers a String.
            </p>
            <h3>The Infamous Bug</h3>
            <p>
              In YAML 1.1, the spec defined a set of boolean aliases. Along with <code>true</code> and <code>false</code>, words like <code>yes</code>, <code>no</code>, <code>on</code>, and <code>off</code> were also parsed as booleans.
            </p>
            <p>
              This led to the "Norway Problem". If a developer wrote a config file with a list of country codes:
            </p>
            <pre><code>countries:
  - GB
  - FR
  - NO</code></pre>
            <p>
              The parser would infer <code>GB</code> as a string, <code>FR</code> as a string, and <code>NO</code> as the boolean value <code>false</code>. This silently corrupted millions of configuration files globally. YAML 1.2 fixed this by removing these ambiguous aliases, but many older parsers still use the 1.1 spec, which is why explicit quoting is highly recommended in YAML.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
