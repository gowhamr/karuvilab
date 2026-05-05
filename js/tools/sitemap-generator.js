document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const input = el("url-list");
  const result = el("sitemap-result");
  const copyBtn = el("copy-btn");
  const downloadBtn = el("download-btn");
  const changeFreq = el("change-freq");
  const priority = el("priority");
  function generate() {
    const urls = input.value.trim().split(/\n+/).map((u) => u.trim()).filter((u) => u !== "");
    if (urls.length === 0) {
      result.textContent = "Type some URLs to generate your sitemap...";
      return;
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    urls.forEach((u) => {
      let loc = u;
      if (!loc.startsWith("http")) loc = "https://" + loc;
      xml += "  <url>\n";
      xml += `    <loc>${loc}</loc>
`;
      xml += `    <lastmod>${today}</lastmod>
`;
      xml += `    <changefreq>${changeFreq.value}</changefreq>
`;
      xml += `    <priority>${priority.value}</priority>
`;
      xml += "  </url>\n";
    });
    xml += "</urlset>";
    result.textContent = xml;
  }
  [input, changeFreq, priority].forEach((node) => {
    node.addEventListener("input", generate);
  });
  copyBtn.onclick = () => {
    if (input.value.trim() === "") return;
    navigator.clipboard.writeText(result.textContent || "").then(() => {
      window.Shell.toast("XML copied!", "success");
    });
  };
  downloadBtn.onclick = () => {
    if (input.value.trim() === "") return;
    const blob = new Blob([result.textContent || ""], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };
  generate();
});
