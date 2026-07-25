import { ToolContent } from '../../registry/types';

export const regexTester: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Regex Engineering & ReDoS Attacks

Welcome to the engineering guide to Regular Expressions (Regex). This handbook explores the mathematical power of pattern matching, and the catastrophic performance flaw that can freeze an enterprise server for years.

---

## 1. Prerequisites: The Language of Patterns

Regex is a sequence of characters that defines a search pattern. Instead of writing 50 lines of \`if/else\` statements to check if a string is a valid email address, you can write a single line of Regex.

**Core Mechanics:**
- **Character Classes:** \`[a-z]\` matches any lowercase letter. \`\\d\` matches any number.
- **Quantifiers:** \`+\` means "1 or more". \`*\` means "0 or more". \`{2,4}\` means "between 2 and 4 times".
- **Anchors:** \`^\` forces the match to start at the beginning of the string. \`$\` forces it to end at the string's conclusion.
- **Groups:** \`(cat|dog)\` matches either "cat" or "dog" and captures the result for later use.

---

## 2. Threat Model: The ReDoS Catastrophe

Regular Expressions look simple, but under the hood, they are executed by complex mathematical engines (Finite Automata). Most programming languages (JavaScript, Python, Java) use an **NFA (Nondeterministic Finite Automaton)** engine.

NFA engines evaluate patterns using **Backtracking**. If the engine goes down a path that fails, it steps back and tries another path.

### The Attack (Catastrophic Backtracking)
Imagine a developer writes this Regex to validate an email:
\`^([a-zA-Z0-9]+\\s?)+$\`

A hacker submits this payload:
\`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaX\`

**What happens?**
The regex engine matches the first \`a\`. The \`+\` operator tells it to keep matching \`a\`s. It gets to the end and sees the \`X\`. The match fails.
The engine then **backtracks**. It tries grouping the \`a\`s differently (maybe 2 at a time, maybe 3 at a time). 
Because of the nested \`+\` operators, the number of possible combinations the engine must check is $2^N$ (where N is the length of the string).

For a 40-character string, the engine must check $2^{40}$ (1 Trillion) combinations. 
**The Node.js server instantly freezes at 100% CPU.** It will literally take 5 years to finish calculating that the string doesn't match. The hacker has achieved a **Regular Expression Denial of Service (ReDoS)** attack using just 40 characters.

**The Fix:** Never use nested quantifiers like \`(a+)+\`. Cloudflare famously experienced a massive global outage in 2019 because a single poorly written Regex in their WAF caused catastrophic backtracking across their entire network.

---

## 3. Engineering Challenge: Greedy vs Lazy Matching

Another massive trap for junior developers is "Greediness".

Imagine you have this HTML: \`<div>Hello</div><div>World</div>\`
You want to extract the content inside the first div. You write the regex: \`<div>(.*)</div>\`

**The Bug:** The \`*\` quantifier is **Greedy**. It matches as much text as mathematically possible. It will match the very first \`<div>\`, skip right past the first \`</div>\`, and keep going until the very last \`</div>\` in the document. Your result is \`Hello</div><div>World\`.

**The Fix:** You must make the quantifier **Lazy** by appending a \`?\`. 
The regex \`<div>(.*?)</div>\` tells the engine to stop matching at the very *first* instance of the closing tag.

---

## 4. Production Workflows

- **Data Sanitization:** Backend APIs use strict Regex to strip dangerous characters from usernames and passwords before passing them to the database.
- **Log Parsing:** Site Reliability Engineers (SREs) write massive Regex patterns in Kibana or Splunk to instantly extract specific IP addresses and error codes from millions of raw text logs.

---

## 5. Standards & References
- **PCRE (Perl Compatible Regular Expressions):** The industry standard syntax that almost all modern programming languages emulate.

---

## 6. Interactive Quiz

**Beginner:**
1. What does the regex \`^\\d{4}$\` match? *(Answer: It strictly matches exactly four numbers, nothing more, nothing less. Useful for PIN codes).*

**Intermediate:**
2. What is the difference between a Greedy and Lazy quantifier? *(Answer: A Greedy quantifier matches as much text as possible. A Lazy quantifier (using '?') stops at the very first valid match).*

**Advanced:**
3. What is a ReDoS attack, and why does it crash servers? *(Answer: Regular Expression Denial of Service. It occurs when a hacker submits a carefully crafted string to a poorly written Regex containing nested quantifiers. The regex engine experiences "catastrophic backtracking", requiring trillions of calculations and freezing the CPU).*

---
*End of Elite Learning Hub Content.*
`,
  howTo: [
    "**Step 1:** Enter your Regular Expression in the top field.",
    "**Step 2:** Select the global flags (e.g., 'g' for Global, 'i' for Case Insensitive).",
    "**Step 3:** Paste your target text in the main body.",
    "**Step 4:** The tool will execute the Regex engine in real-time, highlighting all matches and explicitly identifying individual Capture Groups."
  ],
  faq: [
    {
      question: "Are there differences in Regex across languages?",
      answer: "Yes. While PCRE is the standard, JavaScript's regex engine differs slightly from Python or Java. This tool uses the native JavaScript engine, so behavior perfectly matches JS execution."
    },
    {
      question: "Will testing a bad regex crash my browser?",
      answer: "Yes. If you write a regex capable of catastrophic backtracking and provide a long string, it will freeze your current browser tab just like it would freeze a Node.js server."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["XML Formatter", "JSON Formatter"]
};
