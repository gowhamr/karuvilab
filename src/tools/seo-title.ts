/* ===== seo-title.ts – Analyze and preview SEO titles and descriptions ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);

  const inTitle = el('title-input') as HTMLInputElement;
  const inDesc = el('desc-input') as HTMLTextAreaElement;

  const outTitleLen = el('title-len') as HTMLElement;
  const outDescLen = el('desc-len') as HTMLElement;
  const progressTitle = el('title-progress') as HTMLElement;
  const progressDesc = el('desc-progress') as HTMLElement;
  const feedbackTitle = el('title-feedback') as HTMLElement;

  const prevTitle = el('prev-title') as HTMLElement;
  const prevDesc = el('prev-desc') as HTMLElement;

  function update() {
    const title = inTitle.value;
    const desc = inDesc.value;

    const tLen = title.length;
    const dLen = desc.length;

    // Title logic
    outTitleLen.textContent = `${tLen} / 60`;
    const tPerc = Math.min(100, (tLen / 60) * 100);
    progressTitle.style.width = tPerc + '%';
    
    if (tLen === 0) {
      progressTitle.style.background = 'var(--error)';
      feedbackTitle.textContent = 'Start typing your title...';
      feedbackTitle.style.color = 'var(--text-3)';
    } else if (tLen < 30) {
      progressTitle.style.background = 'var(--warn)';
      feedbackTitle.textContent = 'Too short. Aim for at least 40 characters.';
      feedbackTitle.style.color = 'var(--warn)';
    } else if (tLen <= 60) {
      progressTitle.style.background = 'var(--success)';
      feedbackTitle.textContent = 'Perfect length! Clear and effective.';
      feedbackTitle.style.color = 'var(--success)';
    } else {
      progressTitle.style.background = 'var(--error)';
      feedbackTitle.textContent = 'Too long. Google will likely truncate this.';
      feedbackTitle.style.color = 'var(--error)';
    }

    // Desc logic
    outDescLen.textContent = `${dLen} / 160`;
    const dPerc = Math.min(100, (dLen / 160) * 100);
    progressDesc.style.width = dPerc + '%';
    if (dLen > 160) {
      progressDesc.style.background = 'var(--error)';
    } else if (dLen > 120) {
      progressDesc.style.background = 'var(--success)';
    } else {
      progressDesc.style.background = 'var(--warn)';
    }

    // Preview
    prevTitle.textContent = title || 'Your Page Title Here';
    prevDesc.textContent = desc || 'This is how your description will appear in search results. Google usually truncates after 155-160 characters.';
  }

  [inTitle, inDesc].forEach(node => {
    node.addEventListener('input', update);
  });

  update();
});
