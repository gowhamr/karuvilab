(function() {
  if (!window.SHELL_ACTIVE) {
    const path = window.location.pathname;
    if (path.includes("/calculators/")) window.SHELL_ACTIVE = "calculators";
    else if (path.includes("/pdf-tools/")) window.SHELL_ACTIVE = "pdf";
    else if (path.includes("/image-tools/")) window.SHELL_ACTIVE = "image";
    else if (path.includes("/security-tools/")) window.SHELL_ACTIVE = "security";
    else if (path.includes("/developer-tools/")) window.SHELL_ACTIVE = "dev";
    else if (path.includes("/utilities/")) window.SHELL_ACTIVE = "utils";
    else if (path.includes("/tools/seo/")) window.SHELL_ACTIVE = "seo";
    else if (path.includes("/tools/")) {
      const seoTools = ["meta-tags", "image-seo", "slug-generator"];
      const isSeo = seoTools.some((t) => path.includes("/" + t + "/"));
      if (isSeo) {
        window.SHELL_ACTIVE = "seo";
        return;
      }
      const tools = ["markdown", "qrcode", "base64", "regex", "format", "validate", "compress", "convert", "create"];
      const found = tools.find((t) => path.includes("/" + t + "/"));
      window.SHELL_ACTIVE = found || "tools";
    } else {
      window.SHELL_ACTIVE = "home";
    }
  }
  const script = document.currentScript || document.querySelector('script[src*="js/shell.js"]');
  const base = script ? script.src.replace(/js\/shell\.js.*$/, "") : "/";
  window.KARUVI_BASE = base;
  const shell = {
    init() {
      this.render();
      this.setupTheme();
      this.setupEffects();
      this.setupErrorHandling();
      this.setupSidebar();
      this.recordVisit();
    },
    recordVisit() {
      try {
        if ((window.SHELL_ACTIVE || "home") === "home") return;
        const RECENT_KEY = "karuvi.recent.paths";
        const RECENT_LIMIT = 8;
        const path = window.location.pathname.replace(/index\.html$/, "");
        if (!path || path === "/") return;
        const raw = localStorage.getItem(RECENT_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const next = [path, ...list.filter((p) => p !== path)].slice(0, RECENT_LIMIT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
      }
    },
    goHome() {
      try {
        window.location.href = window.KARUVI_BASE || "/";
      } catch {
        window.location.href = "/";
      }
    },
    render() {
      if (document.getElementById("shell-rendered")) return;
      const active = window.SHELL_ACTIVE || "home";
      document.body.classList.add("app-shell");
      const base2 = window.KARUVI_BASE || "/";
      if (!document.getElementById("ic-sprite")) {
        const sprite = document.createElement("div");
        sprite.id = "ic-sprite";
        sprite.style.display = "none";
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
      const header = document.createElement("header");
      header.className = "top-stripe";
      header.setAttribute("role", "banner");
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      header.innerHTML = `
        <div class="ts-left">
          <button type="button" class="ts-hamburger" id="ts-hamburger" aria-label="Open navigation menu" aria-controls="app-sidebar" aria-expanded="false">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <a href="${base2}" class="ts-logo-link" aria-label="KaruviLab home" style="text-decoration:none">
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

        <form class="ts-search" role="search" action="${base2}" method="get" aria-label="Search KaruviLab tools">
          <label for="ts-search-input" class="sr-only">Search tools</label>
          <span class="ts-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input id="ts-search-input" type="search" name="q" placeholder="Search tools\u2026" autocomplete="off" spellcheck="false" />
        </form>

        <div class="ts-actions">
          <button type="button" class="ts-icon-btn ts-search-trigger" id="ts-search-trigger" aria-label="Open search" aria-expanded="false">
            <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to ${currentTheme === "dark" ? "light" : "dark"} theme" aria-pressed="${currentTheme === "dark"}">
            <svg class="theme-icon-moon" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="theme-icon-sun" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <span class="ts-badge" role="status" aria-label="Privacy: all processing happens locally">
            <svg aria-hidden="true" focusable="false" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            <span class="ts-badge-label">PRIVATE</span>
          </span>
        </div>
      `;
      const dock = document.createElement("nav");
      dock.className = "dock";
      dock.setAttribute("aria-label", "Primary");
      dock.innerHTML = `
        <a href="${base2}" class="dock-btn ${active === "home" ? "active" : ""}"${active === "home" ? ' aria-current="page"' : ""}>
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          <span class="dock-lbl">Home</span>
        </a>
        <a href="${base2}tools/" class="dock-btn ${active === "tools" ? "active" : ""}"${active === "tools" ? ' aria-current="page"' : ""}>
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span class="dock-lbl">All Tools</span>
        </a>
        <a href="${base2}pages/help.html" class="dock-btn">
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span class="dock-lbl">Help</span>
        </a>
        <a href="${base2}pages/settings.html" class="dock-btn">
          <svg class="dock-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span class="dock-lbl">Settings</span>
        </a>
      `;
      document.body.prepend(header);
      const sidebar = this.buildSidebar(base2, active);
      document.body.appendChild(sidebar);
      const backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      backdrop.id = "sidebar-backdrop";
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
      if (!document.querySelector(".viewport")) {
        const viewport = document.createElement("div");
        viewport.className = "viewport";
        viewport.id = "app-viewport";
        const sprite = document.getElementById("ic-sprite");
        Array.from(document.body.children).filter((c) => c !== header && c !== sidebar && c !== backdrop && c !== sprite).forEach((c) => viewport.appendChild(c));
        document.body.appendChild(viewport);
      }
      document.body.appendChild(dock);
      const marker = document.createElement("div");
      marker.id = "shell-rendered";
      marker.style.display = "none";
      document.body.appendChild(marker);
    },
    buildSidebar(base2, active) {
      const ICON = {
        pdf: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>',
        calc: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><rect x="8" y="10" width="2" height="2"/><rect x="11" y="10" width="2" height="2"/><rect x="14" y="10" width="2" height="2"/></svg>',
        image: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
        security: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        dev: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        utils: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>',
        seo: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
        clock: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
      };
      const GROUPS = [
        { id: "pdf", title: "PDF Tools", categoryKey: "pdf", iconSvg: ICON.pdf, href: "pdf-tools/", items: [
          { name: "Compress PDF", href: "pdf-tools/compress-pdf/" },
          { name: "Merge PDF", href: "pdf-tools/merge-pdf/" },
          { name: "Split PDF", href: "pdf-tools/split-pdf/" },
          { name: "PDF to Word", href: "pdf-tools/pdf-to-word/" },
          { name: "See all PDF tools", href: "pdf-tools/" }
        ] },
        { id: "calculators", title: "Calculators", categoryKey: "calculators", iconSvg: ICON.calc, href: "calculators/", items: [
          { name: "EMI Calculator", href: "calculators/emi-calculator/" },
          { name: "Percentage Calculator", href: "calculators/percentage-calculator/" },
          { name: "Age Calculator", href: "calculators/age-calculator/" },
          { name: "See all calculators", href: "calculators/" }
        ] },
        { id: "image", title: "Image Tools", categoryKey: "image", iconSvg: ICON.image, href: "image-tools/", items: [
          { name: "Compress Image", href: "tools/compress/" },
          { name: "Background Remover", href: "image-tools/bg-remover/" },
          { name: "Image Converter", href: "tools/image-converter/" },
          { name: "See all image tools", href: "image-tools/" }
        ] },
        { id: "utils", title: "Daily Utilities", categoryKey: "utils", iconSvg: ICON.utils, href: "utilities/", items: [
          { name: "QR Code Generator", href: "tools/qrcode/" },
          { name: "Markdown Editor", href: "tools/markdown/" },
          { name: "Text Utility", href: "tools/text-utility/" },
          { name: "See all utilities", href: "utilities/" }
        ] },
        { id: "developer", title: "Developer Tools", categoryKey: "dev", iconSvg: ICON.dev, href: "developer-tools/", items: [
          { name: "JSON Formatter", href: "tools/json-formatter/" },
          { name: "Base64", href: "tools/base64/" },
          { name: "Regex Tester", href: "tools/regex/" },
          { name: "See all dev tools", href: "developer-tools/" }
        ] },
        { id: "security", title: "Security & Encoding", categoryKey: "security", iconSvg: ICON.security, href: "security-tools/", items: [
          { name: "Hash Generator", href: "tools/hash-generator/" },
          { name: "Password Generator", href: "tools/password-generator/" },
          { name: "JWT Decoder", href: "tools/jwt-decoder/" },
          { name: "See all security tools", href: "security-tools/" }
        ] },
        { id: "seo", title: "SEO Tools", categoryKey: "seo", iconSvg: ICON.seo, href: "tools/seo/", items: [
          { name: "Meta Tags Generator", href: "tools/meta-tags/" },
          { name: "Sitemap Generator", href: "tools/sitemap-generator/" },
          { name: "Slug Generator", href: "tools/slug-generator/" },
          { name: "See all SEO tools", href: "tools/seo/" }
        ] }
      ];
      const norm = (p) => p.replace(/^\/+/, "").replace(/index\.html$/, "").replace(/\/+$/, "");
      const currentNorm = norm(window.location.pathname);
      function isActiveItem(href) {
        const h = norm(href);
        return currentNorm === h || currentNorm.endsWith("/" + h);
      }
      let recentPaths = [];
      try {
        const raw = localStorage.getItem("karuvi.recent.paths");
        if (raw) recentPaths = JSON.parse(raw).filter((p) => typeof p === "string").slice(0, 5);
      } catch {
      }
      function deriveName(path) {
        const seg = norm(path).split("/").pop() || path;
        return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
      function nameForPath(path) {
        const np = norm(path);
        for (const g of GROUPS) {
          for (const it of g.items) {
            if (norm(it.href) === np) return it.name;
          }
        }
        return deriveName(path);
      }
      const aside = document.createElement("aside");
      aside.className = "app-sidebar";
      aside.id = "app-sidebar";
      aside.setAttribute("role", "navigation");
      aside.setAttribute("aria-label", "Tool sections");
      aside.setAttribute("aria-hidden", "true");
      const recentHtml = recentPaths.length === 0 ? "" : `
        <section class="sidebar-section">
          <h3 class="sidebar-section-label">Recent</h3>
          <ul class="sidebar-list">
            ${recentPaths.map((p) => `
              <li><a href="${base2}${norm(p)}/" class="sidebar-link${isActiveItem(p) ? " active" : ""}"${isActiveItem(p) ? ' aria-current="page"' : ""}>
                <span class="sidebar-link-dot" aria-hidden="true"></span>
                <span class="sidebar-link-text">${nameForPath(p).replace(/[<>&]/g, "")}</span>
              </a></li>
            `).join("")}
          </ul>
        </section>
      `;
      const groupsHtml = GROUPS.map((g) => {
        const groupActive = active === g.categoryKey || g.items.some((it) => isActiveItem(it.href));
        const expanded = groupActive ? "true" : "false";
        const listId = `sidebar-list-${g.id}`;
        return `
          <section class="sidebar-section${groupActive ? " is-current" : ""}">
            <button type="button" class="sidebar-section-toggle" aria-expanded="${expanded}" aria-controls="${listId}">
              <span class="sidebar-section-icon" aria-hidden="true">${g.iconSvg}</span>
              <span class="sidebar-section-title">${g.title}</span>
              <svg class="sidebar-caret" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <ul class="sidebar-list" id="${listId}"${expanded === "false" ? " hidden" : ""}>
              ${g.items.map((it) => `
                <li><a href="${base2}${it.href}" class="sidebar-link${isActiveItem(it.href) ? " active" : ""}"${isActiveItem(it.href) ? ' aria-current="page"' : ""}>
                  <span class="sidebar-link-dot" aria-hidden="true"></span>
                  <span class="sidebar-link-text">${it.name}</span>
                </a></li>
              `).join("")}
            </ul>
          </section>
        `;
      }).join("");
      aside.innerHTML = `
        <div class="sidebar-head">
          <a href="${base2}" class="sidebar-brand" aria-label="KaruviLab home" style="text-decoration:none">
            <span class="sidebar-brand-mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M5 3h3v18H5z"/><path d="M8 12 17 3h3l-9 9 9 9h-3z"/></svg>
            </span>
            <span class="sidebar-brand-text">KaruviLab</span>
          </a>
          <button type="button" class="sidebar-close" id="sidebar-close" aria-label="Close menu">
            <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <nav class="sidebar-scroll" aria-label="Tool categories">
          <ul class="sidebar-list sidebar-quick">
            <li><a href="${base2}" class="sidebar-link${active === "home" ? " active" : ""}"${active === "home" ? ' aria-current="page"' : ""}>
              <span class="sidebar-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
              <span class="sidebar-link-text">Home</span>
            </a></li>
          </ul>
          ${recentHtml}
          ${groupsHtml}
        </nav>
        <div class="sidebar-foot">
          <a href="${base2}pages/help.html" class="sidebar-foot-link">Help</a>
          <span aria-hidden="true">\xB7</span>
          <a href="${base2}pages/settings.html" class="sidebar-foot-link">Settings</a>
          <span aria-hidden="true">\xB7</span>
          <a href="${base2}pages/about.html" class="sidebar-foot-link">About</a>
          <span aria-hidden="true">\xB7</span>
          <a href="${base2}pages/contact.html" class="sidebar-foot-link">Contact</a>
        </div>
      `;
      return aside;
    },
    setupSidebar() {
      const sidebar = document.getElementById("app-sidebar");
      const backdrop = document.getElementById("sidebar-backdrop");
      const hamburger = document.getElementById("ts-hamburger");
      const closeBtn = document.getElementById("sidebar-close");
      const searchTrigger = document.getElementById("ts-search-trigger");
      const searchForm = document.querySelector(".ts-search");
      const searchInput = document.getElementById("ts-search-input");
      if (!sidebar || !backdrop || !hamburger) return;
      const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),[tabindex]:not([tabindex="-1"])';
      let lastFocused = null;
      const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
      function syncForViewport() {
        if (isDesktop()) {
          sidebar.classList.remove("open");
          backdrop.hidden = true;
          backdrop.classList.remove("open");
          sidebar.setAttribute("aria-hidden", "false");
          hamburger.setAttribute("aria-expanded", "false");
          document.body.classList.remove("sidebar-open");
        } else if (!sidebar.classList.contains("open")) {
          sidebar.setAttribute("aria-hidden", "true");
        }
      }
      function open() {
        if (isDesktop()) return;
        lastFocused = document.activeElement;
        sidebar.classList.add("open");
        sidebar.setAttribute("aria-hidden", "false");
        backdrop.hidden = false;
        requestAnimationFrame(() => backdrop.classList.add("open"));
        hamburger.setAttribute("aria-expanded", "true");
        document.body.classList.add("sidebar-open");
        const first = sidebar.querySelector(FOCUSABLE);
        first?.focus();
      }
      function close() {
        if (isDesktop()) return;
        sidebar.classList.remove("open");
        sidebar.setAttribute("aria-hidden", "true");
        backdrop.classList.remove("open");
        setTimeout(() => {
          if (!sidebar.classList.contains("open")) backdrop.hidden = true;
        }, 220);
        hamburger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("sidebar-open");
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      }
      hamburger.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) close();
        else open();
      });
      closeBtn?.addEventListener("click", close);
      backdrop.addEventListener("click", close);
      sidebar.querySelectorAll(".sidebar-section-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const expanded = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!expanded));
          const id = btn.getAttribute("aria-controls");
          if (!id) return;
          const list = document.getElementById(id);
          if (list) list.hidden = expanded;
        });
      });
      document.addEventListener("keydown", (e) => {
        if (isDesktop()) return;
        if (!sidebar.classList.contains("open")) return;
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }
        if (e.key === "Tab") {
          const items = Array.from(sidebar.querySelectorAll(FOCUSABLE)).filter((el) => !el.disabled && el.offsetParent !== null);
          if (items.length === 0) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
      searchTrigger?.addEventListener("click", () => {
        const expanded = searchTrigger.getAttribute("aria-expanded") === "true";
        searchTrigger.setAttribute("aria-expanded", String(!expanded));
        document.body.classList.toggle("search-open", !expanded);
        if (!expanded) searchInput?.focus();
      });
      searchForm?.addEventListener("submit", () => {
      });
      sidebar.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          if (!isDesktop()) close();
        });
      });
      window.addEventListener("resize", syncForViewport);
      syncForViewport();
    },
    setupTheme() {
      const toggle = document.getElementById("theme-toggle");
      if (!toggle) return;
      const syncToggleState = () => {
        const t = document.documentElement.getAttribute("data-theme") || "light";
        toggle.setAttribute("aria-pressed", String(t === "dark"));
        toggle.setAttribute("aria-label", `Switch to ${t === "dark" ? "light" : "dark"} theme`);
      };
      syncToggleState();
      toggle.addEventListener("click", () => {
        if (window.THEME_MANAGER_LOADED) {
          requestAnimationFrame(syncToggleState);
          return;
        }
        const current = document.documentElement.getAttribute("data-theme") || (localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", next === "dark" ? "#0F172A" : "#4F46E5");
        syncToggleState();
      });
    },
    setupEffects() {
      const stripe = document.querySelector(".top-stripe");
      if (stripe) {
        document.addEventListener("scroll", (e) => {
          const t = e.target;
          if (t.classList && (t.classList.contains("panel") || t.classList.contains("viewport"))) {
            stripe.classList.toggle("scrolled", t.scrollTop > 4);
          }
        }, true);
        window.addEventListener("scroll", () => {
          stripe.classList.toggle("scrolled", window.scrollY > 4);
        }, { passive: true });
      }
      document.addEventListener("click", (e) => {
        const target = e.target;
        const btn = target.closest(".cat-btn, .dock-btn, .panel-cta-btn, .home-hero-cta-primary, .home-hero-cta-ghost, .fmt-btn, .btn");
        if (btn && !btn.disabled) {
          const r = btn.getBoundingClientRect();
          const size = Math.max(r.width, r.height);
          const ripple = document.createElement("span");
          ripple.className = "ripple";
          ripple.style.width = ripple.style.height = size + "px";
          ripple.style.left = e.clientX - r.left - size / 2 + "px";
          ripple.style.top = e.clientY - r.top - size / 2 + "px";
          btn.appendChild(ripple);
          ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
        }
      });
    },
    setupErrorHandling() {
      window.addEventListener("error", (e) => {
        const fromToolFile = e.filename && (e.filename.includes("/js/") || e.filename.includes("tool"));
        if (!fromToolFile) return;
        console.error("KaruviLab Tool Error:", e.message, e.filename);
        shell.showFallbackError();
      });
      window.addEventListener("unhandledrejection", (e) => {
        const reason = e.reason;
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        const msg = reason instanceof Error ? reason.message : String(reason ?? "Unknown async error");
        console.error("KaruviLab Unhandled Rejection:", msg);
        shell.toast("An unexpected error occurred. Please try again.", "error");
      });
      window.addEventListener("pagehide", () => {
        if (typeof Utils !== "undefined") Utils.revokeAllObjectURLs();
      });
    },
    showFallbackError(msg) {
      const scroll = document.querySelector(".panel-scroll");
      if (scroll && !scroll.querySelector(".tool-error-fallback")) {
        const isCalc = window.SHELL_ACTIVE === "calculators";
        const err = document.createElement("div");
        err.className = "tool-error-fallback";
        err.style.cssText = "padding:40px 20px;text-align:center;color:var(--text-3);";
        err.innerHTML = `
          <div style="font-size:2rem;margin-bottom:12px">\u26A0\uFE0F</div>
          <p style="font-weight:600;margin-bottom:8px">${msg || (isCalc ? "Calculator failed to load. Please refresh." : "Oops! This tool encountered an error.")}</p>
          <p style="font-size:.85rem;margin-bottom:20px">Please try refreshing the page or contact support if the issue persists.</p>
          <button onclick="location.reload()" class="fmt-btn" style="display:inline-flex">Refresh Page</button>
        `;
        scroll.prepend(err);
      }
    },
    async waitForLibs(libs, toolName) {
      let attempts = 0;
      const maxAttempts = 150;
      const scroll = document.querySelector(".panel-scroll");
      let loader = null;
      if (scroll && !document.querySelector(".lib-loader")) {
        loader = document.createElement("div");
        loader.className = "lib-loader";
        loader.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.9);padding:20px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.1);z-index:10000;display:flex;flex-direction:column;align-items:center;gap:12px;font-weight:600;color:var(--blue);";
        loader.innerHTML = `<span class="spinner"></span> <span>Preparing ${toolName}...</span>`;
        document.body.appendChild(loader);
      }
      return new Promise((resolve) => {
        const check = () => {
          const missing = libs.filter((l) => {
            if (l.includes(".")) {
              return !l.split(".").reduce((o, k) => o?.[k], window);
            }
            return !window[l];
          });
          if (missing.length === 0) {
            loader?.remove();
            resolve(true);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(check, 100);
          } else {
            loader?.remove();
            shell.toast(`Failed to load dependencies for ${toolName}. Please check your connection.`, "error");
            shell.showFallbackError(`Could not load required libraries: ${missing.join(", ")}`);
            resolve(false);
          }
        };
        check();
      });
    },
    toast(msg, type = "info", duration = 3e3) {
      let container = document.getElementById("ts-toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "ts-toast-container";
        document.body.appendChild(container);
      }
      const el = document.createElement("div");
      el.className = `ts-toast ts-toast-${type}`;
      const icon = type === "success" ? "\u2705" : type === "error" ? "\u274C" : type === "warn" ? "\u26A0\uFE0F" : "\u2139\uFE0F";
      el.innerHTML = `<span class="ts-toast-icon">${icon}</span><span class="ts-toast-msg">${Utils.escHtml(msg)}</span>`;
      container.appendChild(el);
      setTimeout(() => {
        el.classList.add("out");
        setTimeout(() => el.remove(), 400);
      }, duration);
    }
  };
  window.Shell = shell;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => shell.init());
  } else {
    shell.init();
  }
})();
