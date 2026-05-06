/* ===== home-discovery.ts — Search, Recent, Popular for the homepage ===== */

(function () {
  type Category = KaruviToolEntry['category'];
  type ToolEntry = KaruviToolEntry;

  const CATEGORY_BG: Record<Category, string> = {
    calculators: '#FEF9C3',
    pdf:         '#FEE2E2',
    image:       '#EEF2FF',
    security:    '#F0FDF4',
    developer:   '#F3E8FF',
    utilities:   '#EFF6FF',
    seo:         '#F0FDFA',
  };
  const CATEGORY_FG: Record<Category, string> = {
    calculators: '#CA8A04',
    pdf:         '#DC2626',
    image:       '#4F46E5',
    security:    '#10B981',
    developer:   '#7C3AED',
    utilities:   '#3B82F6',
    seo:         '#0D9488',
  };
  const CATEGORY_LABEL: Record<Category, string> = {
    calculators: 'Calculator',
    pdf:         'PDF',
    image:       'Image',
    security:    'Security',
    developer:   'Developer',
    utilities:   'Utility',
    seo:         'SEO',
  };

  document.addEventListener('DOMContentLoaded', () => {
    const reg = window.KaruviRegistry;
    if (!reg) return; // registry not loaded — bail silently

    const searchInput  = document.getElementById('tool-search') as HTMLInputElement | null;
    const filterChips  = document.getElementById('tool-filter-chips');
    const resultsGrid  = document.getElementById('tool-results-grid');
    const resultsEmpty = document.getElementById('tool-results-empty');
    const resultsCount = document.getElementById('tool-results-count');
    const recentSection= document.getElementById('recent-tools-section');
    const recentGrid   = document.getElementById('recent-tools-grid');
    const popularGrid  = document.getElementById('popular-tools-grid');
    const clearBtn     = document.getElementById('tool-search-clear');

    if (!searchInput || !resultsGrid) return;

    let activeCategory: Category | 'all' = 'all';
    let query = '';

    const base = window.KARUVI_BASE || './';

    function escapeHtml(s: string): string {
      return s.replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      } as Record<string, string>)[c] || c);
    }

    function renderCard(tool: ToolEntry): string {
      const bg = CATEGORY_BG[tool.category];
      const fg = CATEGORY_FG[tool.category];
      const cat = CATEGORY_LABEL[tool.category];
      return `
        <a href="${base}${tool.href}" class="cat-btn discovery-card" style="text-decoration:none" data-tool-id="${tool.id}">
          <span class="cat-icon" aria-hidden="true" style="--c:${bg};--f:${fg}">
            <span class="discovery-card-letter">${escapeHtml(tool.name.charAt(0))}</span>
          </span>
          <span class="cat-btn-text">
            <span class="cat-btn-name">${escapeHtml(tool.name)}</span>
            <span class="cat-btn-desc">${escapeHtml(tool.desc)}</span>
            <span class="discovery-card-tag" aria-label="Category: ${escapeHtml(cat)}">${escapeHtml(cat)}</span>
          </span>
        </a>
      `;
    }

    function score(tool: ToolEntry, q: string): number {
      if (!q) return 0;
      const name = tool.name.toLowerCase();
      if (name === q) return 100;
      if (name.startsWith(q)) return 80;
      if (name.includes(q)) return 60;
      if (tool.keywords.some(k => k.startsWith(q))) return 50;
      if (tool.keywords.some(k => k.includes(q))) return 40;
      if (tool.desc.toLowerCase().includes(q)) return 30;
      return 0;
    }

    function renderResults(): void {
      if (!resultsGrid || !resultsEmpty || !resultsCount) return;
      const q = query.trim().toLowerCase();
      let list = reg!.TOOLS.slice();

      if (activeCategory !== 'all') {
        list = list.filter(t => t.category === activeCategory);
      }
      if (q) {
        list = list
          .map(t => ({ t, s: score(t, q) }))
          .filter(({ s }) => s > 0)
          .sort((a, b) => b.s - a.s)
          .map(({ t }) => t);
      }

      const showing = q || activeCategory !== 'all';
      if (!showing) {
        // No active filter — hide the results panel entirely (categories below act as the index)
        resultsGrid.innerHTML = '';
        resultsGrid.hidden = true;
        resultsEmpty.hidden = true;
        resultsCount.textContent = '';
        return;
      }

      resultsCount.textContent = `${list.length} ${list.length === 1 ? 'tool' : 'tools'}`;
      if (list.length === 0) {
        resultsGrid.innerHTML = '';
        resultsGrid.hidden = true;
        resultsEmpty.hidden = false;
      } else {
        resultsGrid.innerHTML = list.map(renderCard).join('');
        resultsGrid.hidden = false;
        resultsEmpty.hidden = true;
      }
    }

    function renderRecent(): void {
      if (!recentGrid || !recentSection) return;
      const tools = reg!.getRecentTools();
      if (tools.length === 0) {
        recentSection.hidden = true;
        return;
      }
      recentSection.hidden = false;
      recentGrid.innerHTML = tools.slice(0, 6).map(renderCard).join('');
    }

    function renderPopular(): void {
      if (!popularGrid) return;
      const tools = reg!.TOOLS.filter(t => t.popular).slice(0, 8);
      popularGrid.innerHTML = tools.map(renderCard).join('');
    }

    function setupChips(): void {
      if (!filterChips) return;
      const chips = Array.from(filterChips.querySelectorAll<HTMLButtonElement>('.filter-chip'));
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const cat = chip.dataset.category as Category | 'all';
          activeCategory = cat;
          chips.forEach(c => {
            const isActive = c === chip;
            c.classList.toggle('active', isActive);
            c.setAttribute('aria-pressed', String(isActive));
          });
          renderResults();
        });
      });
    }

    function setupSearch(): void {
      if (!searchInput) return;
      searchInput.addEventListener('input', () => {
        query = searchInput.value;
        if (clearBtn) clearBtn.hidden = !query;
        renderResults();
      });
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape' && query) {
          e.preventDefault();
          searchInput.value = '';
          query = '';
          if (clearBtn) clearBtn.hidden = true;
          renderResults();
        }
      });
      clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        query = '';
        clearBtn.hidden = true;
        searchInput.focus();
        renderResults();
      });
    }

    setupChips();
    setupSearch();
    renderPopular();
    renderRecent();

    // Pre-fill search if arrived via ?q=… (from header search on other pages)
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q && searchInput) {
        searchInput.value = q;
        query = q;
        if (clearBtn) clearBtn.hidden = false;
        // Smooth-scroll the results into view
        searchInput.focus();
      }
    } catch { /* no URL params */ }

    renderResults();
  });
})();
