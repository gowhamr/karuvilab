import { ToolContent } from '../../registry/types';

export const unitConverter: ToolContent = {
  detailedDescription:
    "Convert units across categories including length, weight, volume, temperature, speed, area, and time. All conversion factors are hard-coded and accurate — no internet connection required. Conversion is instant and runs entirely in the browser.",
  howTo: [
    "Select the unit category (e.g., Length, Weight, Temperature).",
    "Enter the value to convert in the left input.",
    "Select the source unit and the target unit from the dropdowns.",
    "The converted value updates instantly.",
  ],
  faq: [
    {
      question: "Does it support metric and imperial units?",
      answer:
        "Yes. Both metric (km, kg, L, °C) and imperial (mi, lb, fl oz, °F) units are supported across all categories.",
    },
    {
      question: "How is temperature conversion handled?",
      answer:
        "Temperature uses additive formulas (e.g., °C to °F: multiply by 9/5 and add 32), not a simple multiplication factor.",
    },
    {
      question: "Can I convert cooking measurements?",
      answer:
        "Yes. Volume conversion includes cups, tablespoons, teaspoons, fl oz, mL, and L.",
    },
  ],
  useCases: [
    "Converting recipe measurements from US cups to millilitres",
    "Converting a vehicle speed from mph to km/h",
    "Checking a running pace in minutes per kilometre vs. per mile",
    "Converting property area from square feet to square metres",
  ],
  examples: [
    {
      label: "Miles to kilometres",
      input: "5 miles",
      output: "8.047 km",
    },
    {
      label: "Fahrenheit to Celsius",
      input: "98.6 °F",
      output: "37 °C",
    },
  ],
  commonErrors: [
    {
      error: "Temperature conversion gives a nonsensical result",
      fix: "Temperature is not a multiplicative conversion. Ensure you selected the Temperature category, not a generic multiplier.",
    },
    {
      error: "Result has many decimal places",
      fix: "Round to the required precision. The tool displays full precision to avoid rounding errors in chained conversions.",
    },
  ],
  alternatives: ["UnitConverters.net", "Google unit conversion", "Wolfram Alpha"],
};
