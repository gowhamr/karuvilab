"use client";
import { useState, useMemo } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

const MISSPELLINGS: Record<string, string> = {
  "teh": "the", "recieve": "receive", "seperate": "separate", "occured": "occurred",
  "definately": "definitely", "accomodate": "accommodate", "believe": "believe",
  "calender": "calendar", "commited": "committed", "consious": "conscious",
  "embarrass": "embarrass", "existance": "existence", "foriegn": "foreign",
  "goverment": "government", "gaurd": "guard", "independant": "independent",
  "libary": "library", "neccesary": "necessary", "occasionaly": "occasionally",
  "perseverance": "perseverance", "privelege": "privilege", "wierd": "weird",
  "youre": "you're", "thier": "their", "untill": "until", "truely": "truly",
  "tommorrow": "tomorrow", "treshold": "threshold", "suprise": "surprise",
  "publically": "publicly", "peice": "piece", "patience": "patience",
  "originaly": "originally", "noticeible": "noticeable", "minut": "minute",
  "maintenence": "maintenance", "lightnig": "lightning", "knowlege": "knowledge",
  "immediatly": "immediately", "heighth": "height", "fourty": "forty",
  "enviroment": "environment", "dilema": "dilemma", "desperate": "desperate",
  "definetly": "definitely", "colleague": "colleague", "cemetery": "cemetery",
  "business": "business", "basicly": "basically", "arguement": "argument",
  "apparenty": "apparently", "acheive": "achieve", "dont": "don't", "cant": "can't",
  "wont": "won't", "shouldnt": "shouldn't", "couldnt": "couldn't", "wouldnt": "wouldn't",
  "doesnt": "doesn't", "isnt": "isn't", "arent": "aren't", "wasnt": "wasn't",
  "werent": "weren't", "hasnt": "hasn't", "havent": "haven't", "hadnt": "hadn't"
};

const PASSIVE_INDICATORS = [
  "is being", "are being", "was being", "were being",
  "has been", "have been", "had been",
  "will be", "would be", "could be", "should be",
  "is done", "was done", "are made", "was made",
];

const REDUNDANCIES: [RegExp, string][] = [
  [/\bcollaborate\s+together\b/gi, "collaborate"],
  [/\badvance\s+warning\b/gi, "warning"],
  [/\badded\s+bonus\b/gi, "bonus"],
  [/\bbasic\s+fundamentals\b/gi, "fundamentals"],
  [/\bfree\s+gift\b/gi, "gift"],
  [/\brepeat\s+again\b/gi, "repeat"],
  [/\bsum\s+total\b/gi, "total"],
  [/\bunexpected\s+surprise\b/gi, "surprise"],
];

const WORDY_PHRASES: [RegExp, string][] = [
  [/\bdue\s+to\s+the\s+fact\s+that\b/gi, "because"],
  [/\bat\s+this\s+point\s+in\s+time\b/gi, "now"],
  [/\bin\s+order\s+to\b/gi, "to"],
  [/\ba\s+large\s+number\s+of\b/gi, "many"],
  [/\bfor\s+the\s+purpose\s+of\b/gi, "for / to"],
  [/\bwith\s+the\s+exception\s+of\b/gi, "except"],
  [/\bin\s+the\s+event\s+that\b/gi, "if"],
  [/\bmake\s+a\s+decision\b/gi, "decide"],
  [/\btake\s+action\b/gi, "act"],
];

interface Issue {
  type: "misspelling" | "double-space" | "missing-space" | "capitalization" | "passive";
  message: string;
  original: string;
  suggestion?: string;
  start: number;
  end: number;
}

function analyzeText(text: string): Issue[] {
  const issues: Issue[] = [];

  // Double spaces
  let m;
  const dsRe = /  +/g;
  while ((m = dsRe.exec(text)) !== null) {
    issues.push({ type: "double-space", message: "Multiple spaces", original: m[0] ?? "", suggestion: " ", start: m.index, end: m.index + (m[0] ?? "").length });
  }

  // Missing space after punctuation
  const msRe = /([.!?,;:])([A-Za-z])/g;
  while ((m = msRe.exec(text)) !== null) {
    const punct = m[1] ?? "";
    const nextChar = m[2] ?? "";
    issues.push({ type: "missing-space", message: `Missing space after "${punct}"`, original: m[0] ?? "", suggestion: punct + " " + nextChar, start: m.index, end: m.index + (m[0] ?? "").length });
  }

  // Sentences not starting with capital
  const sentenceRe = /(?:^|[.!?]\s+)([a-z])/g;
  while ((m = sentenceRe.exec(text)) !== null) {
    // Find index of the actual character group matched
    const char = m[1] || "";
    const charIndex = m.index + m[0].length - 1;
    issues.push({
      type: "capitalization",
      message: "Sentence should start with a capital letter",
      original: char,
      suggestion: char.toUpperCase(),
      start: charIndex,
      end: charIndex + 1
    });
  }

  // Standalone 'i' capitalization
  const iRe = /\b(i)\b/g;
  while ((m = iRe.exec(text)) !== null) {
    issues.push({
      type: "capitalization",
      message: "Personal pronoun 'I' should be capitalized",
      original: m[0] ?? "",
      suggestion: "I",
      start: m.index,
      end: m.index + 1
    });
  }

  // Misspellings
  const wordRe = /\b[a-zA-Z']+\b/g;
  while ((m = wordRe.exec(text)) !== null) {
    const word = (m[0] ?? "").toLowerCase();
    if (MISSPELLINGS[word] !== undefined) {
      issues.push({
        type: "misspelling",
        message: `Possible misspelling: "${m[0] ?? ""}"`,
        original: m[0] ?? "",
        suggestion: MISSPELLINGS[word],
        start: m.index,
        end: m.index + (m[0] ?? "").length
      });
    }
  }

  // Redundancies
  for (const [re, suggestion] of REDUNDANCIES) {
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      issues.push({
        type: "passive", // Categorize style improvements as passive/style
        message: `Redundant phrasing: "${m[0] ?? ""}"`,
        original: m[0] ?? "",
        suggestion,
        start: m.index,
        end: m.index + (m[0] ?? "").length
      });
    }
  }

  // Wordy Phrases
  for (const [re, suggestion] of WORDY_PHRASES) {
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      issues.push({
        type: "passive",
        message: `Wordy phrase, consider simplifying: "${m[0] ?? ""}"`,
        original: m[0] ?? "",
        suggestion,
        start: m.index,
        end: m.index + (m[0] ?? "").length
      });
    }
  }

  // Passive voice
  for (const pi of PASSIVE_INDICATORS) {
    const reP = new RegExp(`\\b${pi.replace(/\s/g, "\\s+")}\\b`, "gi");
    while ((m = reP.exec(text)) !== null) {
      issues.push({ type: "passive", message: `Possible passive voice: "${m[0] ?? ""}"`, original: m[0] ?? "", start: m.index, end: m.index + (m[0] ?? "").length });
    }
  }

  return issues.sort((a, b) => a.start - b.start);
}

