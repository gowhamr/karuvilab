(function() {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLDivElement;
  const fmt = (n: number, d = 2) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const metric = (label: string, value: string, cls='') => `
    <div class="result-card" style="margin-bottom:12px">
      <div style="font-size:0.75rem; color:var(--text-3); text-transform:uppercase; font-weight:700;">${label}</div>
      <div style="font-size:1.5rem; font-weight:800; color:${cls==='accent'?'var(--blue)':'var(--text)'}">${value}</div>
    </div>`;

  const dateStartInput = el('date-start') as HTMLInputElement;
  const dateEndInput = el('date-end') as HTMLInputElement;
  const dateBaseInput = el('date-base') as HTMLInputElement;
  const dateDaysInput = el('date-days') as HTMLInputElement;
  const calcBtn = el('calc-btn') as HTMLButtonElement;
  const resArea = el('date-result') as HTMLDivElement;

  const today = new Date().toISOString().split('T')[0];
  if (dateStartInput) dateStartInput.value = today;
  if (dateEndInput) dateEndInput.value = today;
  if (dateBaseInput) dateBaseInput.value = today;

  let dateMode = 'diff';
  const btns = document.querySelectorAll('#date-toggle button') as NodeListOf<HTMLButtonElement>;
  btns.forEach(b => {
    b.onclick = () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      dateMode = b.dataset.mode || 'diff';
      const diffFields = el('date-diff-fields');
      const addFields = el('date-add-fields');
      if (diffFields) diffFields.style.display = dateMode === 'diff' ? 'grid' : 'none';
      if (addFields) addFields.style.display = dateMode === 'add' ? 'grid' : 'none';
    };
  });

  if (calcBtn) {
    calcBtn.onclick = () => {
      if (dateMode === 'diff') {
        const sVal = dateStartInput.value;
        const eVal = dateEndInput.value;
        if (!sVal || !eVal) {
          window.Shell.toast('Please select both start and end dates.', 'warn');
          return;
        }
        const a = new Date(sVal);
        const b = new Date(eVal);
        if (isNaN(a.getTime()) || isNaN(b.getTime())) {
          window.Shell.toast('Invalid date format.', 'error');
          return;
        }
        const days = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
        const abs = Math.abs(days);
        resArea.innerHTML = `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:12px;">
            ${metric('Total Days', fmt(days, 0), 'accent')}
            ${metric('Weeks', fmt(abs / 7, 1))}
            ${metric('Months', fmt(abs / 30.44, 1))}
            ${metric('Years', fmt(abs / 365.25, 1))}
          </div>`;
      } else {
        const bVal = dateBaseInput.value;
        const dVal = dateDaysInput.value;
        if (!bVal || dVal === '') {
          window.Shell.toast('Please enter start date and days.', 'warn');
          return;
        }
        const base = new Date(bVal);
        const d = +dVal;
        if (isNaN(base.getTime())) {
          window.Shell.toast('Invalid start date.', 'error');
          return;
        }
        const result = new Date(base.getTime() + d * 86400000);
        const opts: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        resArea.innerHTML = `
          <div style="display:grid; grid-template-columns: 1fr; gap:12px;">
            ${metric('Result Date', result.toLocaleDateString('en-US', opts), 'accent')}
          </div>`;
      }
      resArea.style.display = 'block';
    };
  }
})();
