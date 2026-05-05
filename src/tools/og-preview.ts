/* ===== og-preview.ts – Social media preview and OG tag generator ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);

  const inTitle = el('og-input-title') as HTMLInputElement;
  const inDesc = el('og-input-desc') as HTMLTextAreaElement;
  const inImage = el('og-input-image') as HTMLInputElement;
  const inSite = el('og-input-site') as HTMLInputElement;

  const prevTitle = el('og-prev-title') as HTMLElement;
  const prevDesc = el('og-prev-desc') as HTMLElement;
  const prevImage = el('og-prev-img') as HTMLDivElement;
  const prevSite = el('og-prev-site') as HTMLElement;
  const metaOutput = el('og-meta-output') as HTMLElement;
  const copyBtn = el('copy-btn') as HTMLButtonElement;

  function update() {
    const title = inTitle.value || 'Your Page Title Here';
    const desc = inDesc.value || 'Your page description will appear here when shared on platforms like Facebook or LinkedIn.';
    const img = inImage.value;
    const site = (inSite.value || 'example.com').toUpperCase();

    // Update Preview
    prevTitle.textContent = title;
    prevDesc.textContent = desc;
    prevSite.textContent = site;
    
    if (img) {
      prevImage.style.backgroundImage = `url('${img}')`;
      prevImage.textContent = '';
    } else {
      prevImage.style.backgroundImage = 'none';
      prevImage.textContent = 'Image Preview';
    }

    // Update Meta Tags
    let meta = `<!-- Open Graph / Facebook -->\n`;
    meta += `<meta property="og:type" content="website">\n`;
    meta += `<meta property="og:title" content="${title}">\n`;
    meta += `<meta property="og:description" content="${desc}">\n`;
    if (img) meta += `<meta property="og:image" content="${img}">\n`;
    if (inSite.value) meta += `<meta property="og:site_name" content="${inSite.value}">\n\n`;
    
    meta += `<!-- Twitter -->\n`;
    meta += `<meta name="twitter:card" content="summary_large_image">\n`;
    meta += `<meta name="twitter:title" content="${title}">\n`;
    meta += `<meta name="twitter:description" content="${desc}">\n`;
    if (img) meta += `<meta name="twitter:image" content="${img}">`;

    metaOutput.textContent = meta;
  }

  [inTitle, inDesc, inImage, inSite].forEach(node => {
    node.addEventListener('input', update);
  });

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(metaOutput.textContent || '').then(() => {
      (window as any).Shell.toast('Meta tags copied!', 'success');
    });
  };

  update();
});
