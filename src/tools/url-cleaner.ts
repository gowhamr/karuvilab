/* ===== url-cleaner.ts – Strip tracking parameters from URLs ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const input = el('url-input') as HTMLTextAreaElement;
  const result = el('url-result') as HTMLDivElement;
  const copyBtn = el('copy-btn') as HTMLButtonElement;
  const openBtn = el('open-btn') as HTMLButtonElement;

  const utmCheck = el('clean-utm') as HTMLInputElement;
  const socialCheck = el('clean-social') as HTMLInputElement;
  const allCheck = el('clean-all') as HTMLInputElement;

  const TRACKING_PARAMS = [
    // UTM
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
    // Social / Ads
    'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid', 'twclid', 'li_fat_id',
    // Other common ones
    'mc_cid', 'mc_eid', 'igshid', '_hsenc', '_hsmi', 'mkt_tok', 's_kwcid', 'source', 'ref', 'callback'
  ];

  function cleanURL() {
    const val = input.value.trim();
    if (!val) {
      result.textContent = 'your-clean-url-here';
      result.style.opacity = '0.5';
      return;
    }
    result.style.opacity = '1';

    try {
      const url = new URL(val);
      const searchParams = url.searchParams;

      if (allCheck.checked) {
        url.search = '';
      } else {
        if (utmCheck.checked) {
          TRACKING_PARAMS.filter(p => p.startsWith('utm_')).forEach(p => searchParams.delete(p));
        }
        if (socialCheck.checked) {
          ['fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid', 'twclid', 'li_fat_id', 'igshid'].forEach(p => searchParams.delete(p));
        }
        // Always clean some very common ones if either is checked
        if (utmCheck.checked || socialCheck.checked) {
          ['mc_cid', 'mc_eid', 'ref', 'source'].forEach(p => searchParams.delete(p));
        }
      }

      result.textContent = url.toString();
    } catch (e) {
      result.textContent = 'Invalid URL';
      result.style.color = 'var(--error)';
    }
  }

  [input, utmCheck, socialCheck, allCheck].forEach(node => {
    node.addEventListener('input', cleanURL);
  });

  copyBtn.onclick = () => {
    const text = result.textContent;
    if (!text || text === 'your-clean-url-here' || text === 'Invalid URL') return;
    navigator.clipboard.writeText(text).then(() => {
      (window as any).Shell.toast('URL copied!', 'success');
    });
  };

  openBtn.onclick = () => {
    const text = result.textContent;
    if (!text || text === 'your-clean-url-here' || text === 'Invalid URL') return;
    window.open(text, '_blank');
  };

  cleanURL();
});
