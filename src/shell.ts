/* ===== shell.ts – KaruviLab Shell Component ===== */

(function () {
  // ROUTER-001: Set SHELL_ACTIVE dynamically if not hardcoded by the page
  if (!window.SHELL_ACTIVE) {
    const path = window.location.pathname;
    if (path.includes('/calculators/'))     window.SHELL_ACTIVE = 'calculators';
    else if (path.includes('/pdf-tools/'))  window.SHELL_ACTIVE = 'pdf';
    else if (path.includes('/image-tools/')) window.SHELL_ACTIVE = 'image';
    else if (path.includes('/security-tools/')) window.SHELL_ACTIVE = 'security';
    else if (path.includes('/developer-tools/')) window.SHELL_ACTIVE = 'dev';
    else if (path.includes('/utilities/'))       window.SHELL_ACTIVE = 'utils';
    else if (path.includes('/tools/seo/'))       window.SHELL_ACTIVE = 'seo';
    else if (path.includes('/pages/settings.html')) window.SHELL_ACTIVE = 'settings';
    else if (path.includes('/pages/help.html'))     window.SHELL_ACTIVE = 'help';
    else if (path.includes('/tools/')) {
      const seoTools = ['meta-tags', 'image-seo', 'slug-generator'];
      const isSeo = seoTools.some(t => path.includes('/' + t + '/'));
      if (isSeo) {
        window.SHELL_ACTIVE = 'seo';
        return;
      }
      const tools = ['markdown', 'qrcode', 'base64', 'regex', 'format', 'validate', 'compress', 'convert', 'create'];
      const found = tools.find(t => path.includes('/' + t + '/'));
      window.SHELL_ACTIVE = found || 'tools';
    } else {
      window.SHELL_ACTIVE = 'home';
    }
  }

  // Determine the base path from the script source
  const script =
    (document.currentScript as HTMLScriptElement | null) ||
    (document.querySelector('script[src*="js/shell.js"]') as HTMLScriptElement | null);
  const base = script ? script.src.replace(/js\/shell\.js.*$/, '') : '/';
  window.KARUVI_BASE = base;

  const shell: ShellInterface = {
    init() {
      this.render();
      this.setupTheme();
      this.setupEffects();
      this.setupErrorHandling();
      this.setupSidebar();
      this.recordVisit();
    },

    recordVisit() {
      // Record this tool visit so the homepage can surface "Recent Tools".
      // Stores raw pathnames (no registry needed on tool pages); the homepage
      // resolves them via window.KaruviRegistry.findToolByPath.
      try {
        if ((window.SHELL_ACTIVE || 'home') === 'home') return;
        const RECENT_KEY = 'karuvi.recent.paths';
        const RECENT_LIMIT = 8;
        const path = window.location.pathname.replace(/index\.html$/, '');
        if (!path || path === '/') return;
        const raw = localStorage.getItem(RECENT_KEY);
        const list: string[] = raw ? JSON.parse(raw) : [];
        const next = [path, ...list.filter(p => p !== path)].slice(0, RECENT_LIMIT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* localStorage unavailable */
      }
    },

    goHome() {
      try {
        window.location.href = window.KARUVI_BASE || '/';
      } catch {
        window.location.href = '/';
      }
    },

    render() {
      if (document.getElementById('shell-rendered')) return;

      const active = window.SHELL_ACTIVE || 'home';
      document.body.classList.add('app-shell');
      const base = window.KARUVI_BASE || '/';

      // SVG Sprite
      if (!document.getElementById('ic-sprite')) {
        const sprite = document.createElement('div');
        sprite.id = 'ic-sprite';
        sprite.style.display = 'none';
        sprite.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <symbol id="ic-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></symbol>
              <symbol id="ic-apps" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </defs>
          </svg>
        `;
        document.body.appendChild(sprite);
      }

      const header = document.createElement('header');
      header.className = 'top-stripe';
      header.setAttribute('role', 'banner');
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      header.innerHTML = `
        <div class="ts-left">
          <button type="button" class="ts-hamburger" id="ts-hamburger" aria-label="Open navigation menu" aria-controls="app-sidebar" aria-expanded="false">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <a href="${base}" class="ts-logo-link" aria-label="KaruviLab home" style="text-decoration:none">
            <div class="ts-logo" aria-hidden="true">
              <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M5 3h3v18H5z"/>
                <path d="M8 12 17 3h3l-9 9 9 9h-3z"/>
              </svg>
            </div>
          </a>
          <div class="ts-brand-text">
            <span class="ts-name">KaruviLab</span>
            <span class="ts-tagline">Fast &middot; Private &middot; No uploads</span>
          </div>
        </div>

        <form class="ts-search" role="search" action="${base}" method="get" aria-label="Search KaruviLab tools">
          <label for="ts-search-input" class="sr-only">Search tools</label>
          <span class="ts-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input id="ts-search-input" type="search" name="q" placeholder="Search tools…" autocomplete="off" spellcheck="false" />
        </form>

        <div class="ts-actions">
          <button type="button" class="ts-icon-btn ts-search-trigger" id="ts-search-trigger" aria-label="Open search" aria-expanded="false">
            <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme" aria-pressed="${currentTheme === 'dark'}">
            <svg class="theme-icon-moon" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="theme-icon-sun" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <span class="ts-badge" role="status" aria-label="Privacy: all processing happens locally">
            <svg aria-hidden="true" focusable="false" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            <span class="ts-badge-label">PRIVATE</span>
          </span>
        </div>
      `;

      const dock = document.createElement('nav');
      dock.className = 'dock';
      dock.setAttribute('aria-label', 'Primary');
      dock.innerHTML = `
        <a href="${base}" class="dock-btn ${active === 'home' ? 'active' : ''}"${active === 'home' ? ' aria-current="page"' : ''}>
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          <span class="dock-lbl">Home</span>
        </a>
        <a href="${base}tools/" class="dock-btn ${active === 'tools' ? 'active' : ''}"${active === 'tools' ? ' aria-current="page"' : ''}>
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span class="dock-lbl">All Tools</span>
        </a>
        <a href="${base}pages/help.html" class="dock-btn ${active === 'help' ? 'active' : ''}"${active === 'help' ? ' aria-current="page"' : ''}>
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span class="dock-lbl">Help</span>
        </a>
        <a href="${base}pages/settings.html" class="dock-btn ${active === 'settings' ? 'active' : ''}"${active === 'settings' ? ' aria-current="page"' : ''}>
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span class="dock-lbl">Settings</span>
        </a>
      `;

      document.body.prepend(header);

      // Build sidebar (after header so it sits below in source order)
      const sidebar = this.buildSidebar(base, active);
      document.body.appendChild(sidebar);

      // Backdrop for mobile/tablet drawer
      const backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      backdrop.id = 'sidebar-backdrop';
      backdrop.hidden = true;
      document.body.appendChild(backdrop);

      if (!document.querySelector('.viewport')) {
        const viewport = document.createElement('div');
        viewport.className = 'viewport';
        viewport.id = 'app-viewport';
        const sprite = document.getElementById('ic-sprite');
        Array.from(document.body.children)
          .filter(c => c !== header && c !== sidebar && c !== backdrop && c !== sprite)
          .forEach(c => viewport.appendChild(c));
        document.body.appendChild(viewport);
      }

      document.body.appendChild(dock);

      const marker = document.createElement('div');
      marker.id = 'shell-rendered';
      marker.style.display = 'none';
      document.body.appendChild(marker);
    },

    buildSidebar(base: string, active: string): HTMLElement {
      type SidebarItem = { name: string; href: string };
      type SidebarGroup = { id: string; title: string; icon: string; items: SidebarItem[] };

      const ICON = {
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 12 12 15 22"/></svg>',
        pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="9" y1="18" x2="9" y2="18"/><line x1="13" y1="18" x2="13" y2="18"/><line x1="12" y1="6" x2="12" y2="6"/></svg>',
        image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        utils: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        seo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
        chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
      };

      const TOOLS: SidebarGroup[] = [
        { id: 'pdf', title: 'PDF Tools', icon: ICON.pdf, items: [
          { name: 'Compress PDF', href: 'pdf-tools/compress-pdf/' },
          { name: 'Merge PDF',    href: 'pdf-tools/merge-pdf/' },
          { name: 'Split PDF',    href: 'pdf-tools/split-pdf/' },
          { name: 'PDF to Word',  href: 'pdf-tools/pdf-to-word/' },
          { name: 'See all tools', href: 'pdf-tools/' },
        ]},
        { id: 'calc', title: 'Calculators', icon: ICON.calc, items: [
          { name: 'EMI Calculator',         href: 'calculators/emi-calculator/' },
          { name: 'Percentage Calculator',  href: 'calculators/percentage-calculator/' },
          { name: 'Age Calculator',         href: 'calculators/age-calculator/' },
          { name: 'See all calculators',    href: 'calculators/' },
        ]},
        { id: 'image', title: 'Image Tools', icon: ICON.image, items: [
          { name: 'Compress Image',     href: 'tools/compress/' },
          { name: 'Background Remover', href: 'image-tools/bg-remover/' },
          { name: 'Image Converter',    href: 'tools/image-converter/' },
          { name: 'See all tools',      href: 'image-tools/' },
        ]},
        { id: 'dev', title: 'Developer Tools', icon: ICON.utils, items: [
          { name: 'JSON Formatter', href: 'tools/json-formatter/' },
          { name: 'Base64 Tool',    href: 'tools/base64/' },
          { name: 'Regex Tester',   href: 'tools/regex/' },
          { name: 'See all dev tools', href: 'developer-tools/' },
        ]},
        { id: 'security', title: 'Security', icon: ICON.security, items: [
          { name: 'Hash Generator',     href: 'tools/hash-generator/' },
          { name: 'Password Gen',       href: 'tools/password-generator/' },
          { name: 'JWT Decoder',        href: 'tools/jwt-decoder/' },
          { name: 'See all security',   href: 'security-tools/' },
        ]},
        { id: 'seo', title: 'SEO Tools', icon: ICON.seo, items: [
          { name: 'Meta Tags',       href: 'tools/meta-tags/' },
          { name: 'Sitemap Gen',     href: 'tools/sitemap-generator/' },
          { name: 'See all SEO',     href: 'tools/seo/' },
        ]},
      ];

      const norm = (p: string) => p.replace(/^\/+/, '').replace(/index\.html$/, '').replace(/\/+$/, '');
      const currentNorm = norm(window.location.pathname);
      const isActive = (href: string) => {
        const h = norm(href);
        return currentNorm === h || currentNorm.endsWith('/' + h);
      };

      const aside = document.createElement('aside');
      aside.className = 'app-sidebar';
      aside.id = 'app-sidebar';
      aside.setAttribute('role', 'navigation');
      aside.setAttribute('aria-label', 'Main navigation');

      aside.innerHTML = `
        <div class="sidebar-head">
          <a href="${base}" class="sidebar-brand">
            <div class="sidebar-brand-mark">${ICON.home}</div>
            <span class="sidebar-brand-text">KaruviLab</span>
          </a>
          <button type="button" class="sidebar-close" id="sidebar-close" aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <nav class="sidebar-scroll">
          <div class="sidebar-group">
            <p class="sidebar-group-label">Main</p>
            <div class="sidebar-item">
              <a href="${base}" class="sidebar-link ${active === 'home' ? 'active' : ''}">
                <span class="sidebar-icon">${ICON.home}</span>
                <span class="sidebar-link-text">Home</span>
              </a>
            </div>
          </div>

          <div class="sidebar-group">
            <p class="sidebar-group-label">Tools</p>
            ${TOOLS.map(g => {
              const isGroupActive = g.items.some(it => isActive(it.href)) || active === g.id;
              return `
                <div class="sidebar-section">
                  <button type="button" class="sidebar-toggle" aria-expanded="${isGroupActive}" aria-controls="sb-sub-${g.id}">
                    <span class="sidebar-icon">${g.icon}</span>
                    <span class="sidebar-section-title">${g.title}</span>
                    <span class="sidebar-caret">${ICON.chevron}</span>
                  </button>
                  <ul class="sidebar-sub-list" id="sb-sub-${g.id}">
                    ${g.items.map(it => `
                      <li><a href="${base}${it.href}" class="sidebar-sub-link ${isActive(it.href) ? 'active' : ''}">${it.name}</a></li>
                    `).join('')}
                  </ul>
                </div>
              `;
            }).join('')}
          </div>

          <div class="sidebar-group">
            <p class="sidebar-group-label">Support</p>
            <div class="sidebar-item">
              <a href="${base}pages/help.html" class="sidebar-link ${active === 'help' ? 'active' : ''}">
                <span class="sidebar-icon">${ICON.help}</span>
                <span class="sidebar-link-text">Help & FAQ</span>
              </a>
            </div>
            <div class="sidebar-item">
              <a href="${base}pages/settings.html" class="sidebar-link ${active === 'settings' ? 'active' : ''}">
                <span class="sidebar-icon">${ICON.settings}</span>
                <span class="sidebar-link-text">Settings</span>
              </a>
            </div>
          </div>
        </nav>

        <div class="sidebar-foot">
          <a href="${base}pages/about.html" class="sidebar-foot-item">
            <span class="sidebar-icon">${ICON.info}</span>
            <span class="sidebar-foot-text">About Us</span>
          </a>
          <a href="${base}pages/contact.html" class="sidebar-foot-item">
            <span class="sidebar-icon">${ICON.mail}</span>
            <span class="sidebar-foot-text">Contact</span>
          </a>
        </div>
      `;

      return aside;
    },

    setupSidebar() {
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const hamburger = document.getElementById('ts-hamburger');
      const closeBtn = document.getElementById('sidebar-close');
      if (!sidebar || !backdrop || !hamburger) return;

      const isMobile = () => window.innerWidth < 768;
      const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
      const isDesktop = () => window.innerWidth >= 1024;

      function toggleMobile() {
        const isOpen = sidebar!.classList.toggle('open');
        backdrop!.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }

      function toggleCollapsed() {
        if (isTablet()) {
          sidebar!.classList.toggle('is-expanded');
        } else {
          sidebar!.classList.toggle('is-collapsed');
        }
      }

      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMobile()) toggleMobile();
        else toggleCollapsed();
      });

      closeBtn?.addEventListener('click', () => {
        if (isMobile()) toggleMobile();
      });

      backdrop.addEventListener('click', () => {
        if (isMobile()) toggleMobile();
      });

      // Accordion Logic
      sidebar.querySelectorAll('.sidebar-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!expanded));
          
          // Auto-expand sidebar if in tablet mini mode
          if (isTablet() && !sidebar.classList.contains('is-expanded')) {
            sidebar.classList.add('is-expanded');
          }
        });
      });

      // Close mobile sidebar on link click
      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (isMobile() && sidebar.classList.contains('open')) toggleMobile();
        });
      });

      // Handle resize transitions
      window.addEventListener('resize', () => {
        if (!isMobile()) {
          sidebar.classList.remove('open');
          backdrop.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    },

    setupTheme() {
      const toggle = document.getElementById('theme-toggle');
      if (!toggle) return;
      const syncToggleState = () => {
        const t = document.documentElement.getAttribute('data-theme') || 'light';
        toggle.setAttribute('aria-pressed', String(t === 'dark'));
        toggle.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} theme`);
      };
      syncToggleState();
      toggle.addEventListener('click', () => {
        if (window.THEME_MANAGER_LOADED) {
          requestAnimationFrame(syncToggleState);
          return;
        }
        const current =
          document.documentElement.getAttribute('data-theme') ||
          (localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', next === 'dark' ? '#0F172A' : '#4F46E5');
        syncToggleState();
      });
    },

    setupEffects() {
      const stripe = document.querySelector('.top-stripe');
      if (stripe) {
        document.addEventListener('scroll', (e: Event) => {
          const t = e.target as Element;
          if (t.classList && (t.classList.contains('panel') || t.classList.contains('viewport'))) {
            stripe.classList.toggle('scrolled', (t as HTMLElement).scrollTop > 4);
          }
        }, true);
        window.addEventListener('scroll', () => {
          stripe.classList.toggle('scrolled', window.scrollY > 4);
        }, { passive: true });
      }

      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as Element;
        const btn = target.closest('.cat-btn, .dock-btn, .panel-cta-btn, .home-hero-cta-primary, .home-hero-cta-ghost, .fmt-btn, .btn') as HTMLElement | null;
        if (btn && !(btn as HTMLButtonElement).disabled) {
          const r = btn.getBoundingClientRect();
          const size = Math.max(r.width, r.height);
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
          ripple.style.top  = (e.clientY - r.top  - size / 2) + 'px';
          btn.appendChild(ripple);
          ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        }
      });
    },

    setupErrorHandling() {
      window.addEventListener('error', (e: ErrorEvent) => {
        const fromToolFile = e.filename && (e.filename.includes('/js/') || e.filename.includes('tool'));
        if (!fromToolFile) return;
        console.error('KaruviLab Tool Error:', e.message, e.filename);
        shell.showFallbackError();
      });

      window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
        const reason = e.reason;
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        const msg = reason instanceof Error ? reason.message : String(reason ?? 'Unknown async error');
        console.error('KaruviLab Unhandled Rejection:', msg);
        shell.toast('An unexpected error occurred. Please try again.', 'error');
      });

      window.addEventListener('pagehide', () => {
        if (typeof Utils !== 'undefined') Utils.revokeAllObjectURLs();
      });
    },

    showFallbackError(msg?: string) {
      const scroll = document.querySelector('.panel-scroll');
      if (scroll && !scroll.querySelector('.tool-error-fallback')) {
        const isCalc = window.SHELL_ACTIVE === 'calculators';
        const err = document.createElement('div');
        err.className = 'tool-error-fallback';
        err.style.cssText = 'padding:40px 20px;text-align:center;color:var(--text-3);';
        err.innerHTML = `
          <div style="font-size:2rem;margin-bottom:12px">⚠️</div>
          <p style="font-weight:600;margin-bottom:8px">${msg || (isCalc ? 'Calculator failed to load. Please refresh.' : 'Oops! This tool encountered an error.')}</p>
          <p style="font-size:.85rem;margin-bottom:20px">Please try refreshing the page or contact support if the issue persists.</p>
          <button onclick="location.reload()" class="fmt-btn" style="display:inline-flex">Refresh Page</button>
        `;
        scroll.prepend(err);
      }
    },

    async waitForLibs(libs: string[], toolName: string): Promise<boolean> {
      let attempts = 0;
      const maxAttempts = 150;

      const scroll = document.querySelector('.panel-scroll');
      let loader: HTMLElement | null = null;
      if (scroll && !document.querySelector('.lib-loader')) {
        loader = document.createElement('div');
        loader.className = 'lib-loader';
        loader.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.9);padding:20px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.1);z-index:10000;display:flex;flex-direction:column;align-items:center;gap:12px;font-weight:600;color:var(--blue);';
        loader.innerHTML = `<span class="spinner"></span> <span>Preparing ${toolName}...</span>`;
        document.body.appendChild(loader);
      }

      return new Promise(resolve => {
        const check = () => {
          const missing = libs.filter(l => {
            if (l.includes('.')) {
              return !l.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], window as unknown);
            }
            return !(window as unknown as Record<string, unknown>)[l];
          });
          if (missing.length === 0) {
            loader?.remove();
            resolve(true);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(check, 100);
          } else {
            loader?.remove();
            shell.toast(`Failed to load dependencies for ${toolName}. Please check your connection.`, 'error');
            shell.showFallbackError(`Could not load required libraries: ${missing.join(', ')}`);
            resolve(false);
          }
        };
        check();
      });
    },

    toast(msg: string, type: ToastType = 'info', duration: number = 3000) {
      let container = document.getElementById('ts-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'ts-toast-container';
        document.body.appendChild(container);
      }
      const el = document.createElement('div');
      el.className = `ts-toast ts-toast-${type}`;
      const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
      el.innerHTML = `<span class="ts-toast-icon">${icon}</span><span class="ts-toast-msg">${Utils.escHtml(msg)}</span>`;
      container.appendChild(el);
      setTimeout(() => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 400);
      }, duration);
    },
  };

  window.Shell = shell;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => shell.init());
  } else {
    shell.init();
  }
})();
