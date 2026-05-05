document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;
  if (hash) {
    const panelId = hash.replace("#panel-", "").replace("#", "");
    const panelMap = {
      compressor: "compress",
      converter: "convert",
      creator: "create",
      pdf: "pdf-tools",
      validator: "validate",
      calculators: "calculators",
      base64: "base64",
      regex: "regex",
      formatter: "format",
      markdown: "markdown",
      qrcode: "qrcode",
      "split-copy": "split-copy"
    };
    if (panelMap[panelId]) {
      const dest = panelMap[panelId];
      const path = dest.includes("-") || dest === "calculators" ? `/${dest}/` : `/tools/${dest}/`;
      window.location.href = path;
    }
  }
  const faqOverlay = document.getElementById("faq-overlay");
  const faqCloseBtn = document.getElementById("faq-close-btn");
  const faqTriggers = document.querySelectorAll('[data-action="open-faq"]');
  let lastFocusedTrigger = null;
  const FOCUSABLE_SELECTOR = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "summary",
    "details"
  ].join(",");
  function getFocusable(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
  }
  function setTriggersExpanded(expanded) {
    faqTriggers.forEach((t) => t.setAttribute("aria-expanded", String(expanded)));
  }
  function openFaq(trigger) {
    if (!faqOverlay) return;
    lastFocusedTrigger = trigger ?? document.activeElement;
    faqOverlay.classList.remove("hidden");
    faqOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("faq-open");
    setTriggersExpanded(true);
    requestAnimationFrame(() => {
      const focusables = getFocusable(faqOverlay);
      const target = faqCloseBtn ?? focusables[0];
      target?.focus();
    });
  }
  function closeFaq() {
    if (!faqOverlay) return;
    faqOverlay.classList.add("hidden");
    faqOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("faq-open");
    setTriggersExpanded(false);
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }
  faqTriggers.forEach((btn) => {
    btn.addEventListener("click", () => openFaq(btn));
  });
  faqCloseBtn?.addEventListener("click", closeFaq);
  faqOverlay?.addEventListener("click", (e) => {
    if (e.target === faqOverlay) closeFaq();
  });
  document.addEventListener("keydown", (e) => {
    if (!faqOverlay || faqOverlay.classList.contains("hidden")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeFaq();
      return;
    }
    if (e.key === "Tab") {
      const focusables = getFocusable(faqOverlay);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});
