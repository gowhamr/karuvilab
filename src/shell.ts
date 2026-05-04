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
    else if (path.includes('/utilities/'))  window.SHELL_ACTIVE = 'utils';
    else if (path.includes('/seo-tools/'))  window.SHELL_ACTIVE = 'seo';
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
      header.innerHTML = `
        <div class="ts-brand">
          <a href="${base}" class="ts-logo-link" style="text-decoration:none">
            <div class="ts-logo" style="background: #6366F1; border-radius: 9px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M8.5 2h7"/><path d="M14 9.31L20.39 21H3.61L10 9.31"/>
              </svg>
            </div>
          </a>
          <div class="ts-brand-text">
            <span class="ts-name">KaruviLab</span>
            <span class="ts-tagline">Fast &middot; Private &middot; No uploads</span>
          </div>
          <nav class="ts-desktop-nav" aria-label="Main navigation">
            <a href="${base}" class="ts-nav-link ${active === 'home' ? 'active' : ''}">Home</a>
            <a href="${base}tools/compress/" class="ts-nav-link ${active === 'compress' ? 'active' : ''}">Compress</a>
            <a href="${base}pdf-tools/" class="ts-nav-link ${active === 'pdf' ? 'active' : ''}">PDF</a>
            <a href="${base}tools/validate/" class="ts-nav-link ${active === 'validate' ? 'active' : ''}">Validate</a>
            <a href="${base}calculators/" class="ts-nav-link ${active === 'calculators' ? 'active' : ''}">Calculators</a>
          </nav>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
            <svg class="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <span class="ts-badge" style="font-size: .65rem; font-weight: 800; padding: 4px 10px; border-radius: 8px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            PRIVATE
          </span>
        </div>
      `;

      const dock = document.createElement('nav');
      dock.className = 'dock';
      dock.innerHTML = `
        <a href="${base}" class="dock-btn ${active === 'home' ? 'active' : ''}">
          <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
          <span class="dock-lbl">Home</span>
        </a>
        <a href="${base}tools/" class="dock-btn ${active === 'tools' ? 'active' : ''}">
          <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <span class="dock-lbl">All Tools</span>
        </a>
        <a href="${base}pages/about.html" class="dock-btn">
          <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span class="dock-lbl">Help / Settings</span>
        </a>
      `;

      document.body.prepend(header);

      if (!document.querySelector('.viewport')) {
        const viewport = document.createElement('div');
        viewport.className = 'viewport';
        const sprite = document.getElementById('ic-sprite');
        Array.from(document.body.children)
          .filter(c => c !== header && c !== sprite)
          .forEach(c => viewport.appendChild(c));
        document.body.appendChild(viewport);
      }

      document.body.appendChild(dock);

      const marker = document.createElement('div');
      marker.id = 'shell-rendered';
      marker.style.display = 'none';
      document.body.appendChild(marker);
    },

    setupTheme() {
      const toggle = document.getElementById('theme-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', () => {
        if (window.THEME_MANAGER_LOADED) return;
        const current =
          document.documentElement.getAttribute('data-theme') ||
          (localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', next === 'dark' ? '#0F172A' : '#4F46E5');
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
