import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import JsonToTsClientWrapper from '@/src/features/json-to-ts/JsonToTsClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding Type Inference Algorithms">
        
        <LearningSection type="architecture" title="The Problem with JSON">
          <p>JSON (JavaScript Object Notation) has no formal concept of strict types. It only supports primitive values (strings, numbers, booleans, null) and structures (objects, arrays). When converting an arbitrary JSON payload from a REST API into strict TypeScript interfaces, the compiler has to guess the types using <strong>Type Inference</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Handling Arrays & Optionals">
          <p>Type inference becomes incredibly complex when dealing with arrays of objects.</p>
          <p className="mt-2">If an array of user objects has a key <code>"age"</code> that is a number in the first object, but missing entirely in the second object, a smart type inferencer must scan <em>every</em> object in the array before making a decision. It will then mark the field as optional: <code>age?: number;</code>.</p>
          <p className="mt-2">Similarly, if a field is a string in one object but a number in another, it will infer a union type: <code>string | number</code>.</p>
        </LearningSection>

        <LearningSection type="performance" title="AST Traversal">
          <p>To generate these types, this tool parses the JSON into an Abstract Syntax Tree (AST). It recursively traverses every node, gathering a list of all possible data types observed for every single object key across the entire document.</p>
          <p className="mt-2">It then runs a reduction algorithm to squash those lists down into a minimal, clean set of TypeScript interfaces. This prevents generating hundreds of duplicate nested interfaces if the same object structure appears in multiple places in the JSON.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If a JSON array contains two objects: [{ 'status': 200 }, { 'status': 'OK' }], how should a TypeScript inferencer type the 'status' field?",
                options: [
                  "status: any;",
                  "status: string | number;",
                  "status: string;",
                  "status?: number;"
                ],
                correctIndex: 1,
                explanation: "Because the inferencer observed both a number and a string for the exact same key across different array elements, it must generate a Union Type to safely encompass both possibilities."
              },
              {
                question: "Why do type inferencers sometimes generate 'key?: type' (optional keys)?",
                options: [
                  "Because JSON keys are always optional by default.",
                  "Because the inferencer saw a key present in one object inside an array, but completely missing in another object in that same array.",
                  "Because the value of the key was null.",
                  "To save memory during compilation."
                ],
                correctIndex: 1,
                explanation: "If a key is not universally present across all objects of the same presumed type in an array, TypeScript requires it to be marked as optional so the compiler knows it might be undefined."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
