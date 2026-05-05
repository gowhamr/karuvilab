/* ===== safe-to-spend.ts – Daily budget calculator ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  
  const inBalance = el('in-balance') as HTMLInputElement;
  const inDays = el('in-days') as HTMLInputElement;
  const inSavings = el('in-savings') as HTMLInputElement;
  const container = el('bills-container') as HTMLDivElement;
  const addBtn = el('add-bill') as HTMLButtonElement;
  
  const outTotal = el('safe-total') as HTMLElement;
  const outRemark = el('safe-remark') as HTMLElement;

  function calculate() {
    const balance = parseFloat(inBalance.value) || 0;
    const days = parseInt(inDays.value) || 1;
    const savings = parseFloat(inSavings.value) || 0;
    
    let totalBills = 0;
    const billVals = Array.from(document.querySelectorAll('.bill-val')) as HTMLInputElement[];
    billVals.forEach(inp => {
      totalBills += parseFloat(inp.value) || 0;
    });

    const safeToSpend = (balance - totalBills - savings) / days;
    
    if (safeToSpend < 0) {
      outTotal.textContent = `$${safeToSpend.toFixed(2)}`;
      outTotal.style.color = 'var(--error)';
      outRemark.textContent = 'Warning: You are over budget!';
      outRemark.style.color = 'var(--error)';
    } else {
      outTotal.textContent = `$${safeToSpend.toFixed(2)}`;
      outTotal.style.color = 'var(--blue)';
      outRemark.textContent = `You can spend this amount daily for the next ${days} days.`;
      outRemark.style.color = 'var(--text-3)';
    }
  }

  function addBill() {
    const row = document.createElement('div');
    row.className = 'budget-row';
    row.innerHTML = `
      <input type="text" class="workspace-input bill-name" placeholder="e.g. Netflix" style="flex:2">
      <input type="number" class="workspace-input bill-val" placeholder="0.00" style="flex:1">
      <button class="btn btn-sm btn-outline remove-row">×</button>
    `;
    container.appendChild(row);
    
    row.querySelector('.remove-row')?.addEventListener('click', () => {
      row.remove();
      calculate();
    });
    
    row.querySelector('.bill-val')?.addEventListener('input', calculate);
  }

  addBtn.addEventListener('click', addBill);
  
  [inBalance, inDays, inSavings].forEach(node => {
    node.addEventListener('input', calculate);
  });

  // Initial row listeners
  document.querySelector('.bill-val')?.addEventListener('input', calculate);
  document.querySelector('.remove-row')?.addEventListener('click', (e) => {
    (e.target as HTMLElement).closest('.budget-row')?.remove();
    calculate();
  });

  calculate();
});
