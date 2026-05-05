/* ===== states.ts — Shared loading / empty / error / success UI =====
 *
 * Provides a tiny, dependency-free state-rendering helper exposed at
 * window.States. Every tool can drop a state into any container without
 * shipping its own markup.
 *
 *   States.loading(el, { title: 'Compressing…', message: '…' })
 *   States.empty(el,   { title: 'No files yet', message: 'Drop a PDF to start.' })
 *   States.error(el,   { title: 'Something went wrong', message: err.message, onRetry })
 *   States.success(el, { title: 'Done!', message: 'Your file is ready.', actionLabel: 'Download', onAction })
 *   States.clear(el)   // remove any state block this helper inserted
 *
 * Toast-style transient notifications continue to flow through Shell.toast().
 */

(function () {
  type Container = HTMLElement | string;

  interface BaseOptions {
    title?: string;
    message?: string;
  }

  interface LoadingOptions extends BaseOptions {
    progress?: number; // 0–100, omit for indeterminate spinner
  }

  interface EmptyOptions extends BaseOptions {
    icon?: string; // override emoji / svg string (raw HTML accepted)
  }

  interface ErrorOptions extends BaseOptions {
    onRetry?: () => void;
    retryLabel?: string;
  }

  interface SuccessOptions extends BaseOptions {
    actionLabel?: string;
    onAction?: () => void;
  }

  const STATE_ATTR = 'data-state-block';

  function escHtml(value: unknown): string {
    return String(value).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    } as Record<string, string>)[c] || c);
  }

  function resolve(target: Container | null | undefined): HTMLElement | null {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  function clear(target: Container | null | undefined): void {
    const el = resolve(target);
    if (!el) return;
    el.querySelectorAll(`[${STATE_ATTR}]`).forEach(node => node.remove());
  }

  function mount(target: Container | null | undefined, kind: string, html: string): HTMLElement | null {
    const el = resolve(target);
    if (!el) return null;
    clear(el);
    const block = document.createElement('div');
    block.setAttribute(STATE_ATTR, kind);
    block.className = `state-block state-${kind}`;
    if (kind === 'error') block.setAttribute('role', 'alert');
    else if (kind === 'success' || kind === 'loading') block.setAttribute('role', 'status');
    block.setAttribute('aria-live', kind === 'error' ? 'assertive' : 'polite');
    block.innerHTML = html;
    el.appendChild(block);
    return block;
  }

  function loading(target: Container, opts: LoadingOptions = {}): HTMLElement | null {
    const title = opts.title ?? 'Working on it…';
    const message = opts.message ?? '';
    const progressBar = typeof opts.progress === 'number'
      ? `<div class="state-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(opts.progress)}">
           <div class="state-progress-fill" style="width:${Math.max(0, Math.min(100, opts.progress))}%"></div>
         </div>`
      : `<span class="state-spinner" aria-hidden="true"></span>`;
    return mount(target, 'loading', `
      <div class="state-icon">${progressBar}</div>
      <p class="state-title">${escHtml(title)}</p>
      ${message ? `<p class="state-message">${escHtml(message)}</p>` : ''}
    `);
  }

  function empty(target: Container, opts: EmptyOptions = {}): HTMLElement | null {
    const title = opts.title ?? 'Nothing to show yet';
    const message = opts.message ?? '';
    const icon = opts.icon ?? '\u{1F4C4}'; // 📄
    return mount(target, 'empty', `
      <div class="state-icon" aria-hidden="true">${icon}</div>
      <p class="state-title">${escHtml(title)}</p>
      ${message ? `<p class="state-message">${escHtml(message)}</p>` : ''}
    `);
  }

  function error(target: Container, opts: ErrorOptions = {}): HTMLElement | null {
    const title = opts.title ?? 'Something went wrong';
    const message = opts.message ?? 'Please try again, or reload the page.';
    const retryLabel = opts.retryLabel ?? 'Try again';
    const block = mount(target, 'error', `
      <div class="state-icon" aria-hidden="true">\u{26A0}\u{FE0F}</div>
      <p class="state-title">${escHtml(title)}</p>
      <p class="state-message">${escHtml(message)}</p>
      ${opts.onRetry ? `<button type="button" class="btn btn-outline state-action" data-state-retry>${escHtml(retryLabel)}</button>` : ''}
    `);
    if (block && opts.onRetry) {
      block.querySelector<HTMLButtonElement>('[data-state-retry]')?.addEventListener('click', () => {
        opts.onRetry!();
      });
    }
    return block;
  }

  function success(target: Container, opts: SuccessOptions = {}): HTMLElement | null {
    const title = opts.title ?? 'All set!';
    const message = opts.message ?? '';
    const block = mount(target, 'success', `
      <div class="state-icon" aria-hidden="true">\u{2705}</div>
      <p class="state-title">${escHtml(title)}</p>
      ${message ? `<p class="state-message">${escHtml(message)}</p>` : ''}
      ${opts.actionLabel && opts.onAction
        ? `<button type="button" class="btn btn-primary state-action" data-state-action>${escHtml(opts.actionLabel)}</button>`
        : ''}
    `);
    if (block && opts.onAction) {
      block.querySelector<HTMLButtonElement>('[data-state-action]')?.addEventListener('click', () => {
        opts.onAction!();
      });
    }
    return block;
  }

  (window as Window & { States?: unknown }).States = {
    loading,
    empty,
    error,
    success,
    clear,
  };
})();
