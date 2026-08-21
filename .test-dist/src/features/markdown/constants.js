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
- [ ] 🔲 Integrated preview mode

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
    flowchart: "```mermaid\nflowchart TD\n    A([Start]) --> B{Is it working?}\n    B -- Yes --> C[Ship it! 🚀]\n    B -- No  --> D[Debug]\n    D --> E[Fix the bug]\n    E --> B\n    C --> F([Done])\n```\n",
    sequence: "```mermaid\nsequenceDiagram\n    autonumber\n    actor User as Client\n    participant S as Auth Server\n    participant DB as Postgres DB\n    User->>S: POST /api/login\n    S->>DB: Query user by email\n    DB-->>S: User profile record\n    S-->>User: 200 OK (JWT Token)\n```\n",
    class: "```mermaid\nclassDiagram\n    class Shape {\n      +int x\n      +int y\n      +draw() void\n    }\n    class Circle {\n      +int radius\n      +area() float\n    }\n    Shape <|-- Circle\n```\n",
    state: "```mermaid\nstateDiagram-v2\n    [*] --> Idle\n    Idle --> Processing : Submit\n    Processing --> Success : Validated\n    Processing --> Error : Failed\n    Error --> Idle : Retry\n    Success --> [*]\n```\n",
    er: "```mermaid\nerDiagram\n    USER ||--o{ ORDER : \"places\"\n    ORDER |||--|{ ITEM : \"contains\"\n    USER {\n        string id PK\n        string email\n        string name\n    }\n```\n",
    gantt: "```mermaid\ngantt\n    title Engineering Project Timeline\n    dateFormat YYYY-MM-DD\n    section Architecture\n    Design Spec      :done,    des1, 2026-08-01, 2026-08-07\n    Worker Pipeline  :active,  dev1, 2026-08-08, 14d\n    section Testing\n    Security Audit   :crit,    sec1, 2026-08-22, 7d\n```\n",
    gitgraph: "```mermaid\ngitGraph\n    commit id: \"Init\"\n    branch feature\n    checkout feature\n    commit id: \"Add AST parser\"\n    commit id: \"Add L1 cache\"\n    checkout main\n    merge feature id: \"Merge PR #42\"\n```\n",
    mindmap: "```mermaid\nmindmap\n  root((KaruviLab))\n    Markdown Engine\n      TipTap WYSIWYG\n      Web Worker Parser\n      AST Synchronizer\n    Mermaid Subsystem\n      Preflight Analyzer\n      Strict Security\n      LRU Cache\n      Export Adapter\n```\n",
    timeline: "```mermaid\ntimeline\n    title Platform Milestones\n    2024 : Foundation : Offline Architecture\n    2025 : AI Suite : Web Workers & WASM\n    2026 : Document Engine : Mermaid & Full Markdown\n```\n",
    pie: "```mermaid\npie title Tool Document Usage\n    \"Markdown\"  : 45\n    \"Diagrams\"  : 30\n    \"Calculators\": 15\n    \"Crypto\"    : 10\n```\n",
    c4: "```mermaid\nC4Context\n    title System Context Diagram\n    Person(user, \"Developer\", \"Writes documentation\")\n    System(karuvilab, \"KaruviLab Engine\", \"Offline document processing\")\n    Rel(user, karuvilab, \"Edits markdown in browser\")\n```\n",
    sankey: "```mermaid\nsankey-beta\n    Input, Markdown Worker, 100\n    Markdown Worker, AST, 60\n    Markdown Worker, HTML, 40\n```\n",
    xychart: "```mermaid\nxychart-beta\n    title \"Render Latency (ms)\"\n    x-axis [\"v1.0\", \"v1.5\", \"v2.0\", \"v2.1\"]\n    y-axis \"Latency (ms)\" 0 --> 300\n    bar [280, 190, 85, 24]\n```\n",
    kanban: "```mermaid\nkanban\n  Todo\n    [Review AST Spec]\n    [Design Token Audit]\n  In Progress\n    [Mermaid Subsystem]\n  Done\n    [Worker Orchestrator]\n    [L1 Cache Engine]\n```\n"
};
