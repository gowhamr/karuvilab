export const CATEGORIES_DATA = {
    length: {
        label: "Length",
        units: {
            m: { label: "Metres (m)", toBase: (v) => v, fromBase: (v) => v },
            km: { label: "Kilometres (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            cm: { label: "Centimetres (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
            mm: { label: "Millimetres (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            in: { label: "Inches (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
            ft: { label: "Feet (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
            yd: { label: "Yards (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
            mi: { label: "Miles (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
        },
    },
    weight: {
        label: "Weight",
        units: {
            kg: { label: "Kilograms (kg)", toBase: (v) => v, fromBase: (v) => v },
            g: { label: "Grams (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            mg: { label: "Milligrams (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
            lb: { label: "Pounds (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
            oz: { label: "Ounces (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
            ton: { label: "Metric Tons (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        },
    },
    volume: {
        label: "Volume",
        units: {
            L: { label: "Litres (L)", toBase: (v) => v, fromBase: (v) => v },
            mL: { label: "Millilitres (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            "m3": { label: "Cubic Metres (m3)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            "cm3": { label: "Cubic Centimetres (cm3)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            "in3": { label: "Cubic Inches (in3)", toBase: (v) => v * 0.0163871, fromBase: (v) => v / 0.0163871 },
            "ft3": { label: "Cubic Feet (ft3)", toBase: (v) => v * 28.3168, fromBase: (v) => v / 28.3168 },
            gal: { label: "Gallons (US gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
            "fl oz": { label: "Fluid Ounces (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
        },
    },
    temperature: {
        label: "Temperature",
        units: {
            "C": {
                label: "Celsius (C)",
                toBase: (v) => v,
                fromBase: (v) => v,
            },
            "F": {
                label: "Fahrenheit (F)",
                toBase: (v) => (v - 32) * (5 / 9),
                fromBase: (v) => v * (9 / 5) + 32,
            },
            K: {
                label: "Kelvin (K)",
                toBase: (v) => v - 273.15,
                fromBase: (v) => v + 273.15,
            },
        },
    },
    area: {
        label: "Area",
        units: {
            "m2": { label: "Sq Metres (m2)", toBase: (v) => v, fromBase: (v) => v },
            "km2": { label: "Sq Kilometres (km2)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
            "cm2": { label: "Sq Centimetres (cm2)", toBase: (v) => v / 1e4, fromBase: (v) => v * 1e4 },
            "ft2": { label: "Sq Feet (ft2)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
            "yd2": { label: "Sq Yards (yd2)", toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
            ac: { label: "Acres (ac)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
            ha: { label: "Hectares (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
        },
    },
    speed: {
        label: "Speed",
        units: {
            "m/s": { label: "Metres/sec (m/s)", toBase: (v) => v, fromBase: (v) => v },
            "km/h": { label: "Km/hour (km/h)", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
            mph: { label: "Miles/hour (mph)", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
            knot: { label: "Knots (kn)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
        },
    },
};
export function convertUnit(categoryKey, fromUnitKey, toUnitKey, value) {
    const category = CATEGORIES_DATA[categoryKey];
    if (!category)
        throw new Error(`Unknown category: ${categoryKey}`);
    const fromUnit = category.units[fromUnitKey];
    const toUnit = category.units[toUnitKey];
    if (!fromUnit)
        throw new Error(`Unknown from-unit: ${fromUnitKey}`);
    if (!toUnit)
        throw new Error(`Unknown to-unit: ${toUnitKey}`);
    const base = fromUnit.toBase(value);
    return toUnit.fromBase(base);
}
