(function() {
  const el = (id) => document.getElementById(id);
  const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD", "AED", "HKD", "NZD", "ZAR", "BRL", "MXN", "KRW", "THB", "MYR", "SEK", "NOK", "DKK", "RUB", "TRY", "IDR", "PHP", "VND", "SAR", "QAR", "KWD"];
  const MCH_CACHE_KEY = "mch_fx_cache_v1";
  const MCH_CACHE_TTL_MS = 60 * 60 * 1e3;
  const MCH_STALE_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
  function mchReadCache() {
    try {
      const r = localStorage.getItem(MCH_CACHE_KEY);
      return r ? JSON.parse(r) : {};
    } catch (e) {
      return {};
    }
  }
  function mchWriteCache(c) {
    try {
      localStorage.setItem(MCH_CACHE_KEY, JSON.stringify(c));
    } catch (e) {
    }
  }
  function mchGetCached(base) {
    const c = mchReadCache();
    const e = c[base];
    if (!e) return null;
    const age = Date.now() - e.fetchedAt;
    if (age < MCH_CACHE_TTL_MS) return { ...e, freshness: "fresh", ageMs: age };
    if (age < MCH_STALE_TTL_MS) return { ...e, freshness: "stale", ageMs: age };
    return null;
  }
  async function mchFetchRates(base) {
    try {
      const r = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const d = await r.json();
      if (d && d.rates && d.result === "success") return { rates: d.rates, source: "exchangerate-api.com", updated: d.time_last_update_utc };
    } catch (e) {
    }
    try {
      const r = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
      const d = await r.json();
      if (d && d.rates) return { rates: { ...d.rates, [base]: 1 }, source: "frankfurter.app (ECB)", updated: d.date };
    } catch (e) {
    }
    return null;
  }
  function render(amt, rate, meta) {
    const res = el("cur-result");
    if (!res) return;
    const converted = amt * rate;
    const fromCur = el("cur-from").value;
    const toCur = el("cur-to").value;
    const esc = (s) => window.Utils ? window.Utils.escHtml(s) : s;
    res.innerHTML = `
      <div class="result-card">
        <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; font-weight:700;">Converted Amount</div>
        <div style="font-size:1.8rem; font-weight:800; color:var(--blue)">${converted.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${esc(toCur)}</div>
        <div style="font-size:0.8rem; color:var(--text-3); margin-top:8px;">1 ${esc(fromCur)} = ${rate.toFixed(4)} ${esc(toCur)}</div>
        <div style="font-size:0.7rem; color:var(--text-3); margin-top:12px; border-top:1px solid var(--border); padding-top:8px;">
          Source: ${esc(meta.source)} (${esc(meta.freshness)})
        </div>
      </div>`;
  }
  async function convert() {
    const amt = +el("cur-amt").value;
    const from = el("cur-from").value;
    const to = el("cur-to").value;
    const res = el("cur-result");
    if (!res) return;
    res.innerHTML = "Converting...";
    res.style.display = "block";
    if (from === to) {
      render(amt, 1, { freshness: "fresh", source: "identity" });
      return;
    }
    let data = mchGetCached(from);
    if (!data || data.freshness !== "fresh" || !data.rates[to]) {
      const fresh = await mchFetchRates(from);
      if (fresh) {
        const cache = mchReadCache();
        cache[from] = { rates: fresh.rates, source: fresh.source, fetchedAt: Date.now(), updated: fresh.updated };
        mchWriteCache(cache);
        data = { ...cache[from], freshness: "fresh" };
      }
    }
    if (data && data.rates[to]) {
      render(amt, data.rates[to], data);
    } else {
      res.innerHTML = "Failed to fetch exchange rates. Please try again later.";
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    try {
      const curFrom = el("cur-from");
      const curTo = el("cur-to");
      if (curFrom && curTo) {
        currencies.forEach((c) => {
          curFrom.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`);
          curTo.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`);
        });
        curFrom.value = "USD";
        curTo.value = "INR";
      }
      const swapBtn = el("swap-btn");
      if (swapBtn) {
        swapBtn.onclick = () => {
          const f = curFrom.value;
          curFrom.value = curTo.value;
          curTo.value = f;
        };
      }
      const calcBtn = el("calc-btn");
      if (calcBtn) {
        calcBtn.onclick = convert;
      }
    } catch (e) {
      console.error("Currency Converter Error:", e);
      const s = document.querySelector(".panel-scroll");
      if (s && !s.querySelector(".calc-error")) {
        const d = document.createElement("div");
        d.className = "calc-error";
        d.style.cssText = "padding:16px;margin:16px;background:#fee2e2;border-radius:8px;color:#b91c1c;text-align:center;font-weight:600";
        d.textContent = "Calculator failed to load. Please refresh.";
        s.prepend(d);
      }
    }
  });
})();
