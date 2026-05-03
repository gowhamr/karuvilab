let mdInitialized = false;
let mdDebounceTimer = null;
let mdFindMatches = [];
let mdFindIndex = 0;
let mdScrollSyncOn = true;
let mdLastUploadMd = "";
let mdTablePickerOpen = false;
let mdMermaidId = 0;
const MD_DIAGRAM_SNIPPETS = {
  flowchart: "```mermaid\nflowchart TD\n    A([Start]) --> B{Is it working?}\n    B -- Yes --> C[Ship it! \u{1F680}]\n    B -- No  --> D[Debug]\n    D --> E[Fix the bug]\n    E --> B\n    C --> F([Done])\n```",
  sequence: "```mermaid\nsequenceDiagram\n    participant U as User\n    participant S as Server\n    participant DB as Database\n    U->>S: POST /login\n    S->>DB: Verify credentials\n    DB-->>S: User record\n    S-->>U: JWT Token \u2713\n```",
  pie: '```mermaid\npie title Export Format Usage\n    "HTML"  : 42\n    "PDF"   : 35\n    "Word"  : 23\n```',
  gantt: "```mermaid\ngantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Planning\n    Requirements  :done, req, 2024-01-01, 2024-01-07\n    Design        :done, des, 2024-01-07, 2024-01-14\n    section Development\n    Backend API   :active, be, 2024-01-14, 2024-01-28\n    Frontend UI   :        fe, 2024-01-21, 2024-02-04\n```",
  class: "```mermaid\nclassDiagram\n    class Animal {\n        +String name\n        +makeSound() String\n    }\n    class Dog { +fetch() void }\n    class Cat { +purr() void }\n    Animal <|-- Dog\n    Animal <|-- Cat\n```",
  er: '```mermaid\nerDiagram\n    USER {\n        int id PK\n        string name\n        string email\n    }\n    ORDER {\n        int id PK\n        int userId FK\n        float total\n    }\n    USER ||--o{ ORDER : "places"\n```'
};
const MD_SAMPLE = `# Markdown Editor \u2014 Complete Reference

> **Live preview** as you type. Syntax highlighting, diagrams, export to HTML/PDF/Word.

---

## Text Formatting

| Style | Markdown | Result |
|-------|----------|--------|
| Bold | \`**text**\` | **bold** |
| Italic | \`*text*\` | *italic* |
| Strikethrough | \`~~text~~\` | ~~strikethrough~~ |

---

## Code Blocks

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

---

## Lists

- Item one
- Item two
  - Nested item
- Item three

---

## Blockquotes

> "The best way to predict the future is to invent it."
> \u2014 Alan Kay

---

## Links & Images

[Visit OpenAI](https://openai.com)

![Alt text](https://via.placeholder.com/150)
`;
function mdLoadCDN() {
  return Promise.all([
    mdLoadScript("https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"),
    mdLoadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"),
    mdLoadLink("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"),
    mdLoadScript("https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js")
  ]);
}
function mdLoadScript(src) {
  return new Promise((resolve, reject) => {
    const globalMap = { marked: "marked", highlight: "hljs", mermaid: "mermaid" };
    const key = src.match(/\/(\w+)[.@]/)?.[1];
    if (key && window[globalMap[key] ?? key]) return resolve();
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = (err) => {
      window.Shell.toast(`Failed to load dependency: ${src}. Please check your connection.`, "error");
      reject(err);
    };
    document.head.appendChild(s);
  });
}
function mdLoadLink(href) {
  return new Promise((resolve) => {
    if (document.querySelector(`link[href="${href}"]`)) return resolve();
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = () => resolve();
    document.head.appendChild(l);
  });
}
const MD_MERMAID_LANGS = /* @__PURE__ */ new Set([
  "mermaid",
  "flowchart",
  "flowcharttd",
  "flowchartlr",
  "sequencediagram",
  "sequence",
  "classdiagram",
  "class",
  "erdiagram",
  "er",
  "gantt",
  "pie",
  "gitgraph",
  "git",
  "mindmap",
  "timeline",
  "xychart",
  "sankey"
]);
function mdInit() {
  if (mdInitialized) return;
  mdInitialized = true;
  document.getElementById("md-tab-editor")?.addEventListener("click", () => mdSwitchTab("editor"));
  document.getElementById("md-tab-upload")?.addEventListener("click", () => mdSwitchTab("upload"));
  document.getElementById("md-find-toggle")?.addEventListener("click", mdToggleFindBar);
  document.getElementById("md-sync-toggle")?.addEventListener("click", mdToggleScrollSync);
  mdLoadCDN().then(() => {
    const markedLib = window.marked;
    if (!markedLib) return;
    const renderer = new markedLib.Renderer();
    renderer.code = function(code, lang) {
      const safeCode = String(code || "");
      const rawLang = String(lang || "").trim();
      const safeLang = rawLang.toLowerCase().replace(/\s+/g, "");
      const hljsLib = window.hljs;
      if (MD_MERMAID_LANGS.has(safeLang) || safeLang.startsWith("mermaid")) {
        return `<div class="mermaid" data-src="${encodeURIComponent(safeCode)}"></div>`;
      }
      if (hljsLib && hljsLib.getLanguage(safeLang)) {
        try {
          return `<pre data-lang="${safeLang}"><code class="hljs language-${safeLang}">${hljsLib.highlight(safeCode, { language: safeLang }).value}</code></pre>`;
        } catch {
        }
      }
      const auto = hljsLib ? hljsLib.highlightAuto(safeCode).value : safeCode;
      return `<pre data-lang="${safeLang}"><code class="hljs">${auto}</code></pre>`;
    };
    markedLib.setOptions({ renderer, gfm: true, breaks: true });
    const mermaidLib = window.mermaid;
    if (mermaidLib) {
      mermaidLib.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
    }
    mdSetupScrollSync();
    const ed = document.getElementById("md-editor");
    if (ed && ed.value) mdUpdatePreview();
  });
}
function mdUpdatePreview() {
  const ed = document.getElementById("md-editor");
  if (!ed) return;
  const md = ed.value;
  const preview = document.getElementById("md-preview-body");
  if (!preview) return;
  if (!md.trim()) {
    preview.innerHTML = "";
    const empty = document.getElementById("md-empty-state");
    if (empty) preview.appendChild(empty.cloneNode(true));
    mdUpdateStats("");
    return;
  }
  const markedLib = window.marked;
  if (!markedLib) {
    mdUpdateStats(md);
    return;
  }
  try {
    preview.innerHTML = markedLib.parse(md);
    mdInjectCopyButtons(preview);
    mdRenderMermaid(preview);
    mdUpdateStats(md);
  } catch (e) {
    preview.innerHTML = `<p style="color:#dc2626">Parse error: ${e.message}</p>`;
  }
}
function mdUpdateStats(md) {
  const lines = md ? md.split("\n").length : 0;
  const words = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = md.length;
  const readMin = Math.max(1, Math.ceil(words / 200));
  const lEl = document.getElementById("md-stat-lines");
  if (lEl) lEl.textContent = String(lines);
  const wEl = document.getElementById("md-stat-words");
  if (wEl) wEl.textContent = String(words);
  const cEl = document.getElementById("md-stat-chars");
  if (cEl) cEl.textContent = String(chars);
  const rEl = document.getElementById("md-stat-read");
  if (rEl) rEl.textContent = `${readMin} min`;
}
function mdInjectCopyButtons(container) {
  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".md-copy-code")) return;
    const btn = document.createElement("button");
    btn.className = "md-copy-code";
    btn.innerHTML = "\u{1F4CB}";
    btn.title = "Copy code";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const code = pre.querySelector("code");
      if (!code) return;
      navigator.clipboard.writeText(code.innerText).then(() => {
        btn.innerHTML = "\u2713";
        setTimeout(() => {
          btn.innerHTML = "\u{1F4CB}";
        }, 2e3);
      });
    });
    pre.appendChild(btn);
  });
}
async function mdRenderMermaid(container) {
  const mermaidLib = window.mermaid;
  if (!mermaidLib) return;
  const phs = container.querySelectorAll(".mermaid");
  for (const el of Array.from(phs)) {
    try {
      const src = decodeURIComponent(el.getAttribute("data-src") ?? "");
      if (!src.trim()) continue;
      const result = await mermaidLib.render(`mmd-${++mdMermaidId}`, src);
      el.innerHTML = result.svg;
    } catch (e) {
      el.innerHTML = `<div style="color:#dc2626;padding:12px">\u26A0 Diagram error: ${e.message}</div>`;
    }
  }
}
function mdInsertSyntax(prefix, suffix) {
  const ta = document.getElementById("md-editor");
  if (!ta) return;
  const s = ta.selectionStart, e2 = ta.selectionEnd;
  const sel = ta.value.substring(s, e2);
  const ins = prefix + sel + suffix;
  ta.value = ta.value.substring(0, s) + ins + ta.value.substring(e2);
  ta.selectionStart = ta.selectionEnd = s + prefix.length + sel.length;
  ta.focus();
  mdUpdatePreview();
}
function mdInsertDiagram(type) {
  const snippet = MD_DIAGRAM_SNIPPETS[type];
  if (!snippet) return;
  const ta = document.getElementById("md-editor");
  if (!ta) return;
  const pos = ta.selectionEnd;
  const before = ta.value.substring(0, pos), after = ta.value.substring(pos);
  const prefix = before.length > 0 && !before.endsWith("\n") ? "\n\n" : "\n";
  ta.value = before + prefix + snippet + "\n" + after;
  ta.selectionStart = ta.selectionEnd = pos + prefix.length + snippet.length + 1;
  ta.focus();
  mdUpdatePreview();
  mdShowSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} diagram inserted!`, "info");
}
function mdLoadSample() {
  const ed = document.getElementById("md-editor");
  if (ed) ed.value = MD_SAMPLE;
  mdUpdatePreview();
  mdShowSnackbar("Sample loaded!", "info");
}
function mdClearEditor() {
  const ed = document.getElementById("md-editor");
  if (!ed) return;
  if (ed.value && !confirm("Clear all content?")) return;
  ed.value = "";
  mdUpdatePreview();
}
function mdToggleFindBar() {
  const bar = document.getElementById("md-find-bar");
  if (!bar) return;
  const hidden = bar.classList.toggle("hidden");
  if (!hidden) {
    document.getElementById("md-find-input")?.focus();
  } else {
    mdFindMatches = [];
    const cnt = document.getElementById("md-find-count");
    if (cnt) cnt.textContent = "";
  }
}
function mdRunFind() {
  const query = document.getElementById("md-find-input")?.value ?? "";
  const ta = document.getElementById("md-editor");
  if (!ta) return;
  mdFindMatches = [];
  mdFindIndex = 0;
  const cntEl = document.getElementById("md-find-count");
  if (!query) {
    if (cntEl) cntEl.textContent = "";
    return;
  }
  const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  let m;
  while ((m = re.exec(ta.value)) !== null) mdFindMatches.push(m.index);
  const cnt = mdFindMatches.length;
  if (cntEl) cntEl.textContent = cnt ? `${mdFindIndex + 1}/${cnt}` : "0 found";
  if (cnt) {
    ta.setSelectionRange(mdFindMatches[0], mdFindMatches[0] + query.length);
    ta.focus();
  }
}
function mdFindKeyNav(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!mdFindMatches.length) return;
    mdFindIndex = (e.shiftKey ? mdFindIndex - 1 + mdFindMatches.length : mdFindIndex + 1) % mdFindMatches.length;
    const q = document.getElementById("md-find-input")?.value ?? "";
    const ta = document.getElementById("md-editor");
    if (!ta) return;
    ta.setSelectionRange(mdFindMatches[mdFindIndex], mdFindMatches[mdFindIndex] + q.length);
    ta.focus();
    const cntEl = document.getElementById("md-find-count");
    if (cntEl) cntEl.textContent = `${mdFindIndex + 1}/${mdFindMatches.length}`;
  }
  if (e.key === "Escape") mdToggleFindBar();
}
function mdDoReplace(all) {
  const q = document.getElementById("md-find-input")?.value ?? "";
  const r = document.getElementById("md-replace-input")?.value ?? "";
  const ta = document.getElementById("md-editor");
  if (!ta) return;
  if (!q) {
    window.Shell.toast("Enter text to find.", "warn");
    return;
  }
  if (all) {
    const count = ta.value.split(q).length - 1;
    if (count === 0) {
      window.Shell.toast("No matches found to replace.", "info");
      return;
    }
    ta.value = ta.value.split(q).join(r);
    mdShowSnackbar(`Replaced ${count} occurrence(s).`, "info");
  } else {
    if (!mdFindMatches.length) {
      window.Shell.toast("No match found to replace.", "info");
      return;
    }
    const idx = mdFindMatches[mdFindIndex];
    ta.value = ta.value.substring(0, idx) + r + ta.value.substring(idx + q.length);
    mdShowSnackbar("Replaced 1 occurrence.", "info");
  }
  mdUpdatePreview();
  mdRunFind();
}
function mdSwitchTab(tab) {
  document.querySelectorAll(".md-mode-panel").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".md-tab").forEach((b) => b.classList.remove("active"));
  document.getElementById(`md-panel-${tab}`)?.classList.add("active");
  document.getElementById(`md-tab-${tab}`)?.classList.add("active");
  const toggle = document.getElementById("md-mobile-view-toggle");
  if (toggle) toggle.style.display = tab === "editor" ? "" : "none";
}
function mdSetMobileView(v) {
  document.getElementById("md-editor-pane")?.classList.toggle("mobile-hidden", v !== "editor");
  document.getElementById("md-preview-pane")?.classList.toggle("mobile-hidden", v !== "preview");
  document.getElementById("md-mvt-edit")?.classList.toggle("active", v === "editor");
  document.getElementById("md-mvt-preview")?.classList.toggle("active", v === "preview");
}
function mdToggleScrollSync() {
  mdScrollSyncOn = !mdScrollSyncOn;
  document.getElementById("md-sync-dot")?.classList.toggle("active", mdScrollSyncOn);
  mdShowSnackbar(mdScrollSyncOn ? "Scroll sync ON" : "Scroll sync OFF", "info");
}
function mdSetupScrollSync() {
  const editor = document.getElementById("md-editor");
  const preview = document.getElementById("md-preview-body");
  if (!editor || !preview) return;
  let syncing = false;
  editor.addEventListener("scroll", () => {
    if (!mdScrollSyncOn || syncing) return;
    syncing = true;
    const pct = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
    preview.scrollTop = pct * (preview.scrollHeight - preview.clientHeight);
    setTimeout(() => {
      syncing = false;
    }, 50);
  });
}
const PICKER_ROWS = 8, PICKER_COLS = 8;
function mdToggleTablePicker(e) {
  e.stopPropagation();
  mdTablePickerOpen = !mdTablePickerOpen;
  const popup = document.getElementById("md-table-popup");
  const btn = document.getElementById("md-table-btn");
  if (!popup || !btn) return;
  if (mdTablePickerOpen) {
    mdInitTablePickerGrid();
    document.querySelectorAll(".md-table-cell").forEach((c) => c.classList.remove("hovered"));
    const sizeEl = document.getElementById("md-table-size");
    if (sizeEl) sizeEl.textContent = "Hover to select";
    const rect = btn.getBoundingClientRect();
    popup.style.top = rect.bottom + 6 + "px";
    popup.style.left = rect.left - 70 + "px";
    requestAnimationFrame(() => popup.classList.remove("hidden"));
  } else {
    popup.classList.add("hidden");
  }
}
function mdInitTablePickerGrid() {
  const grid = document.getElementById("md-table-grid");
  if (!grid || grid.children.length > 0) return;
  for (let r = 1; r <= PICKER_ROWS; r++) {
    for (let c = 1; c <= PICKER_COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "md-table-cell";
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      cell.addEventListener("mouseenter", () => mdHighlightCells(r, c));
      cell.addEventListener("click", () => {
        mdInsertTableGrid(r, c);
        mdToggleTablePicker({ stopPropagation: () => {
        } });
      });
      grid.appendChild(cell);
    }
  }
}
function mdHighlightCells(row, col) {
  document.querySelectorAll(".md-table-cell").forEach((cell) => {
    const el = cell;
    const r = parseInt(el.dataset.row ?? "0", 10);
    const c = parseInt(el.dataset.col ?? "0", 10);
    el.classList.toggle("hovered", r <= row && c <= col);
  });
  const sizeEl = document.getElementById("md-table-size");
  if (sizeEl) sizeEl.textContent = `${col} \xD7 ${row} table`;
}
function mdInsertTableGrid(rows, cols) {
  const ta = document.getElementById("md-editor");
  if (!ta) return;
  const pos = ta.selectionEnd;
  const before = ta.value.substring(0, pos), after = ta.value.substring(pos);
  const prefix = before.length > 0 && !before.endsWith("\n") ? "\n\n" : "\n";
  const headers = Array.from({ length: cols }, (_, i) => ` Col ${i + 1} `).join("|");
  const sep = Array.from({ length: cols }, () => "-----").join("|");
  let snippet = `|${headers}|
