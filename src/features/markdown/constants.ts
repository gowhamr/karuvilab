export const SAMPLE_MARKDOWN = `# MarkFlow — Complete Markdown Reference

> 📖 A **comprehensive showcase** of every Markdown feature — text formatting, code, tables, lists, diagrams, math notation, and more. Use this as your reference guide.

---

## Table of Contents

- [Text Formatting](#text-formatting)
- [Headings](#headings)
- [Blockquotes](#blockquotes)
- [Lists](#lists)
- [Task Lists](#task-lists)
- [Code](#code)
- [Tables](#tables)
- [Diagrams & Flowcharts](#diagrams--flowcharts)

---

## Text Formatting

| Style | Markdown | Result |
|-------|----------|--------|
| Bold | **text** | **bold** |
| Italic | *text* | *italic* |
| Strikethrough | ~~text~~ | ~~strikethrough~~ |
| Inline code | \`code\` | \`code\` |

You can **combine** *different* ***styles*** in a ~~single~~ sentence with \`inline code\` and [links](https://karuvilab.com).

---

## Headings

# H1 — Page Title
## H2 — Major Section
### H3 — Sub-section

---

## Blockquotes

> This is a simple blockquote.

> **Nested blockquotes** are also supported:
>
> > This is a nested blockquote inside the outer one.

---

## Lists

### Unordered Lists

- First item
- Second item
- Third item
  - Nested item 3.1

### Ordered Lists

1. First step
2. Second step
3. Third step

---

## Task Lists

- [x] ✅ Set up project repository
- [x] ✅ Configure Markdown parser
- [ ] 🔲 Collaborative editing (coming soon)

---

## Code

\`\`\`javascript
function hello() {
  console.log("Hello, KaruviLab!");
}
\`\`\`

---

## Tables

| Column A | Column B | Column C |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |

---

## Diagrams & Flowcharts

\`\`\`mermaid
flowchart TD
    A([Start]) --> B{Is it working?}
    B -- Yes --> C[Ship it! 🚀]
    B -- No  --> D[Debug]
    D --> E[Fix the bug]
    E --> B
    C --> F([Done])
\`\`\`

---

## Summary

🎉 **Happy writing with KaruviLab Markdown!**
`;

export const DIAGRAM_SNIPPETS = {
  flowchart: "```mermaid\nflowchart TD\n    A([Start]) --> B{Is it working?}\n    B -- Yes --> C[Ship it! 🚀]\n    B -- No  --> D[Debug]\n    D --> E[Fix the bug]\n    E --> B\n    C --> F([Done])\n```",
  sequence:  "```mermaid\nsequenceDiagram\n    participant U as User\n    participant S as Server\n    participant DB as Database\n    U->>S: POST /login\n    S->>DB: Verify credentials\n    DB-->>S: User record\n    S-->>U: JWT Token ✓\n```",
  pie:       "```mermaid\npie title Export Usage\n    \"HTML\"  : 42\n    \"PDF\"   : 35\n    \"Word\"  : 23\n```",
  gantt:     "```mermaid\ngantt\n    title Project Timeline\n    section Planning\n    Reqs :done, 2024-01-01, 7d\n```",
  class:     "```mermaid\nclassDiagram\n    Animal <|-- Dog\n```",
  er:        "```mermaid\nerDiagram\n    USER ||--o{ ORDER : \"places\"\n```"
};
