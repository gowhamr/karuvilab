document.addEventListener("DOMContentLoaded", () => {
  const el = (id) => document.getElementById(id);
  const inVal = el("in-val");
  const outVal = el("out-val");
  const inUnit = el("in-unit");
  const outUnit = el("out-unit");
  const swapBtn = el("swap-btn");
  const quickContainer = el("quick-conversions");
  const DATA = {
    length: {
      base: "m",
      units: {
        "Millimeter (mm)": 1e-3,
        "Centimeter (cm)": 0.01,
        "Meter (m)": 1,
        "Kilometer (km)": 1e3,
        "Inch (in)": 0.0254,
        "Foot (ft)": 0.3048,
        "Yard (yd)": 0.9144,
        "Mile (mi)": 1609.34
      }
    },
    weight: {
      base: "kg",
      units: {
        "Milligram (mg)": 1e-6,
        "Gram (g)": 1e-3,
        "Kilogram (kg)": 1,
        "Ounce (oz)": 0.0283495,
        "Pound (lb)": 0.453592,
        "Stone (st)": 6.35029
      }
    },
    temp: { base: "c", units: { "Celsius (\xB0C)": 1, "Fahrenheit (\xB0F)": 1, "Kelvin (K)": 1 } },
    area: {
      base: "sqm",
      units: {
        "Sq Meter (m\xB2)": 1,
        "Sq Kilometer (km\xB2)": 1e6,
        "Sq Foot (ft\xB2)": 0.092903,
        "Acre (ac)": 4046.86,
        "Hectare (ha)": 1e4
      }
    },
    volume: {
      base: "l",
      units: {
        "Milliliter (ml)": 1e-3,
        "Liter (l)": 1,
        "Cubic Meter (m\xB3)": 1e3,
        "Teaspoon (tsp)": 492892e-8,
        "Tablespoon (tbsp)": 0.0147868,
        "Fluid Ounce (fl oz)": 0.0295735,
        "Cup (cup)": 0.24,
        "Pint (pt)": 0.473176,
        "Quart (qt)": 0.946353,
        "Gallon (gal)": 3.78541
      }
    }
  };
  let currentCat = "length";
  function populateUnits() {
    const units = Object.keys(DATA[currentCat].units);
    inUnit.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join("");
    outUnit.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join("");
    if (currentCat === "length") {
      inUnit.value = "Kilometer (km)";
      outUnit.value = "Mile (mi)";
    }
    if (currentCat === "weight") {
      inUnit.value = "Kilogram (kg)";
      outUnit.value = "Pound (lb)";
    }
    if (currentCat === "temp") {
      inUnit.value = "Celsius (\xB0C)";
      outUnit.value = "Fahrenheit (\xB0F)";
    }
    convert();
  }
  function convert() {
    const val = parseFloat(inVal.value);
    if (isNaN(val)) {
      outVal.value = "";
      return;
    }
    const from = inUnit.value;
    const to = outUnit.value;
    if (currentCat === "temp") {
      let result = val;
      if (from.includes("Celsius") && to.includes("Fahrenheit")) result = val * 9 / 5 + 32;
      else if (from.includes("Celsius") && to.includes("Kelvin")) result = val + 273.15;
      else if (from.includes("Fahrenheit") && to.includes("Celsius")) result = (val - 32) * 5 / 9;
      else if (from.includes("Fahrenheit") && to.includes("Kelvin")) result = (val - 32) * 5 / 9 + 273.15;
      else if (from.includes("Kelvin") && to.includes("Celsius")) result = val - 273.15;
      else if (from.includes("Kelvin") && to.includes("Fahrenheit")) result = (val - 273.15) * 9 / 5 + 32;
      outVal.value = result.toLocaleString(void 0, { maximumFractionDigits: 4 });
    } else {
      const fromFactor = DATA[currentCat].units[from];
      const toFactor = DATA[currentCat].units[to];
      const result = val * fromFactor / toFactor;
      outVal.value = result.toLocaleString(void 0, { maximumFractionDigits: 4 }).replace(/,/g, "");
    }
  }
  document.querySelectorAll(".cat-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".cat-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCat = tab.dataset.cat;
      populateUnits();
    });
  });
  inVal.addEventListener("input", convert);
  inUnit.addEventListener("change", convert);
  outUnit.addEventListener("change", convert);
  swapBtn.onclick = () => {
    const temp = inUnit.value;
    inUnit.value = outUnit.value;
    outUnit.value = temp;
    convert();
  };
  populateUnits();
});
