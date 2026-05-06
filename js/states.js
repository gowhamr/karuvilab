(function() {
  const STATE_ATTR = "data-state-block";
  function escHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c] || c);
  }
  function resolve(target) {
    if (!target) return null;
    if (typeof target === "string") return document.querySelector(target);
    return target;
  }
  function clear(target) {
    const el = resolve(target);
    if (!el) return;
    el.querySelectorAll(`[${STATE_ATTR}]`).forEach((node) => node.remove());
  }
  function mount(target, kind, html) {
    const el = resolve(target);
    if (!el) return null;
    clear(el);
    const block = document.createElement("div");
    block.setAttribute(STATE_ATTR, kind);
    block.className = `state-block state-${kind}`;
    if (kind === "error") block.setAttribute("role", "alert");
    else if (kind === "success" || kind === "loading") block.setAttribute("role", "status");
    block.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
    block.innerHTML = html;
    el.appendChild(block);
    return block;
  }
  function loading(target, opts = {}) {
    const title = opts.title ?? "Working on it\u2026";
    const message = opts.message ?? "";
    const progressBar = typeof opts.progress === "number" ? `<div class="state-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(opts.progress)}">
           <div class="state-progress-fill" style="width:${Math.max(0, Math.min(100, opts.progress))}%"></div>
         </div>` : `<span class="state-spinner" aria-hidden="true"></span>`;
    return mount(target, "loading", `
      <div class="state-icon">${progressBar}</div>
      <p class="state-title">${escHtml(title)}</p>
      ${message ? `<p class="state-message">${escHtml(message)}</p>` : ""}
    `);
  }
  function empty(target, opts = {}) {
    const title = opts.title ?? "Nothing to show yet";
    const message = opts.message ?? "";
    const icon = opts.icon ?? "\u{1F4C4}";
    return mount(target, "empty", `
      <div class="state-icon" aria-hidden="true">${icon}</div>
      <p class="state-title">${escHtml(title)}</p>
      ${message ? `<p class="state-message">${escHtml(message)}</p>` : ""}
    `);
  }
  function error(target, opts = {}) {
    const title = opts.title ?? "Something went wrong";
    const message = opts.message ?? "Please try again, or reload the page.";
    const retryLabel = opts.retryLabel ?? "Try again";
    const block = mount(target, "error", `
      <div class="state-icon" aria-hidden="true">\u26A0\uFE0F</div>
      <p class="state-title">${escHtml(title)}</p>
      <p class="state-message">${escHtml(message)}</p>
      ${opts.onRetry ? `<button type="button" class="btn btn-outline state-action" data-state-retry>${escHtml(retryLabel)}</button>` : ""}
    `);
    if (block && opts.onRetry) {
      block.querySelector("[data-state-retry]")?.addEventListener("click", () => {
        opts.onRetry();
      });
    }
    return block;
  }
  function success(target, opts = {}) {
    const title = opts.title ?? "All set!";
    const message = opts.message ?? "";
    const block = mount(target, "success", `
      <div class="state-icon" aria-hidden="true">\u2705</div>
      <p class="state-title">${escHtml(title)}</p>
      ${message ? `<p class="state-message">${escHtml(message)}</p>` : ""}
      ${opts.actionLabel && opts.onAction ? `<button type="button" class="btn btn-primary state-action" data-state-action>${escHtml(opts.actionLabel)}</button>` : ""}
    `);
    if (block && opts.onAction) {
      block.querySelector("[data-state-action]")?.addEventListener("click", () => {
        opts.onAction();
      });
    }
    return block;
  }
  window.States = {
    loading,
    empty,
    error,
    success,
    clear
  };
})();
