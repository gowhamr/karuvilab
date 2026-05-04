(function() {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLDivElement;
  const fmt = (n: number, d = 0) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const metric = (label: string, value: string, cls='') => `
    <div class="result-card" style="margin-bottom:12px">
      <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; font-weight:700;">${label}</div>
      <div style="font-size:1.5rem; font-weight:800; color:${cls==='accent'?'var(--blue)':'var(--text)'}">${value}</div>
    </div>`;

  let timeMode = 'add';
  const btns = document.querySelectorAll('#time-toggle button') as NodeListOf<HTMLButtonElement>;
  btns.forEach(b => {
    b.onclick = () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      timeMode = b.dataset.mode || 'add';
    };
  });

  const calcBtn = el('calc-btn') as HTMLButtonElement;
  if (calcBtn) {
    calcBtn.onclick = () => {
      const h1 = +(el('t1-h') as HTMLInputElement).value || 0;
      const m1 = +(el('t1-m') as HTMLInputElement).value || 0;
      const s1 = +(el('t1-s') as HTMLInputElement).value || 0;
      const h2 = +(el('t2-h') as HTMLInputElement).value || 0;
      const m2 = +(el('t2-m') as HTMLInputElement).value || 0;
      const s2 = +(el('t2-s') as HTMLInputElement).value || 0;

      const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
      const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;
      
      let total = timeMode === 'add' ? totalSeconds1 + totalSeconds2 : totalSeconds1 - totalSeconds2;
      const neg = total < 0;
      total = Math.abs(total);
      
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      
      const res = el('time-result') as HTMLDivElement;
      if (res) {
        res.innerHTML = `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
            ${metric('Result', (neg ? '− ' : '') + `${h}h ${m}m ${s}s`, 'accent')}
            ${metric('In Minutes', fmt(total / 60, 2))}
            ${metric('In Seconds', fmt(total, 0))}
          </div>`;
        res.style.display = 'block';
      }
    };
  }
})();
