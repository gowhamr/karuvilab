import { ToolContent } from '../../registry/types';

export const regexTester: ToolContent = {
  detailedDescription:
    "Test regular expressions against sample text in real time with live match highlighting. Supports all JavaScript regex flags (`g`, `i`, `m`, `s`, `u`), named capture groups, and displays each match's index and captured groups. No data leaves your browser.",
  howTo: [
    "Enter your regular expression in the pattern field.",
    "Type or paste the sample text in the test area.",
    "All matches are highlighted immediately as you type.",
    "Review the match list below showing each match's value, index, and groups.",
    "Toggle flags (`g`, `i`, `m`, etc.) using the flag buttons.",
  ],
  faq: [
    {
      question: "Which regex flavor does this use?",
      answer:
        "JavaScript's built-in `RegExp` engine. Most common patterns are compatible, but features like lookbehinds require a modern browser (Chrome 62+, Firefox 78+).",
    },
    {
      question: "Why does my regex match nothing?",
      answer:
        "Check that special characters (`.`, `*`, `+`, `?`, `(`, `)`) are escaped with a backslash if you want them treated literally.",
    },
    {
      question: "What are flags and when do I use them?",
      answer:
        "`g` finds all matches (not just the first), `i` ignores case, `m` makes `^` and `$` match line boundaries, `s` makes `.` match newlines.",
    },
    {
      question: "Can I use named capture groups?",
      answer:
        "Yes. Use `(?<name>...)` syntax. Named groups are displayed alongside numeric groups in the match list.",
    },
  ],
  useCases: [
    "Building and testing an email validation regex",
    "Extracting dates or phone numbers from a block of text",
    "Debugging a complex search-and-replace pattern",
    "Learning regex syntax interactively",
  ],
  examples: [
    {
      label: "Match email addresses",
      input: "Contact us at hello@karuvilab.com or support@example.org",
      output: "Matches: hello@karuvilab.com, support@example.org",
    },
    {
      label: "Extract digits",
      input: "Order #4521 ships in 3 days",
      output: "Matches: 4521, 3",
    },
  ],
  commonErrors: [
    {
      error: "Regex throws 'Invalid regular expression'",
      fix: "Check for unmatched parentheses, brackets, or unescaped special characters in the pattern.",
    },
    {
      error: "Pattern only matches once even with the global flag",
      fix: "Ensure the `g` flag is enabled. Without it, `RegExp.exec` and `String.match` return only the first match.",
    },
    {
      error: "Catastrophic backtracking causes the browser to hang",
      fix: "Simplify nested quantifiers (e.g., `(a+)+`). These can cause exponential time complexity on certain inputs.",
    },
  ],
  alternatives: ["regex101.com", "regexr.com", "RegExBuddy"],
};
