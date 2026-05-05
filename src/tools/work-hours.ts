/* ===== work-hours.ts – Timesheet calculator ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const container = el('timesheet-container') as HTMLDivElement;
  const addBtn = el('add-day') as HTMLButtonElement;
  const rateIn = el('hourly-rate') as HTMLInputElement;
  
  const outHours = el('total-hours') as HTMLElement;
  const outDecimal = el('total-decimal') as HTMLElement;
  const outPay = el('total-pay') as HTMLElement;
  const payDisplay = el('pay-display') as HTMLDivElement;

  function calculate() {
    let totalMinutes = 0;
    const rows = container.querySelectorAll('.time-row');
    
    rows.forEach(row => {
      const start = (row.querySelector('.start-time') as HTMLInputElement).value;
      const end = (row.querySelector('.end-time') as HTMLInputElement).value;
      const breakMin = parseInt((row.querySelector('.break-time') as HTMLInputElement).value) || 0;
      
      if (start && end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        
        let diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff < 0) diff += 24 * 60; // Overnight shift
        
        totalMinutes += Math.max(0, diff - breakMin);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const decimal = totalMinutes / 60;

    outHours.textContent = `${hours}h ${mins}m`;
    outDecimal.textContent = decimal.toFixed(2);

    const rate = parseFloat(rateIn.value) || 0;
    if (rate > 0) {
      payDisplay.style.display = 'block';
      outPay.textContent = `$${(decimal * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      payDisplay.style.display = 'none';
    }
  }

  function addDay() {
    const row = document.createElement('div');
    row.className = 'time-row';
    row.innerHTML = `
      <div><input type="time" class="workspace-input start-time" value="09:00"></div>
      <div><input type="time" class="workspace-input end-time" value="17:00"></div>
      <div><input type="number" class="workspace-input break-time" placeholder="30" value="0"></div>
      <button class="btn btn-sm btn-outline remove-row">×</button>
    `;
    container.appendChild(row);
    
    row.querySelectorAll('input').forEach(inp => inp.addEventListener('input', calculate));
    row.querySelector('.remove-row')?.addEventListener('click', () => {
      row.remove();
      calculate();
    });
    calculate();
  }

  addBtn.addEventListener('click', addDay);
  rateIn.addEventListener('input', calculate);

  // Initial row listeners
  container.querySelectorAll('input').forEach(inp => inp.addEventListener('input', calculate));
  container.querySelector('.remove-row')?.addEventListener('click', (e) => {
    (e.target as HTMLElement).closest('.time-row')?.remove();
    calculate();
  });

  calculate();
});
