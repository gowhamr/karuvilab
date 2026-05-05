/* ===== robots-txt.ts – Generate custom robots.txt files ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const container = el('rules-container') as HTMLDivElement;
  const result = el('robots-result') as HTMLDivElement;
  const copyBtn = el('copy-btn') as HTMLButtonElement;
  const downloadBtn = el('download-btn') as HTMLButtonElement;
  const addBtn = el('add-rule') as HTMLButtonElement;

  const defaultAccess = el('default-access') as HTMLSelectElement;
  const sitemapUrl = el('sitemap-url') as HTMLInputElement;
  const crawlDelay = el('crawl-delay') as HTMLInputElement;

  function generate() {
    let text = 'User-agent: *\n';
    
    if (defaultAccess.value === 'disallow') {
      text += 'Disallow: /\n';
    } else {
      const paths = Array.from(document.querySelectorAll('.rule-path')) as HTMLInputElement[];
      paths.forEach(p => {
        const val = p.value.trim();
        if (val) text += `Disallow: ${val}\n`;
      });
    }

    if (crawlDelay.value) {
      text += `Crawl-delay: ${crawlDelay.value}\n`;
    }

    if (sitemapUrl.value.trim()) {
      text += `\nSitemap: ${sitemapUrl.value.trim()}\n`;
    }

    result.textContent = text.trim();
  }

  function addRule() {
    const row = document.createElement('div');
    row.className = 'rule-row';
    row.innerHTML = `
      <input type="text" class="workspace-input rule-path" placeholder="e.g. /admin/" style="margin-bottom:0">
      <button class="btn btn-sm btn-outline remove-rule">Remove</button>
    `;
    container.appendChild(row);
    
    row.querySelector('.remove-rule')?.addEventListener('click', () => {
      row.remove();
      generate();
    });
    
    row.querySelector('.rule-path')?.addEventListener('input', generate);
  }

  addBtn.addEventListener('click', addRule);
  
  [defaultAccess, sitemapUrl, crawlDelay].forEach(node => {
    node.addEventListener('input', generate);
  });

  // Initial rule listener
  document.querySelector('.rule-path')?.addEventListener('input', generate);
  document.querySelector('.remove-rule')?.addEventListener('click', (e) => {
    (e.target as HTMLElement).closest('.rule-row')?.remove();
    generate();
  });

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(result.textContent || '').then(() => {
      (window as any).Shell.toast('Copied to clipboard!', 'success');
    });
  };

  downloadBtn.onclick = () => {
    const blob = new Blob([result.textContent || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  generate();
});
