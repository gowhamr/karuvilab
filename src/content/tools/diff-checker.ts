import { ToolContent } from '../../registry/types';

export const diffChecker: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: The Myers Diff Algorithm

Welcome to the engineering guide to Diff Checking. This handbook explains the mathematical algorithm that powers Git, GitHub, and every code review on the planet.

---

## 1. Prerequisites: The "What Changed?" Problem

Imagine you have two text files. 
File A (Old): \`ABCABBA\`
File B (New): \`CBABAC\`

If you just look at them side-by-side, it's hard to tell exactly what the author deleted or added.
A computer needs a formal, mathematical way to determine the absolute shortest sequence of "Insertions" and "Deletions" required to turn File A into File B.

**The Solution:** The Longest Common Subsequence (LCS) problem, famously solved for software engineering by Eugene Myers in 1986.

---

## 2. Core Concepts: The Myers Algorithm

The Myers Diff algorithm doesn't just guess. It treats the problem as finding the shortest path through a 2D grid.
- **X-Axis:** The characters in File A.
- **Y-Axis:** The characters in File B.

The algorithm draws a graph. 
- Moving Right means: "The author deleted a character from File A."
- Moving Down means: "The author inserted a new character into File B."
- Moving Diagonally means: "The characters perfectly match! No change needed."

The algorithm explores the grid, searching for the path that requires the fewest horizontal/vertical movements (the fewest edits). This is heavily optimized using Dynamic Programming to run in $O(ND)$ time complexity, where $N$ is the file length and $D$ is the number of differences.

---

## 3. Engineering Challenge: Context vs Strict Math

While the Myers algorithm finds the mathematically smallest number of edits, it sometimes produces results that are confusing for humans to read.

**The Problem:**
If you delete the closing brace \`}\` of Function A, and insert a new closing brace \`}\` at the end of Function B, strict math might align them, confusing the visual representation of the code blocks.

**The Fix (Patience Diff):** Modern tools often use heuristic tweaks (like "Patience Diff" or "Histogram Diff"). These algorithms first scan the files for unique, rare lines (like function names) and use those as immovable anchor points. This guarantees the Diff is optimized for human code-review logic, rather than just raw mathematical brevity.

---

## 4. Production Workflows

- **Git & Version Control:** When you run \`git diff\`, the terminal executes a highly optimized C implementation of the Myers algorithm.
- **Continuous Integration (CI):** Platforms like GitHub automatically block Pull Requests if the Diff algorithm detects that multiple developers modified the exact same anchor point, triggering a "Merge Conflict" that requires manual human intervention.

---

## 5. Interactive Quiz

**Beginner:**
1. What does a Diff tool actually do? *(Answer: It compares two text files and visually highlights the exact lines and characters that were inserted or deleted).*

**Intermediate:**
2. Why is finding the differences between files computationally difficult? *(Answer: Because the computer must calculate the absolute shortest possible sequence of edits (Longest Common Subsequence), which requires traversing a complex mathematical matrix).*

**Advanced:**
3. Why did engineers invent "Patience Diff" as an upgrade to the standard Myers algorithm? *(Answer: Because the standard algorithm optimizes for mathematical brevity, which can sometimes misalign code blocks. Patience Diff anchors the comparison on unique lines (like function names) to ensure the output makes logical sense to a human code reviewer).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Paste your Original text in the left pane.",
    "**Step 2:** Paste your Modified text in the right pane.",
    "**Step 3:** The tool instantly executes the Diff Algorithm locally.",
    "**Step 4:** Review the highlighted output. Red indicates text that was deleted from the original; Green indicates text that was inserted."
  ],
  faq: [
    {
      question: "Are my sensitive code files uploaded to a server?",
      answer: "No. The Diff algorithm executes entirely within your browser's local JavaScript engine. No data is transmitted."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["File Viewer Diff", "Code Minifier"]
};
