(function() {
  const el = (id) => document.getElementById(id);
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const inr = (n) => "\u20B9" + fmt(n);
  const sliders = ["sip", "rate", "years", "stepup"];
  let sipChart;
  function updateChart(invested, gains) {
    const canvas = el("sip-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (sipChart) {
      sipChart.data.datasets[0].data = [invested, gains];
      sipChart.update();
    } else {
      sipChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Invested", "Gains"],
          datasets: [{
            data: [invested, gains],
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
              enabled: true,
              callbacks: {
                label: function(context) {
                  return context.label + ": " + inr(context.raw);
                }
              }
            }
          },
          maintainAspectRatio: false,
          animation: { duration: 800, easing: "easeOutQuart" }
        }
      });
    }
  }
  function calculate() {
    let monthlySipBase = +el("in-sip").value;
    let annualRate = +el("in-rate").value / 100;
    let years = +el("in-years").value;
    const stepUpPct = +el("in-stepup").value / 100;
    let initialLumpsum = +el("in-lumpsum").value || 0;
    if (monthlySipBase < 0) monthlySipBase = 0;
    if (monthlySipBase > 1e6) monthlySipBase = 1e6;
    if (annualRate < 0) annualRate = 0;
    if (annualRate > 1) annualRate = 1;
    if (years < 1) years = 1;
    if (years > 50) years = 50;
    if (initialLumpsum < 0) initialLumpsum = 0;
    if (initialLumpsum > 1e8) initialLumpsum = 1e8;
    const monthlyRate = annualRate / 12;
    const inflationRate = 0.06;
    el("val-sip").textContent = inr(monthlySipBase);
    el("val-rate").textContent = (annualRate * 100).toFixed(1) + "%";
    el("val-years").textContent = years + "Y";
    el("val-stepup").textContent = el("in-stepup").value + "%";
    el("in-sip").setAttribute("aria-valuenow", String(monthlySipBase));
    el("in-rate").setAttribute("aria-valuenow", el("in-rate").value);
    el("in-years").setAttribute("aria-valuenow", String(years));
    el("in-stepup").setAttribute("aria-valuenow", el("in-stepup").value);
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
      currentSip *= 1 + stepUpPct;
    }
    const totalValue = runningValue;
    const totalInvested = runningInvested;
    const totalGains = totalValue - totalInvested;
    const yieldPct = totalInvested > 0 ? totalGains / totalInvested * 100 : 0;
    const inflationAdjusted = totalValue / Math.pow(1 + inflationRate, years);
    el("out-total").textContent = inr(totalValue);
    el("out-invested").textContent = inr(totalInvested);
    el("out-gains").textContent = inr(totalGains);
    el("out-inflation").textContent = inr(inflationAdjusted);
    el("out-yield").textContent = Math.round(yieldPct) + "%";
    updateChart(totalInvested, totalGains);
    const tbody = el("res-table")?.querySelector("tbody");
    if (tbody) {
      tbody.innerHTML = yearlyData.map((d) => `
        <tr>
          <td>Year ${d.year}</td>
          <td>${inr(d.invested)}</td>
          <td style="color:#10b981">+${inr(d.interest)}</td>
          <td style="font-weight:700">${inr(d.total)}</td>
        </tr>
      `).join("");
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    try {
      sliders.forEach((id) => {
        el("in-" + id).addEventListener("input", calculate);
      });
      el("in-lumpsum").addEventListener("input", calculate);
      const btnToggle = el("btn-toggle-table");
      if (btnToggle) {
        btnToggle.onclick = () => {
          el("table-scroll")?.classList.toggle("open");
        };
      }
      const btnCopy = el("btn-copy");
      if (btnCopy) {
        btnCopy.onclick = () => {
          const sipVal = el("in-sip").value;
          const yearsVal = el("in-years").value;
          const rateVal = el("in-rate").value;
          const invested = el("out-invested").textContent;
          const gains = el("out-gains").textContent;
          const total = el("out-total").textContent;
          const text = `SIP Investment Summary
------------------
Monthly: ${inr(+sipVal)}
Period: ${yearsVal} Years
Rate: ${rateVal}%

Total Invested: ${invested}
Est. Gains: ${gains}
Total Value: ${total}

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
      console.error("SIP Calculator Error:", e);
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
