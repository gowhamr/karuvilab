/* ===== home.ts – KaruviLab Home Page Logic ===== */

document.addEventListener('DOMContentLoaded', () => {
  // Redirect legacy hash-based URLs to standalone pages
  const hash = window.location.hash;
  if (hash) {
    const panelId = hash.replace('#panel-', '').replace('#', '');
    const panelMap: Record<string, string> = {
      compressor:  'compress',
      converter:   'convert',
      creator:     'create',
      pdf:         'pdf-tools',
      validator:   'validate',
      calculators: 'calculators',
      base64:      'base64',
      regex:       'regex',
      formatter:   'format',
      markdown:    'markdown',
      qrcode:      'qrcode',
      'split-copy': 'split-copy',
    };
    if (panelMap[panelId]) {
      const dest = panelMap[panelId];
      const path = (dest.includes('-') || dest === 'calculators')
        ? `/${dest}/`
        : `/tools/${dest}/`;
      window.location.href = path;
    }
  }

  // FAQ / MORE OVERLAY
  const faqOverlay  = document.getElementById('faq-overlay');
  const faqCloseBtn = document.getElementById('faq-close-btn');

  function openFaq(): void {
    faqOverlay?.classList.remove('hidden');
  }
  function closeFaq(): void {
    faqOverlay?.classList.add('hidden');
  }

  document.querySelectorAll('[data-action="open-faq"]').forEach(btn => {
    btn.addEventListener('click', openFaq);
  });

  faqCloseBtn?.addEventListener('click', closeFaq);
  faqOverlay?.addEventListener('click', (e: Event) => {
    if (e.target === faqOverlay) closeFaq();
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeFaq();
  });
});