|${sep}|
`;
  for (let r = 0; r < rows; r++) {
    const cells = Array.from({ length: cols }, (_, c) => `  ${String.fromCharCode(65 + r)}${c + 1}  `).join("|");
    snippet += `|${cells}|
`;
  }
  ta.value = before + prefix + snippet + after;
  ta.selectionStart = ta.selectionEnd = pos + prefix.length + snippet.length;
  ta.focus();
  mdUpdatePreview();
  mdShowSnackbar(`${cols}\xD7${rows} table inserted!`, "info");
}
function mdHandleDragOver(e) {
  e.preventDefault();
  document.getElementById("md-drop-zone")?.classList.add("drag-over");
}
function mdHandleDragLeave(_e) {
  document.getElementById("md-drop-zone")?.classList.remove("drag-over");
}
function mdHandleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("md-drop-zone")?.classList.remove("drag-over");
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) mdProcessFile(files[0]);
}
function mdHandleFileInput(e) {
  const files = e.target.files;
  if (files && files.length > 0) mdProcessFile(files[0]);
}
function mdProcessFile(file) {
  const check = Utils.validateFile(file, ["md", "markdown"], 5);
  if (!check.valid) {
    window.Shell.toast(check.error ?? "Invalid file.", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    mdLastUploadMd = e.target?.result ?? "";
    mdRenderUploadPreview(mdLastUploadMd);
    const nameEl = document.getElementById("md-file-name");
    if (nameEl) nameEl.textContent = file.name;
    document.getElementById("md-file-info")?.classList.remove("hidden");
    window.Shell.toast(`"${file.name}" loaded.`, "success");
  };
  reader.onerror = () => window.Shell.toast("Failed to read file.", "error");
  reader.readAsText(file);
}
function mdRenderUploadPreview(markdown) {
  const preview = document.getElementById("md-upload-preview-body");
  if (!preview) return;
  const markedLib = window.marked;
  if (!markedLib) {
    preview.innerHTML = "<p>Loading parser\u2026</p>";
    mdLoadCDN().then(() => mdRenderUploadPreview(markdown));
  } else {
    try {
      preview.innerHTML = markedLib.parse(markdown);
      mdInjectCopyButtons(preview);
      mdRenderMermaid(preview);
    } catch (e) {
      preview.innerHTML = `<p style="color:#dc2626">Parse error: ${e.message}</p>`;
    }
  }
  document.getElementById("md-upload-preview-card")?.classList.remove("hidden");
  const wc = markdown.trim().split(/\s+/).filter(Boolean).length;
  const wcEl = document.getElementById("md-upload-wc");
  if (wcEl) wcEl.textContent = `${wc} words`;
}
function mdClearUpload() {
  const body = document.getElementById("md-upload-preview-body");
  if (body) body.innerHTML = "";
  document.getElementById("md-upload-preview-card")?.classList.add("hidden");
  document.getElementById("md-file-info")?.classList.add("hidden");
  document.getElementById("md-file-input")?.setAttribute("value", "");
  mdLastUploadMd = "";
  mdShowSnackbar("Cleared.", "info");
}
function mdCopyMarkdown(source) {
  const md = source === "upload" ? mdLastUploadMd : document.getElementById("md-editor")?.value ?? "";
  if (!md) {
    mdShowSnackbar("Nothing to copy.", "info");
    return;
  }
  navigator.clipboard.writeText(md).then(() => {
    const btnId = source === "upload" ? "md-upload-copy-btn" : "md-copy-md-btn";
    const btn = document.getElementById(btnId);
    btn?.classList.add("copied");
    mdShowSnackbar("Markdown copied!", "info");
    setTimeout(() => btn?.classList.remove("copied"), 2e3);
  }).catch(() => mdShowSnackbar("Copy failed.", "error"));
}
function mdExportHTML(source) {
  const md = source === "upload" ? mdLastUploadMd : document.getElementById("md-editor")?.value ?? "";
  if (!md) {
    mdShowSnackbar("Nothing to export.", "error");
    return;
  }
  const markedLib = window.marked;
  if (!markedLib) return;
  const html = markedLib.parse(md);
  const doc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; }
    h1, h2, h3 { margin-top: 24px; }
    pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>${html}</body>
</html>`;
  const blob = new Blob([doc], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `export-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
  mdShowSnackbar("HTML exported!", "info");
}
function mdExportPDF(source) {
  const md = source === "upload" ? mdLastUploadMd : document.getElementById("md-editor")?.value ?? "";
  if (!md) {
    mdShowSnackbar("Nothing to export.", "error");
    return;
  }
  const markedLib = window.marked;
  if (!markedLib) return;
  const html = markedLib.parse(md);
  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) return;
  printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body { font-family: system-ui; margin: 20px; line-height: 1.6; }
    h1, h2, h3 { margin-top: 24px; page-break-after: avoid; }
    pre { background: #f5f5f5; padding: 12px; border-radius: 6px; page-break-inside: avoid; }
  </style></head><body>${html}</body></html>`);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
  mdShowSnackbar("Print dialog opened \u2014 save as PDF.", "info");
}
function mdExportWord(source) {
  const md = source === "upload" ? mdLastUploadMd : document.getElementById("md-editor")?.value ?? "";
  if (!md) {
    mdShowSnackbar("Nothing to export.", "error");
    return;
  }
  const markedLib = window.marked;
  if (!markedLib) return;
  const html = markedLib.parse(md);
  const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><meta charset='UTF-8'></head>
<body>${html.replace(/<[^>]+>/g, (m) => m.replace(/style="[^"]*"/g, ""))}</body>
</html>`;
  const blob = new Blob([doc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `export-${Date.now()}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  mdShowSnackbar("Word document exported!", "info");
}
function mdShowSnackbar(msg, type = "info") {
  window.Shell.toast(msg, type === "error" ? "error" : "success");
}
window.mdInit = mdInit;
window.mdExportHtml = mdExportHTML;
window.mdExportPDF = mdExportPDF;
window.mdExportWord = mdExportWord;
