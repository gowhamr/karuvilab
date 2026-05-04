(function() {
  const el = (id) => document.getElementById(id);
  const cities = [
    { name: "Mumbai", country: "India", tz: "Asia/Kolkata" },
    { name: "New York", country: "USA", tz: "America/New_York" },
    { name: "London", country: "UK", tz: "Europe/London" },
    { name: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
    { name: "Sydney", country: "Australia", tz: "Australia/Sydney" },
    { name: "Dubai", country: "UAE", tz: "Asia/Dubai" },
    { name: "Singapore", country: "Singapore", tz: "Asia/Singapore" },
    { name: "Paris", country: "France", tz: "Europe/Paris" },
    { name: "Berlin", country: "Germany", tz: "Europe/Berlin" },
    { name: "Los Angeles", country: "USA", tz: "America/Los_Angeles" },
    { name: "Chicago", country: "USA", tz: "America/Chicago" },
    { name: "Toronto", country: "Canada", tz: "America/Toronto" },
    { name: "Hong Kong", country: "China", tz: "Asia/Hong_Kong" },
    { name: "Seoul", country: "South Korea", tz: "Asia/Seoul" },
    { name: "Moscow", country: "Russia", tz: "Europe/Moscow" },
    { name: "Istanbul", country: "Turkey", tz: "Europe/Istanbul" }
  ];
  function setupCombo(inputId, listId, onSelect) {
    const input = el(inputId);
    const list = el(listId);
    let filtered = cities;
    let highlight = 0;
    const render = () => {
      list.innerHTML = filtered.map((c, i) => `<div class="mch-combo-item ${i === highlight ? "highlight" : ""}" data-idx="${i}">
          ${c.name} <small>${c.country}</small>
        </div>`).join("");
    };
    const filter = () => {
      const q = input.value.toLowerCase().trim();
      filtered = q ? cities.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)) : cities;
      highlight = 0;
      render();
    };
    input.onfocus = () => {
      filter();
      list.classList.add("open");
    };
    input.oninput = () => {
      filter();
      list.classList.add("open");
    };
    input.onblur = () => setTimeout(() => list.classList.remove("open"), 200);
    list.onmousedown = (e) => {
      const target = e.target;
      const item = target.closest(".mch-combo-item");
      if (item) onSelect(filtered[+item.dataset.idx]);
    };
  }
  let wcSource = cities[0];
  const wcTargets = [cities[1], cities[2], cities[3]];
  setupCombo("wc-src-input", "wc-src-list", (c) => {
    wcSource = c;
    el("wc-src-input").value = `${c.name}, ${c.country}`;
    calculate();
  });
  setupCombo("wc-add-input", "wc-add-list", (c) => {
    if (!wcTargets.find((t) => t.tz === c.tz && t.name === c.name)) wcTargets.push(c);
    el("wc-add-input").value = "";
    calculate();
  });
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const wcDateInput = el("wc-date");
  const wcSrcInput = el("wc-src-input");
  const wcTimeInput = el("wc-time");
  if (wcDateInput) wcDateInput.value = today;
  if (wcSrcInput) wcSrcInput.value = `${wcSource.name}, ${wcSource.country}`;
  function getOffsetMinutes(date, tz) {
    const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const local = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return (local.getTime() - utc.getTime()) / 6e4;
  }
  function calculate() {
    const dateStr = wcDateInput.value;
    const timeStr = wcTimeInput.value;
    if (!dateStr || !timeStr) {
      window.Shell.toast("Please select both date and time.", "warn");
      return;
    }
    if (!wcSource) {
      window.Shell.toast("Please select a source city.", "warn");
      return;
    }
    const [y, mo, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const utcGuess = new Date(Date.UTC(y, mo - 1, d, hh, mm));
    const srcOffset = getOffsetMinutes(utcGuess, wcSource.tz);
    const sourceUTC = new Date(utcGuess.getTime() - srcOffset * 6e4);
    const wrap = el("wc-targets");
    if (!wrap) return;
    wrap.innerHTML = "";
    wcTargets.forEach((t, idx) => {
      const timeFmt = sourceUTC.toLocaleTimeString("en-US", { timeZone: t.tz, hour: "2-digit", minute: "2-digit", hour12: true });
      const dateFmt = sourceUTC.toLocaleDateString("en-US", { timeZone: t.tz, weekday: "short", month: "short", day: "numeric" });
      wrap.insertAdjacentHTML("beforeend", `
        <div class="clock-card">
          <div>
            <div style="font-weight:700;">${window.Utils.escHtml(t.name)}</div>
            <div style="font-size:0.75rem; color:var(--text-3);">${window.Utils.escHtml(t.country)}</div>
          </div>
          <div style="text-align:right;">
            <div class="clock-time">${window.Utils.escHtml(timeFmt)}</div>
            <div class="clock-date">${window.Utils.escHtml(dateFmt)}</div>
          </div>
          <button class="fmt-btn" style="padding:4px 8px; margin-left:12px;" onclick="window.removeTarget(${idx})">&times;</button>
        </div>
      `);
    });
  }
  window.removeTarget = (idx) => {
    wcTargets.splice(idx, 1);
    calculate();
  };
  if (wcDateInput) wcDateInput.onchange = calculate;
  if (wcTimeInput) wcTimeInput.oninput = calculate;
  calculate();
})();
