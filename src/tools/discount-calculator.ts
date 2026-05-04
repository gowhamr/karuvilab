/* ===== discount-calculator.ts – Discount Calculation logic ===== */

(function () {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLElement;
  const fmt = (n: number, d = 2) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const inr = (n: number) => '₹' + fmt(n, 0);
  
  const metric = (label: string, value: string, cls = '') => `
    <div class="result-card" style="margin-bottom:12px">
      <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; font-weight:700;">${label}</div>
      <div style="font-size:1.5rem; font-weight:800; color:${cls === 'accent' ? 'var(--blue)' : 'var(--text)'}">${value}</div>
    </div>`;

  function calculate() {
    const pVal = (el('disc-p') as HTMLInputElement).value;
    const rVal = (el('disc-r') as HTMLInputElement).value;
    
    if (!pVal || isNaN(+pVal) || +pVal <= 0) {
      // @ts-ignore
      if (window.Shell) window.Shell.toast('Please enter a valid original price.', 'warn');
      (el('disc-p') as HTMLInputElement).focus();
      return;
    }
    if (!rVal || isNaN(+rVal) || +rVal < 0 || +rVal > 100) {
      // @ts-ignore
      if (window.Shell) window.Shell.toast('Please enter a discount between 0 and 100.', 'warn');
      (el('disc-r') as HTMLInputElement).focus();
      return;
    }

    const p = +pVal;
    const r = +rVal;
    
    const saved = (p * r) / 100;
    const final = p - saved;
    
    const res = el('disc-result');
    if (res) {
      res.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
          ${metric('Original Price', inr(p))}
          ${metric('You Save', inr(saved), 'accent')}
          ${metric('Final Price', inr(final), 'accent')}
        </div>`;
      res.style.display = 'block';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const calcBtn = el('calc-btn');
      if (calcBtn) {
        calcBtn.onclick = calculate;
      }
    } catch (e) {
      console.error('Discount Calculator Error:', e);
      const s = document.querySelector('.panel-scroll');
      if (s && !s.querySelector('.calc-error')) {
        const d = document.createElement('div');
        d.className = 'calc-error';
        d.style.cssText = 'padding:16px;margin:16px;background:#fee2e2;border-radius:8px;color:#b91c1c;text-align:center;font-weight:600';
        d.textContent = 'Calculator failed to load. Please refresh.';
        s.prepend(d);
      }
    }
  });
})();
