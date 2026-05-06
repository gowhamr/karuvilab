(function() {
  const el = (id) => document.getElementById(id);
  const fmt = (n, d = 0) => n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const inr = (n, d = 0) => "\u20B9" + fmt(n, d);
  const sliders = ["amt", "rate", "years"];
  function calculate() {
    const P = +el("in-amt").value;
    const annualRate = +el("in-rate").value;
    const years = +el("in-years").value;
    const n = years * 12;
    const statusBox = el("status-box");
    const btnCopy = el("btn-copy");
    const btnTable = el("btn-toggle-table");
    if (annualRate < 0 || !isFinite(annualRate) || P <= 0 || n <= 0) {
      statusBox.textContent = annualRate < 0 ? "Interest rate cannot be negative." : "Please enter a valid amount and tenure.";
      statusBox.style.display = "block";
      statusBox.style.background = "#fee2e2";
      statusBox.style.color = "#b91c1c";
      if (btnCopy) btnCopy.disabled = true;
      if (btnTable) btnTable.disabled = true;
      el("out-emi").textContent = "\u20B90.00";
      el("out-principal").textContent = "\u20B90.00";
      el("out-interest").textContent = "\u20B90.00";
      el("out-total").textContent = "\u20B90.00";
      el("out-interest-ratio").textContent = "0%";
      const tbody2 = el("res-table")?.querySelector("tbody");
      if (tbody2) tbody2.innerHTML = "";
      return;
    } else {
      statusBox.style.display = "none";
      if (btnCopy) btnCopy.disabled = false;
      if (btnTable) btnTable.disabled = false;
    }
    const r = annualRate / 12 / 100;
    el("val-amt").textContent = inr(P);
    el("val-rate").textContent = annualRate + "%";
    el("val-years").textContent = years + "Y";
    el("in-amt").setAttribute("aria-valuenow", String(P));
    el("in-rate").setAttribute("aria-valuenow", String(annualRate));
    el("in-years").setAttribute("aria-valuenow", String(years));
    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    if (!isFinite(emi) || isNaN(emi)) emi = 0;
    const totalPayable = emi * n;
    const totalInterest = Math.max(0, totalPayable - P);
    const interestRatio = totalPayable > 0 ? totalInterest / totalPayable : 0;
    el("out-emi").textContent = inr(emi, 2);
    el("out-principal").textContent = inr(P, 2);
    el("out-interest").textContent = inr(totalInterest, 2);
    el("out-total").textContent = inr(totalPayable, 2);
    el("out-interest-ratio").textContent = Math.round(interestRatio * 100) + "%";
    const circumference = 2 * Math.PI * 40;
    const pSeg = el("donut-principal");
    const iSeg = el("donut-interest");
    if (pSeg && iSeg) {
      const pRatio = P / totalPayable;
      pSeg.style.strokeDasharray = `${circumference * pRatio} ${circumference}`;
      pSeg.style.strokeDashoffset = "0";
      iSeg.style.strokeDasharray = `${circumference * (1 - pRatio)} ${circumference}`;
      iSeg.style.strokeDashoffset = String(-(circumference * pRatio));
    }
    const tbody = el("res-table")?.querySelector("tbody");
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
      tbody.innerHTML = yearlyData.join("");
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    try {
      sliders.forEach((id) => {
        el("in-" + id).addEventListener("input", calculate);
      });
      const toggleBtn = el("btn-toggle-table");
      if (toggleBtn) {
        toggleBtn.onclick = () => {
          el("table-scroll")?.classList.toggle("open");
        };
      }
      const copyBtn = el("btn-copy");
      if (copyBtn) {
        copyBtn.onclick = () => {
          const text = `Loan EMI Details
------------------
Principal: ${inr(+el("in-amt").value)}
Rate: ${el("in-rate").value}%
Tenure: ${el("in-years").value} Years

Monthly EMI: ${el("out-emi").textContent}
Total Interest: ${el("out-interest").textContent}
Total Payable: ${el("out-total").textContent}

Generated via KaruviLab`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            const status = el("status-box");
            if (status) {
              status.textContent = "Details copied to clipboard!";
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
      console.error("EMI Calculator Error:", e);
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
