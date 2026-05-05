/* ===== smart-converter.ts – Comprehensive multi-category unit converter ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const inVal = el('in-val') as HTMLInputElement;
  const outVal = el('out-val') as HTMLInputElement;
  const inUnit = el('in-unit') as HTMLSelectElement;
  const outUnit = el('out-unit') as HTMLSelectElement;
  const swapBtn = el('swap-btn') as HTMLDivElement;
  const quickContainer = el('quick-conversions') as HTMLDivElement;

  type Category = 'length' | 'weight' | 'temp' | 'area' | 'volume';

  const DATA: Record<Category, { units: Record<string, number>, base: string }> = {
    length: {
      base: 'm',
      units: {
        'Millimeter (mm)': 0.001,
        'Centimeter (cm)': 0.01,
        'Meter (m)': 1,
        'Kilometer (km)': 1000,
        'Inch (in)': 0.0254,
        'Foot (ft)': 0.3048,
        'Yard (yd)': 0.9144,
        'Mile (mi)': 1609.34
      }
    },
    weight: {
      base: 'kg',
      units: {
        'Milligram (mg)': 0.000001,
        'Gram (g)': 0.001,
        'Kilogram (kg)': 1,
        'Ounce (oz)': 0.0283495,
        'Pound (lb)': 0.453592,
        'Stone (st)': 6.35029
      }
    },
    temp: { base: 'c', units: { 'Celsius (°C)': 1, 'Fahrenheit (°F)': 1, 'Kelvin (K)': 1 } },
    area: {
      base: 'sqm',
      units: {
        'Sq Meter (m²)': 1,
        'Sq Kilometer (km²)': 1000000,
        'Sq Foot (ft²)': 0.092903,
        'Acre (ac)': 4046.86,
        'Hectare (ha)': 10000
      }
    },
    volume: {
      base: 'l',
      units: {
        'Milliliter (ml)': 0.001,
        'Liter (l)': 1,
        'Cubic Meter (m³)': 1000,
        'Teaspoon (tsp)': 0.00492892,
        'Tablespoon (tbsp)': 0.0147868,
        'Fluid Ounce (fl oz)': 0.0295735,
        'Cup (cup)': 0.24,
        'Pint (pt)': 0.473176,
        'Quart (qt)': 0.946353,
        'Gallon (gal)': 3.78541
      }
    }
  };

  let currentCat: Category = 'length';

  function populateUnits() {
    const units = Object.keys(DATA[currentCat].units);
    inUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    outUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    
    // Set some defaults
    if (currentCat === 'length') { inUnit.value = 'Kilometer (km)'; outUnit.value = 'Mile (mi)'; }
    if (currentCat === 'weight') { inUnit.value = 'Kilogram (kg)'; outUnit.value = 'Pound (lb)'; }
    if (currentCat === 'temp') { inUnit.value = 'Celsius (°C)'; outUnit.value = 'Fahrenheit (°F)'; }
    
    convert();
  }

  function convert() {
    const val = parseFloat(inVal.value);
    if (isNaN(val)) { outVal.value = ''; return; }

    const from = inUnit.value;
    const to = outUnit.value;

    if (currentCat === 'temp') {
      let result = val;
      if (from.includes('Celsius') && to.includes('Fahrenheit')) result = (val * 9/5) + 32;
      else if (from.includes('Celsius') && to.includes('Kelvin')) result = val + 273.15;
      else if (from.includes('Fahrenheit') && to.includes('Celsius')) result = (val - 32) * 5/9;
      else if (from.includes('Fahrenheit') && to.includes('Kelvin')) result = (val - 32) * 5/9 + 273.15;
      else if (from.includes('Kelvin') && to.includes('Celsius')) result = val - 273.15;
      else if (from.includes('Kelvin') && to.includes('Fahrenheit')) result = (val - 273.15) * 9/5 + 32;
      outVal.value = result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    } else {
      const fromFactor = DATA[currentCat].units[from];
      const toFactor = DATA[currentCat].units[to];
      const result = (val * fromFactor) / toFactor;
      outVal.value = result.toLocaleString(undefined, { maximumFractionDigits: 4 }).replace(/,/g, '');
    }
  }

  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCat = (tab as HTMLElement).dataset.cat as Category;
      populateUnits();
    });
  });

  inVal.addEventListener('input', convert);
  inUnit.addEventListener('change', convert);
  outUnit.addEventListener('change', convert);

  swapBtn.onclick = () => {
    const temp = inUnit.value;
    inUnit.value = outUnit.value;
    outUnit.value = temp;
    convert();
  };

  populateUnits();
});
