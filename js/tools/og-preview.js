document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const inTitle = el("og-input-title");
  const inDesc = el("og-input-desc");
  const inImage = el("og-input-image");
  const inSite = el("og-input-site");
  const prevTitle = el("og-prev-title");
  const prevDesc = el("og-prev-desc");
  const prevImage = el("og-prev-img");
  const prevSite = el("og-prev-site");
  const metaOutput = el("og-meta-output");
  const copyBtn = el("copy-btn");
  function update() {
    const title = inTitle.value || "Your Page Title Here";
    const desc = inDesc.value || "Your page description will appear here when shared on platforms like Facebook or LinkedIn.";
    const img = inImage.value;
    const site = (inSite.value || "example.com").toUpperCase();
    prevTitle.textContent = title;
    prevDesc.textContent = desc;
    prevSite.textContent = site;
    if (img) {
      prevImage.style.backgroundImage = `url('${img}')`;
      prevImage.textContent = "";
    } else {
      prevImage.style.backgroundImage = "none";
      prevImage.textContent = "Image Preview";
    }
    let meta = `<!-- Open Graph / Facebook -->
`;
    meta += `<meta property="og:type" content="website">
`;
    meta += `<meta property="og:title" content="${title}">
`;
    meta += `<meta property="og:description" content="${desc}">
`;
    if (img) meta += `<meta property="og:image" content="${img}">
`;
    if (inSite.value) meta += `<meta property="og:site_name" content="${inSite.value}">

`;
    meta += `<!-- Twitter -->
`;
    meta += `<meta name="twitter:card" content="summary_large_image">
`;
    meta += `<meta name="twitter:title" content="${title}">
`;
    meta += `<meta name="twitter:description" content="${desc}">
`;
    if (img) meta += `<meta name="twitter:image" content="${img}">`;
    metaOutput.textContent = meta;
  }
  [inTitle, inDesc, inImage, inSite].forEach((node) => {
    node.addEventListener("input", update);
  });
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(metaOutput.textContent || "").then(() => {
      window.Shell.toast("Meta tags copied!", "success");
    });
  };
  update();
});
