/* ===== sip-calculator.ts – SIP Projection logic ===== */

(function () {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLElement;
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
  const inr = (n: number) => '₹' + fmt(n);

  const sliders = ['sip', 'rate', 'years', 'stepup'];
  let sipChart: any;

  function updateChart(invested: number, gains: number) {
    const canvas = el('sip-chart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (sipChart) {
      sipChart.data.datasets[0].data = [invested, gains];
      sipChart.update();
    } else {
      // @ts-ignore - Chart is a global from CDN
      sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Invested', 'Gains'],
          datasets: [{
            data: [invested, gains],
            backgroundColor: ['#6366f1', '#10b981'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          cutout: '80%',
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context: any) {
                  return context.label + ': ' + inr(context.raw);
                }
              }
            }
          },
          maintainAspectRatio: false,
          animation: { duration: 800, easing: 'easeOutQuart' }
        }
      });
    }
  }

  function calculate() {
    let monthlySipBase = +(el('in-sip') as HTMLInputElement).value;
    let annualRate = +(el('in-rate') as HTMLInputElement).value / 100;
    let years = +(el('in-years') as HTMLInputElement).value;
    const stepUpPct = +(el('in-stepup') as HTMLInputElement).value / 100;
    let initialLumpsum = +(el('in-lumpsum') as HTMLInputElement).value || 0;
    
    // Validation and Limits
    if (monthlySipBase < 0) monthlySipBase = 0;
    if (monthlySipBase > 1000000) monthlySipBase = 1000000;
    if (annualRate < 0) annualRate = 0;
    if (annualRate > 1) annualRate = 1; 
    if (years < 1) years = 1;
    if (years > 50) years = 50;
    if (initialLumpsum < 0) initialLumpsum = 0;
    if (initialLumpsum > 100000000) initialLumpsum = 100000000; 

    const monthlyRate = annualRate / 12;
    const inflationRate = 0.06;

    // UI Updates
    el('val-sip').textContent = inr(monthlySipBase);
    el('val-rate').textContent = (annualRate * 100).toFixed(1) + '%';
    el('val-years').textContent = years + 'Y';
    el('val-stepup').textContent = (el('in-stepup') as HTMLInputElement).value + '%';

    // A11y Updates
    el('in-sip').setAttribute('aria-valuenow', String(monthlySipBase));
    el('in-rate').setAttribute('aria-valuenow', (el('in-rate') as HTMLInputElement).value);
    el('in-years').setAttribute('aria-valuenow', String(years));
    el('in-stepup').setAttribute('aria-valuenow', (el('in-stepup') as HTMLInputElement).value);

    let runningValue = initialLumpsum;
    let runningInvested = initialLumpsum;
    let currentSip = monthlySipBase;
    
    const yearlyData = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        runningValue = (runningValue + currentSip) * (1 + monthlyRate);
        runningInvested += currentSip;
      }
      
      yearlyData.push({
        year: y,
        invested: runningInvested,
        interest: runningValue - runningInvested,
        total: runningValue
      });
      
      currentSip *= (1 + stepUpPct);
    }

    const totalValue = runningValue;
    const totalInvested = runningInvested;
    const totalGains = totalValue - totalInvested;
    const yieldPct = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;
    const inflationAdjusted = totalValue / Math.pow(1 + inflationRate, years);

    // Update Text
    el('out-total').textContent = inr(totalValue);
    el('out-invested').textContent = inr(totalInvested);
    el('out-gains').textContent = inr(totalGains);
    el('out-inflation').textContent = inr(inflationAdjusted);
    el('out-yield').textContent = Math.round(yieldPct) + '%';

    // Update Chart
    updateChart(totalInvested, totalGains);

    // Update Table
    const tbody = el('res-table')?.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = yearlyData.map(d => `
        <tr>
          <td>Year ${d.year}</td>
          <td>${inr(d.invested)}</td>
          <td style="color:#10b981">+${inr(d.interest)}</td>
          <td style="font-weight:700">${inr(d.total)}</td>
        </tr>
      `).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      sliders.forEach(id => {
        el('in-' + id).addEventListener('input', calculate);
      });
      el('in-lumpsum').addEventListener('input', calculate);

      const btnToggle = el('btn-toggle-table');
      if (btnToggle) {
        btnToggle.onclick = () => {
          el('table-scroll')?.classList.toggle('open');
        };
      }

      const btnCopy = el('btn-copy');
      if (btnCopy) {
        btnCopy.onclick = () => {
          const sipVal = (el('in-sip') as HTMLInputElement).value;
          const yearsVal = (el('in-years') as HTMLInputElement).value;
          const rateVal = (el('in-rate') as HTMLInputElement).value;
          const invested = el('out-invested').textContent;
          const gains = el('out-gains').textContent;
          const total = el('out-total').textContent;

          const text = `SIP Investment Summary\n------------------\nMonthly: ${inr(+sipVal)}\nPeriod: ${yearsVal} Years\nRate: ${rateVal}%\n\nTotal Invested: ${invested}\nEst. Gains: ${gains}\nTotal Value: ${total}\n\nGenerated via KaruviLab`;
          
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            const status = el('status-box');
            if (status) {
              status.textContent = 'Summary copied to clipboard!';
              status.style.display = 'block';
              setTimeout(() => { status.style.display = 'none'; }, 3000);
            }
          }
        };
      }

      calculate();
    } catch (e) {
      console.error('SIP Calculator Error:', e);
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