const TYPE_STYLES: Record<string, string> = {
  misspelling: "bg-red-500/20 border-b-2 border-red-500",
  "double-space": "bg-yellow-400/20 border-b-2 border-yellow-500",
  "missing-space": "bg-orange-400/20 border-b-2 border-orange-500",
  capitalization: "bg-blue/20 border-b-2 border-blue",
  passive: "bg-purple-400/20 border-b-2 border-purple-500",
};

export default function GrammarCheckerClient() {
  const [text, setText] = useState("Teh government should cooperate together in order to make a decision. i believe this has been completed.");
  const [hovered, setHovered] = useState<number | null>(null);

  const issues = useMemo(() => (text ? analyzeText(text) : []), [text]);

  const highlighted = useMemo(() => {
    if (!text || issues.length === 0) return [{ text, issue: null as Issue | null }];
    const parts: { text: string; issue: Issue | null }[] = [];
    let last = 0;
    for (const issue of issues) {
      // Handle overlapping issues safely
      if (issue.start >= last) {
        if (issue.start > last) parts.push({ text: text.slice(last, issue.start), issue: null });
        parts.push({ text: text.slice(issue.start, issue.end), issue });
        last = issue.end;
      }
    }
    if (last < text.length) parts.push({ text: text.slice(last), issue: null });
    return parts;
  }, [text, issues]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { misspelling: 0, "double-space": 0, "missing-space": 0, capitalization: 0, passive: 0 };
    issues.forEach(i => c[i.type] = (c[i.type] ?? 0) + 1);
    return c;
  }, [issues]);

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-bold text-text-2">Your Text</label>
        <textarea
          className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none transition-all resize-none"
          rows={8}
          placeholder="Type or paste your text here for a basic grammar check…"
          value={text}
          onChange={e => setText(e.target.value)}
          spellCheck={false}
        />
      </div>

      {text && (
        <div className="space-y-4">
          <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-sm">
            {[
              { key: "misspelling", label: "Misspellings", color: "text-red-500" },
              { key: "capitalization", label: "Capitalization", color: "text-blue" },
              { key: "missing-space", label: "Missing Spaces", color: "text-orange-500" },
              { key: "double-space", label: "Double Spaces", color: "text-yellow-600" },
              { key: "passive", label: "Passive & Style", color: "text-purple-500" },
            ].map(({ key, label, color }) => (
              <div key={key} className="bg-surface border border-border p-3 rounded-xl">
                <dd className={`text-xl font-black ${color}`}>{counts[key]}</dd>
                <dt className="text-xs text-text-4 mt-0.5">{label}</dt>
              </div>
            ))}
          </dl>

          {issues.length > 0 ? (
            <>
              <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
                <h2 className="text-sm font-bold text-text-2">Highlighted Text</h2>
                <div className="font-mono text-sm text-text bg-bg border border-border rounded-xl p-4 leading-loose whitespace-pre-wrap">
                  {highlighted.map((part, i) =>
                    part.issue ? (
                      <span
                        key={i}
                        className={`rounded px-0.5 cursor-help ${TYPE_STYLES[part.issue.type]}`}
                        title={`${part.issue!.message}${part.issue!.suggestion ? " → " + part.issue!.suggestion : ""}`}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {part.text}
                      </span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </div>
              </div>

              <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
                <h2 className="text-sm font-bold text-text-2">Issues ({issues.length})</h2>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 bg-bg border border-border rounded-xl p-3 text-sm">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        issue.type === "misspelling" ? "bg-red-500/10 text-red-500" :
                        issue.type === "passive" ? "bg-purple-500/10 text-purple-500" :
                        issue.type === "capitalization" ? "bg-blue/10 text-blue" :
                        "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {issue.type.replace("-", " ")}
                      </span>
                      <div>
                        <p className="text-text">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-xs text-text-4 mt-0.5">Suggestion: <span className="text-green-600 font-medium">{issue.suggestion}</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-sm text-green-600 font-medium text-center">
              No issues detected with basic checks.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
