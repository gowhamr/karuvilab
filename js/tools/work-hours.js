document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const container = el("timesheet-container");
  const addBtn = el("add-day");
  const rateIn = el("hourly-rate");
  const outHours = el("total-hours");
  const outDecimal = el("total-decimal");
  const outPay = el("total-pay");
  const payDisplay = el("pay-display");
  function calculate() {
    let totalMinutes = 0;
    const rows = container.querySelectorAll(".time-row");
    rows.forEach((row) => {
      const start = row.querySelector(".start-time").value;
      const end = row.querySelector(".end-time").value;
      const breakMin = parseInt(row.querySelector(".break-time").value) || 0;
      if (start && end) {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        let diff = eh * 60 + em - (sh * 60 + sm);
        if (diff < 0) diff += 24 * 60;
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
      payDisplay.style.display = "block";
      outPay.textContent = `$${(decimal * rate).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      payDisplay.style.display = "none";
    }
  }
  function addDay() {
    const row = document.createElement("div");
    row.className = "time-row";
    row.innerHTML = `
      <div><input type="time" class="workspace-input start-time" value="09:00"></div>
      <div><input type="time" class="workspace-input end-time" value="17:00"></div>
      <div><input type="number" class="workspace-input break-time" placeholder="30" value="0"></div>
      <button class="btn btn-sm btn-outline remove-row">\xD7</button>
    `;
    container.appendChild(row);
    row.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", calculate));
    row.querySelector(".remove-row")?.addEventListener("click", () => {
      row.remove();
      calculate();
    });
    calculate();
  }
  addBtn.addEventListener("click", addDay);
  rateIn.addEventListener("input", calculate);
  container.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", calculate));
  container.querySelector(".remove-row")?.addEventListener("click", (e) => {
    e.target.closest(".time-row")?.remove();
    calculate();
  });
  calculate();
});
