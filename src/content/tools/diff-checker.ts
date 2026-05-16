import { ToolContent } from '../../registry/types';

export const diffChecker: ToolContent = {
  detailedDescription:
    "Perform a line-by-line comparison of two text blocks to highlight additions, deletions, and unchanged lines — similar to `git diff`. Ideal for comparing configuration files, code versions, or any two pieces of text. All comparison runs locally in the browser.",
  howTo: [
    "Paste the original text into the left panel ('Before').",
    "Paste the updated text into the right panel ('After').",
    "The diff is computed instantly with added lines in green and removed lines in red.",
    "Scroll through the diff to review all changes.",
    "Use 'Unified' or 'Split' view to switch display modes.",
  ],
  faq: [
    {
      question: "Does it compare character-level differences?",
      answer:
        "By default the tool diffs line by line. Within a changed line, it may highlight the specific words or characters that changed depending on the view mode.",
    },
    {
      question: "Can I compare files instead of pasting text?",
      answer:
        "Yes. Use the file upload option to load text files directly. Binary files are not supported.",
    },
    {
      question: "Does whitespace matter in the comparison?",
      answer:
        "By default, trailing whitespace differences are flagged. Enable 'Ignore whitespace' mode to suppress whitespace-only changes.",
    },
  ],
  useCases: [
    "Reviewing changes to a configuration file before deploying",
    "Comparing two versions of a contract or document",
    "Verifying that a code refactor did not change behaviour",
    "Checking what changed between two API responses",
  ],
  commonErrors: [
    {
      error: "Entire file shows as changed when only one line differs",
      fix: "Check for mismatched line endings (CRLF vs. LF). Enable 'Ignore line endings' mode or normalize them first.",
    },
    {
      error: "Diff is very slow for large files",
      fix: "The algorithm is O(n²) in the worst case. For files larger than a few thousand lines, use a desktop tool like VS Code or `diff`.",
    },
    {
      error: "Colors are hard to read",
      fix: "Switch between light and dark mode. You can also switch to unified view for better contrast on small screens.",
    },
  ],
  alternatives: ["diffchecker.com", "VS Code diff editor", "git diff"],
};
