(function() {
  const display = document.getElementById("bc-display");
  const sub = document.getElementById("bc-sub");
  if (!display || !sub) return;
  let current = "0";
  let previous = null;
  let op = null;
  let resetNext = false;
  const updateDisplay = () => {
    display.textContent = current.length > 14 ? (+current).toExponential(6) : current;
    sub.textContent = previous !== null ? `${previous} ${op === "*" ? "\xD7" : op === "/" ? "\xF7" : op}` : "";
  };
  const calc = (a, b, o) => {
    const na = +a;
    const nb = +b;
    switch (o) {
      case "+":
        return na + nb;
      case "-":
        return na - nb;
      case "*":
        return na * nb;
      case "/":
        return nb === 0 ? NaN : na / nb;
      case "%":
        return na % nb;
      default:
        return 0;
    }
  };
  const press = (k) => {
    if (k === "AC") {
      current = "0";
      previous = null;
      op = null;
    } else if (k === "CE") {
      current = "0";
    } else if (k === "\xB1") {
      current = (+current * -1).toString();
    } else if (k === ".") {
      if (!current.includes(".")) current += ".";
    } else if (/[0-9]/.test(k)) {
      if (current === "0" || resetNext) {
        current = k;
        resetNext = false;
      } else {
        current += k;
      }
    } else if (["+", "-", "*", "/", "%"].includes(k)) {
      if (previous !== null && !resetNext && op) {
        const r = calc(previous, current, op);
        current = isFinite(r) ? (Math.round(r * 1e10) / 1e10).toString() : "Error";
      }
      previous = current;
      op = k;
      resetNext = true;
    } else if (k === "=") {
      if (previous !== null && op) {
        const r = calc(previous, current, op);
        current = isFinite(r) ? (Math.round(r * 1e10) / 1e10).toString() : "Error";
        previous = null;
        op = null;
        resetNext = true;
      }
    }
    updateDisplay();
  };
  document.querySelectorAll(".calc-btn").forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.k;
      if (k) press(k);
    };
  });
  document.onkeydown = (e) => {
    const map = { "Enter": "=", "=": "=", "Backspace": "CE", "Escape": "AC" };
    const k = map[e.key] || e.key;
    if (/^[0-9+\-*/.%]$/.test(k) || ["=", "AC", "CE"].includes(k)) {
      e.preventDefault();
      press(k);
    }
  };
  updateDisplay();
})();
