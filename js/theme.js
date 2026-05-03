(function() {
  function getTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(theme, persist = null) {
    document.documentElement.setAttribute("data-theme", theme);
    if (persist === "save") {
      localStorage.setItem("theme", theme);
    } else if (persist === "clear") {
      localStorage.removeItem("theme");
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0F172A" : "#4F46E5");
    }
  }
  setTheme(getTheme());
  document.addEventListener("click", (e) => {
    const target = e.target;
    const btn = target.closest("#theme-toggle") || target.closest(".theme-toggle-btn") || target.closest(".theme-toggle");
    if (!btn) return;
    const current = document.documentElement.getAttribute("data-theme") || getTheme();
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.classList.add("theme-transitioning");
    setTheme(next, "save");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 400);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
  window.THEME_MANAGER_LOADED = true;
})();
