(function() {
  const el = (id) => document.getElementById(id);
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const inr = (n) => "\u20B9" + fmt(n);
  const sliders = ["p", "r", "t"];
  let donutChart;
  let growthChart;
  function updateCharts(principal, interest, labels, dataPoints) {
    const dCanvas = el("ci-donut-chart");
    if (dCanvas) {
      const dCtx = dCanvas.getContext("2d");
      if (dCtx) {
        if (donutChart) {
          donutChart.data.datasets[0].data = [principal, interest];
          donutChart.update();
        } else {
          donutChart = new Chart(dCtx, {
            type: "doughnut",
            data: {
              labels: ["Principal", "Interest"],
              datasets: [{
                data: [principal, interest],
                backgroundColor: ["#6366f1", "#10b981"],
                borderWidth: 0,
                hoverOffset: 4
              }]
            },
            options: {
              cutout: "80%",
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => context.label + ": " + inr(context.raw)
                  }
                }
              },
              maintainAspectRatio: false
            }
          });
        }
      }
    }
    const gCanvas = el("ci-growth-chart");
    if (gCanvas) {
      const gCtx = gCanvas.getContext("2d");
      if (gCtx) {
        if (growthChart) {
          growthChart.data.labels = labels;
          growthChart.data.datasets[0].data = dataPoints;
          growthChart.update();
        } else {
          growthChart = new Chart(gCtx, {
            type: "line",
            data: {
              labels,
              datasets: [{
                label: "Total Balance",
                data: dataPoints,
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79, 70, 229, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#4F46E5"
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => "Balance: " + inr(context.raw)
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: { color: "rgba(0,0,0,0.05)" },
                  ticks: {
                    callback: (val) => "\u20B9" + (val >= 1e5 ? (val / 1e5).toFixed(1) + "L" : (val / 1e3).toFixed(0) + "K")
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
    const P = +el("in-p").value;
    const R = +el("in-r").value / 100;
    const T = +el("in-t").value;
    const n = +el("in-n").value;
    el("val-p").textContent = inr(P);
    el("val-r").textContent = el("in-r").value + "%";
    el("val-t").textContent = T + "Y";
    el("in-p").setAttribute("aria-valuenow", String(P));
    el("in-r").setAttribute("aria-valuenow", el("in-r").value);
    el("in-t").setAttribute("aria-valuenow", String(T));
    const A = P * Math.pow(1 + R / n, n * T);
    const totalInterest = A - P;
    const effectiveAPR = (Math.pow(1 + R / n, n) - 1) * 100;
    el("out-total").textContent = inr(A);
    el("out-p").textContent = inr(P);
    el("out-i").textContent = inr(totalInterest);
    el("out-apr").textContent = effectiveAPR.toFixed(2) + "%";
    el("out-yield").textContent = Math.round(totalInterest / P * 100) + "%";
    const tbody = el("res-table")?.querySelector("tbody");
    const labels = ["Year 0"];
    const dataPoints = [P];
    const tableRows = [];
    let runningBalance = P;
    let cumulativeInterest = 0;
    for (let y = 1; y <= T; y++) {
      const startBalance = runningBalance;
      runningBalance = P * Math.pow(1 + R / n, n * y);
      const yearlyInterest = runningBalance - startBalance;
      cumulativeInterest += yearlyInterest;
      labels.push("Year " + y);
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
    if (tbody) tbody.innerHTML = tableRows.join("");
    updateCharts(P, totalInterest, labels, dataPoints);
  }
  document.addEventListener("DOMContentLoaded", () => {
    try {
      sliders.forEach((id) => {
        el("in-" + id).addEventListener("input", calculate);
      });
      el("in-n").addEventListener("change", calculate);
      const btnToggle = el("btn-toggle-table");
      if (btnToggle) {
        btnToggle.onclick = () => {
          el("table-scroll")?.classList.toggle("open");
        };
      }
      const btnCopy = el("btn-copy");
      if (btnCopy) {
        btnCopy.onclick = () => {
          const pVal = el("in-p").value;
          const rVal = el("in-r").value;
          const tVal = el("in-t").value;
          const interest = el("out-i").textContent;
          const total = el("out-total").textContent;
          const text = `Compound Interest Summary
------------------
Principal: ${inr(+pVal)}
Rate: ${rVal}%
Period: ${tVal} Years

Interest Earned: ${interest}
Maturity Value: ${total}

Generated via KaruviLab`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            const status = el("status-box");
            if (status) {
              status.textContent = "Summary copied to clipboard!";
              status.style.display = "block";
              setTimeout(() => {
                status.style.display = "none";
              }, 3e3);
            }
          }
        };
      }
      calculate();
    } catch (e) {
      console.error("Compound Interest Error:", e);
      const s = document.querySelector(".panel-scroll");
      if (s && !s.querySelector(".calc-error")) {
        const d = document.createElement("div");
        d.className = "calc-error";
        d.style.cssText = "padding:16px;margin:16px;background:#fee2e2;border-radius:8px;color:#b91c1c;text-align:center;font-weight:600";
        d.textContent = "Calculator failed to load. Please refresh.";
        s.prepend(d);
      }
    }
  });
})();
