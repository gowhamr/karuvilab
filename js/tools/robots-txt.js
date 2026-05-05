document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const container = el("rules-container");
  const result = el("robots-result");
  const copyBtn = el("copy-btn");
  const downloadBtn = el("download-btn");
  const addBtn = el("add-rule");
  const defaultAccess = el("default-access");
  const sitemapUrl = el("sitemap-url");
  const crawlDelay = el("crawl-delay");
  function generate() {
    let text = "User-agent: *\n";
    if (defaultAccess.value === "disallow") {
      text += "Disallow: /\n";
    } else {
      const paths = Array.from(document.querySelectorAll(".rule-path"));
      paths.forEach((p) => {
        const val = p.value.trim();
        if (val) text += `Disallow: ${val}
`;
      });
    }
    if (crawlDelay.value) {
      text += `Crawl-delay: ${crawlDelay.value}
`;
    }
    if (sitemapUrl.value.trim()) {
      text += `
Sitemap: ${sitemapUrl.value.trim()}
`;
    }
    result.textContent = text.trim();
  }
  function addRule() {
    const row = document.createElement("div");
    row.className = "rule-row";
    row.innerHTML = `
      <input type="text" class="workspace-input rule-path" placeholder="e.g. /admin/" style="margin-bottom:0">
      <button class="btn btn-sm btn-outline remove-rule">Remove</button>
    `;
    container.appendChild(row);
    row.querySelector(".remove-rule")?.addEventListener("click", () => {
      row.remove();
      generate();
    });
    row.querySelector(".rule-path")?.addEventListener("input", generate);
  }
  addBtn.addEventListener("click", addRule);
  [defaultAccess, sitemapUrl, crawlDelay].forEach((node) => {
    node.addEventListener("input", generate);
  });
  document.querySelector(".rule-path")?.addEventListener("input", generate);
  document.querySelector(".remove-rule")?.addEventListener("click", (e) => {
    e.target.closest(".rule-row")?.remove();
    generate();
  });
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(result.textContent || "").then(() => {
      window.Shell.toast("Copied to clipboard!", "success");
    });
  };
  downloadBtn.onclick = () => {
    const blob = new Blob([result.textContent || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  generate();
});
