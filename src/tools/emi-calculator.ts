/* ===== emi-calculator.ts – Loan EMI Calculation logic ===== */

(function () {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLElement;
  const fmt = (n: number, d = 0) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const inr = (n: number, d = 0) => '₹' + fmt(n, d);

  const sliders = ['amt', 'rate', 'years'];

  function calculate() {
    const P = +(el('in-amt') as HTMLInputElement).value;
    const annualRate = +(el('in-rate') as HTMLInputElement).value;
    const years = +(el('in-years') as HTMLInputElement).value;
    const n = years * 12;

    const statusBox = el('status-box');
    const btnCopy = el('btn-copy') as HTMLButtonElement;
    const btnTable = el('btn-toggle-table') as HTMLButtonElement;

    // CALC-EMI-003: Allow 0% interest (interest-free / zero-cost EMI is a real
    // scenario). Reject only negative rates or invalid amount/tenure. The math
    // branch below handles r === 0 with a Principal / Tenure division.
    if (annualRate < 0 || !isFinite(annualRate) || P <= 0 || n <= 0) {
      statusBox.textContent = annualRate < 0
        ? 'Interest rate cannot be negative.'
        : 'Please enter a valid amount and tenure.';
      statusBox.style.display = 'block';
      statusBox.style.background = '#fee2e2';
      statusBox.style.color = '#b91c1c';
      if (btnCopy) btnCopy.disabled = true;
      if (btnTable) btnTable.disabled = true;
      el('out-emi').textContent = '₹0.00';
      el('out-principal').textContent = '₹0.00';
      el('out-interest').textContent = '₹0.00';
      el('out-total').textContent = '₹0.00';
      el('out-interest-ratio').textContent = '0%';
      const tbody = el('res-table')?.querySelector('tbody');
      if (tbody) tbody.innerHTML = '';
      return;
    } else {
      statusBox.style.display = 'none';
      if (btnCopy) btnCopy.disabled = false;
      if (btnTable) btnTable.disabled = false;
    }

    const r = annualRate / 12 / 100;

    // UI Updates
    el('val-amt').textContent = inr(P);
    el('val-rate').textContent = annualRate + '%';
    el('val-years').textContent = years + 'Y';

    // A11y Updates
    el('in-amt').setAttribute('aria-valuenow', String(P));
    el('in-rate').setAttribute('aria-valuenow', String(annualRate));
    el('in-years').setAttribute('aria-valuenow', String(years));

    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    // Avoid NaN/Infinity
    if (!isFinite(emi) || isNaN(emi)) emi = 0;

    const totalPayable = emi * n;
    const totalInterest = Math.max(0, totalPayable - P);
    const interestRatio = totalPayable > 0 ? totalInterest / totalPayable : 0;

    // Update Text - CALC-001: Fix precision loss by using 2 decimals
    el('out-emi').textContent = inr(emi, 2);
    el('out-principal').textContent = inr(P, 2);
    el('out-interest').textContent = inr(totalInterest, 2);
    el('out-total').textContent = inr(totalPayable, 2);
    el('out-interest-ratio').textContent = Math.round(interestRatio * 100) + '%';

    // Update Donut
    const circumference = 2 * Math.PI * 40;
    const pSeg = el('donut-principal');
    const iSeg = el('donut-interest');
    
    if (pSeg && iSeg) {
      const pRatio = P / totalPayable;
      pSeg.style.strokeDasharray = `${circumference * pRatio} ${circumference}`;
      pSeg.style.strokeDashoffset = '0';
      
      iSeg.style.strokeDasharray = `${circumference * (1 - pRatio)} ${circumference}`;
      iSeg.style.strokeDashoffset = String(-(circumference * pRatio));
    }

    // Yearly Schedule
    const tbody = el('res-table')?.querySelector('tbody');
    if (tbody) {
      let balance = P;
      const yearlyData = [];
      
      for (let y = 1; y <= years; y++) {
        let yInterest = 0;
        let yPrincipal = 0;
        for (let m = 1; m <= 12; m++) {
          const interest = balance * r;
          const principal = emi - interest;
          yInterest += interest;
          yPrincipal += principal;
          balance -= principal;
        }
        yearlyData.push(`
          <tr>
            <td>Year ${y}</td>
            <td>${inr(yPrincipal, 2)}</td>
            <td style="color:var(--warn)">${inr(yInterest, 2)}</td>
            <td style="font-weight:700">${inr(Math.max(0, balance), 2)}</td>
          </tr>
        `);
      }
      tbody.innerHTML = yearlyData.join('');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      sliders.forEach(id => {
        el('in-' + id).addEventListener('input', calculate);
      });

      const toggleBtn = el('btn-toggle-table');
      if (toggleBtn) {
        toggleBtn.onclick = () => {
          el('table-scroll')?.classList.toggle('open');
        };
      }

      const copyBtn = el('btn-copy');
      if (copyBtn) {
        copyBtn.onclick = () => {
          const text = `Loan EMI Details\n------------------\nPrincipal: ${inr(+(el('in-amt') as HTMLInputElement).value)}\nRate: ${(el('in-rate') as HTMLInputElement).value}%\nTenure: ${(el('in-years') as HTMLInputElement).value} Years\n\nMonthly EMI: ${el('out-emi').textContent}\nTotal Interest: ${el('out-interest').textContent}\nTotal Payable: ${el('out-total').textContent}\n\nGenerated via KaruviLab`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            const status = el('status-box');
            if (status) {
              status.textContent = 'Details copied to clipboard!';
              status.style.display = 'block';
              setTimeout(() => { status.style.display = 'none'; }, 3000);
            }
          }
        };
      }

      calculate();
    } catch (e) {
      console.error('EMI Calculator Error:', e);
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
