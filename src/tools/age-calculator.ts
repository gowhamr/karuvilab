/* ===== age-calculator.ts – Exact Age Calculation logic ===== */

(function () {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLElement;
  const fmt = (n: number, d = 0) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  
  const metric = (label: string, value: string, cls = '') => `
    <div class="result-card" style="margin-bottom:12px">
      <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; font-weight:700;">${label}</div>
      <div style="font-size:1.5rem; font-weight:800; color:${cls === 'accent' ? 'var(--blue)' : 'var(--text)'}">${value}</div>
    </div>`;

  function calculate() {
    const dobVal = (el('age-dob') as HTMLInputElement).value;
    const asofVal = (el('age-as') as HTMLInputElement).value;
    
    if (!dobVal || !asofVal) {
      // @ts-ignore - Shell is a global
      if (window.Shell) window.Shell.toast('Please select both dates.', 'warn');
      return;
    }

    const dob = new Date(dobVal);
    const asof = new Date(asofVal);
    
    if (isNaN(dob.getTime()) || isNaN(asof.getTime())) {
      // @ts-ignore
      if (window.Shell) window.Shell.toast('Please enter valid dates.', 'error');
      return;
    }
    if (dob > asof) {
      // @ts-ignore
      if (window.Shell) window.Shell.toast('Date of birth cannot be in the future.', 'warn');
      return;
    }
    
    let years = asof.getFullYear() - dob.getFullYear();
    let months = asof.getMonth() - dob.getMonth();
    let days = asof.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prev = new Date(asof.getFullYear(), asof.getMonth(), 0);
      days += prev.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((asof.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    
    const res = el('age-result');
    if (res) {
      res.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
          ${metric('Exact Age', `${years} yr ${months} mo ${days} d`, 'accent')}
          ${metric('Total Months', fmt(totalMonths))}
          ${metric('Total Days', fmt(totalDays))}
          ${metric('Total Weeks', fmt(totalDays / 7, 1))}
        </div>`;
      res.style.display = 'block';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const asOfInput = el('age-as') as HTMLInputElement;
      const dobInput = el('age-dob') as HTMLInputElement;
      
      if (asOfInput) asOfInput.value = today;
      if (dobInput) dobInput.value = '1995-01-01';

      const calcBtn = el('calc-btn');
      if (calcBtn) {
        calcBtn.onclick = calculate;
      }
    } catch (e) {
      console.error('Age Calculator Error:', e);
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
