import WordCounterClientWrapper from "./WordCounterClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
import { Metadata } from "next";

const toolId = "word-counter";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function WordCounterPage() {
  const cat = CATEGORIES.find(c => c.id === 'productivity')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in real-time. Estimate reading time and analyze your text."
      category={cat}
    >
      <WordCounterClientWrapper />

      <LearningHub title="Understanding Linguistic Tokenization">
        
        <LearningSection type="architecture" title="The Space Split Fallacy">
          <p>The most common mistake junior developers make when building a word counter is writing code like <code>text.split(' ').length</code>. This assumes that all languages use spaces to separate words.</p>
          <p className="mt-2">Languages like Japanese, Chinese, and Thai do not use spaces between words. If you paste a 500-word Japanese essay into a naive word counter built with <code>split(' ')</code>, it will tell you the document contains exactly 1 word.</p>
        </LearningSection>
        
        <LearningSection type="api" title="Intl.Segmenter">
          <p>To count words accurately across all human languages, modern JavaScript provides the <code>Intl.Segmenter</code> API. This powerful built-in tool uses the browser's deeply embedded linguistic rules to properly slice text into graphemes, words, or sentences.</p>
          <p className="mt-2">By calling <code>new Intl.Segmenter('en', &#123; granularity: 'word' &#125;)</code>, the browser analyzes the text and correctly identifies word boundaries, completely bypassing the need for fragile Regular Expressions (Regex) and supporting languages without spaces natively.</p>
        </LearningSection>

        <LearningSection type="failures" title="Emoji Character Lengths">
          <p>How many characters is the family emoji (👨‍👩‍👧‍👦)? Visually, it is one. But under the hood in JavaScript, it is <strong>11 characters long</strong>.</p>
          <p className="mt-2">Emojis are constructed using multiple Unicode points combined with Zero-Width Joiners (ZWJ). A naive <code>text.length</code> check will report 11 characters for a single family emoji. A professional tool must use the <code>Intl.Segmenter</code> with grapheme granularity to correctly count this complex combination as a single visual character.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "Why does the naive text.split(' ').length method fail completely for languages like Japanese?",
                options: [
                  "Because Japanese text is written right-to-left.",
                  "Because Japanese uses emojis instead of text.",
                  "Because languages like Japanese do not use spaces between words.",
                  "Because split() is not supported in Asia."
                ],
                correctIndex: 2,
                explanation: "Without spaces to split on, the function treats the entire document as a single, massive string."
              },
              {
                question: "What modern JavaScript API should be used to accurately break text into words across all global languages?",
                options: [
                  "text.split()",
                  "Intl.Segmenter",
                  "RegExp",
                  "Math.round()"
                ],
                correctIndex: 1,
                explanation: "Intl.Segmenter is a powerful localization API built into modern browsers specifically designed to understand complex linguistic boundaries."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
