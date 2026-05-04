/* ===== gst-calculator.ts – GST Calculation logic ===== */

(function () {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLElement;
  const fmt = (n: number, d = 2) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const inr = (n: number) => '₹' + fmt(n, 0);
  
  const metric = (label: string, value: string, cls = '') => `
    <div class="result-card" style="margin-bottom:12px">
      <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; font-weight:700;">${label}</div>
      <div style="font-size:1.5rem; font-weight:800; color:${cls === 'accent' ? 'var(--blue)' : 'var(--text)'}">${value}</div>
    </div>`;

  let gstMode = 'add';

  function calculate() {
    const amtVal = (el('gst-amt') as HTMLInputElement).value;
    if (!amtVal || isNaN(+amtVal)) {
      // @ts-ignore
      if (window.Shell) window.Shell.toast('Please enter a valid amount.', 'warn');
      (el('gst-amt') as HTMLInputElement).focus();
      return;
    }
    const amt = +amtVal;
    if (amt < 0) {
      // @ts-ignore
      if (window.Shell) window.Shell.toast('Amount cannot be negative.', 'warn');
      return;
    }
    const rate = +(el('gst-rate') as HTMLSelectElement).value;
    let base, gst, total;
    if (gstMode === 'add') {
      base = amt;
      gst = (amt * rate) / 100;
      total = base + gst;
    } else {
      total = amt;
      base = amt / (1 + rate / 100);
      gst = total - base;
    }

    const res = el('gst-result');
    if (res) {
      res.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
          ${metric('Base Amount', inr(base))}
          ${metric('GST (' + rate + '%)', inr(gst), 'accent')}
          ${metric('Total', inr(total), 'accent')}
        </div>`;
      res.style.display = 'block';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const btns = document.querySelectorAll('#gst-toggle button');
      btns.forEach(b => {
        (b as HTMLButtonElement).onclick = () => {
          btns.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          gstMode = (b as HTMLElement).dataset.mode || 'add';
        };
      });

      const calcBtn = el('calc-btn');
      if (calcBtn) {
        calcBtn.onclick = calculate;
      }
    } catch (e) {
      console.error('GST Calculator Error:', e);
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
