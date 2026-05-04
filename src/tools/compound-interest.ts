/* ===== compound-interest.ts – Compound Interest logic ===== */

(function () {
  const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLElement;
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
  const inr = (n: number) => '₹' + fmt(n);

  const sliders = ['p', 'r', 't'];
  let donutChart: any;
  let growthChart: any;

  function updateCharts(principal: number, interest: number, labels: string[], dataPoints: number[]) {
    // Donut Chart
    const dCanvas = el('ci-donut-chart') as HTMLCanvasElement;
    if (dCanvas) {
      const dCtx = dCanvas.getContext('2d');
      if (dCtx) {
        if (donutChart) {
          donutChart.data.datasets[0].data = [principal, interest];
          donutChart.update();
        } else {
          // @ts-ignore
          donutChart = new Chart(dCtx, {
            type: 'doughnut',
            data: {
              labels: ['Principal', 'Interest'],
              datasets: [{
                data: [principal, interest],
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
                  callbacks: {
                    label: (context: any) => context.label + ': ' + inr(context.raw)
                  }
                }
              },
              maintainAspectRatio: false
            }
          });
        }
      }
    }

    // Growth Chart
    const gCanvas = el('ci-growth-chart') as HTMLCanvasElement;
    if (gCanvas) {
      const gCtx = gCanvas.getContext('2d');
      if (gCtx) {
        if (growthChart) {
          growthChart.data.labels = labels;
          growthChart.data.datasets[0].data = dataPoints;
          growthChart.update();
        } else {
          // @ts-ignore
          growthChart = new Chart(gCtx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Total Balance',
                data: dataPoints,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4F46E5'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context: any) => 'Balance: ' + inr(context.raw)
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: { color: 'rgba(0,0,0,0.05)' },
                  ticks: {
                    callback: (val: any) => '₹' + (val >= 100000 ? (val / 100000).toFixed(1) + 'L' : (val / 1000).toFixed(0) + 'K')
                  }
                },
                x: { grid: { display: false } }
              }
            }
          });
        }
      }
    }
  }

  function calculate() {
    const P = +(el('in-p') as HTMLInputElement).value;
    const R = +(el('in-r') as HTMLInputElement).value / 100;
    const T = +(el('in-t') as HTMLInputElement).value;
    const n = +(el('in-n') as HTMLSelectElement).value;

    // UI Updates
    el('val-p').textContent = inr(P);
    el('val-r').textContent = (el('in-r') as HTMLInputElement).value + '%';
    el('val-t').textContent = T + 'Y';

    // A11y Updates
    el('in-p').setAttribute('aria-valuenow', String(P));
    el('in-r').setAttribute('aria-valuenow', (el('in-r') as HTMLInputElement).value);
    el('in-t').setAttribute('aria-valuenow', String(T));

    const A = P * Math.pow(1 + R / n, n * T);
    const totalInterest = A - P;
    const effectiveAPR = (Math.pow(1 + R / n, n) - 1) * 100;

    // Update Text
    el('out-total').textContent = inr(A);
    el('out-p').textContent = inr(P);
    el('out-i').textContent = inr(totalInterest);
    el('out-apr').textContent = effectiveAPR.toFixed(2) + '%';
    el('out-yield').textContent = Math.round((totalInterest / P) * 100) + '%';

    // Update Table & Chart Data
    const tbody = el('res-table')?.querySelector('tbody');
    const labels = ['Year 0'];
    const dataPoints = [P];
    const tableRows = [];
    let runningBalance = P;
    let cumulativeInterest = 0;

    for (let y = 1; y <= T; y++) {
      const startBalance = runningBalance;
      runningBalance = P * Math.pow(1 + R / n, n * y);
      const yearlyInterest = runningBalance - startBalance;
      cumulativeInterest += yearlyInterest;

      labels.push('Year ' + y);
      dataPoints.push(runningBalance);

      tableRows.push(`
        <tr>
          <td>Year ${y}</td>
          <td style="color:#10b981">+${inr(yearlyInterest)}</td>
          <td>${inr(cumulativeInterest)}</td>
          <td style="font-weight:700">${inr(runningBalance)}</td>
        </tr>
      `);
    }
    if (tbody) tbody.innerHTML = tableRows.join('');
    updateCharts(P, totalInterest, labels, dataPoints);
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      sliders.forEach(id => {
        el('in-' + id).addEventListener('input', calculate);
      });
      el('in-n').addEventListener('change', calculate);

      const btnToggle = el('btn-toggle-table');
      if (btnToggle) {
        btnToggle.onclick = () => {
          el('table-scroll')?.classList.toggle('open');
        };
      }

      const btnCopy = el('btn-copy');
      if (btnCopy) {
        btnCopy.onclick = () => {
          const pVal = (el('in-p') as HTMLInputElement).value;
          const rVal = (el('in-r') as HTMLInputElement).value;
          const tVal = (el('in-t') as HTMLInputElement).value;
          const interest = el('out-i').textContent;
          const total = el('out-total').textContent;

          const text = `Compound Interest Summary\n------------------\nPrincipal: ${inr(+pVal)}\nRate: ${rVal}%\nPeriod: ${tVal} Years\n\nInterest Earned: ${interest}\nMaturity Value: ${total}\n\nGenerated via KaruviLab`;
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
      console.error('Compound Interest Error:', e);
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
