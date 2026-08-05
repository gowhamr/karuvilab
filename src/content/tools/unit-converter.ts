import { ToolContent } from '../../registry/types';

export const unitConverter: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: Unit Conversion & The Floating Point Problem

Welcome to the engineering guide to Unit Conversion. This handbook explains the hidden mathematical dangers of converting data, and the most expensive software bug in space exploration history.

---

## 1. Prerequisites: The $125 Million Disaster

Unit conversion seems like simple multiplication, but it is one of the most lethal blind spots in software engineering. 

**The Mars Climate Orbiter:**
In 1999, NASA lost a $125 million spacecraft because of a unit conversion bug. The software provided by Lockheed Martin generated thruster data in **Imperial units** (pound-seconds). The software built by NASA read that exact same data expecting **Metric units** (newton-seconds). 
Because the software lacked strict typing and dimensional analysis, the spacecraft fired its thrusters too hard, entered the Martian atmosphere too low, and burned up.

---

## 2. Engineering Challenge: The Floating Point Crisis

When building a unit converter in JavaScript or Python, developers quickly run into the IEEE 754 Floating Point standard.

**The Bug:**
If you try to convert 0.1 miles and 0.2 miles, and add them together in JavaScript:
\`console.log(0.1 + 0.2)\`
The result is not \`0.3\`. The result is \`0.30000000000000004\`.

**Why?** Computers store numbers in Base-2 (Binary). Just like you cannot perfectly divide $10$ by $3$ in Base-10 (it becomes 3.33333...), a computer cannot perfectly represent $0.1$ in Base-2. It creates an infinitely repeating binary fraction, which is eventually rounded off.

**The Fix:** Professional unit converters (especially those handling currency or scientific weights) never use standard floating-point numbers. They use **BigInt** (storing the number as an integer of the smallest unit, like cents instead of dollars) or external libraries like \`decimal.js\` to guarantee mathematical precision.

---

## 3. Advanced Concepts: Dimensional Analysis

Modern enterprise languages (like Rust or F#) can solve the NASA problem at compile time using **Dimensional Analysis**. 

Instead of passing a primitive \`Float\` (e.g., \`5.0\`), developers define strict types:
\`\`\`rust
let speed: MetersPerSecond = 5.0;
let distance: Miles = 10.0;
// The compiler will throw a fatal error if you try to add speed + distance!
\`\`\`
The compiler mathematically tracks the Units as if they were algebraic variables, ensuring that you can never accidentally mix Pounds and Newtons.

---

## 4. Production Workflows

- **E-Commerce Logistics:** Global shipping giants like Amazon rely on highly complex, real-time unit conversion engines to seamlessly translate product weights from Chinese Grams to American Ounces to calculate international freight taxes.
- **Frontend CSS:** Browsers constantly run unit conversion algorithms in the background, converting \`rem\`, \`em\`, and \`vh\` units into strict physical \`px\` coordinates on your monitor 60 times a second.

`,
  howTo: [
    "**Step 1:** Select the Category (e.g., Length, Mass, Temperature).",
    "**Step 2:** Select the 'From' unit and the 'To' unit.",
    "**Step 3:** Enter your value.",
    "**Step 4:** The engine executes precise internal logic to bypass standard floating-point errors, delivering the mathematically correct conversion."
  ],
  faq: [
    {
      question: "Why do temperature conversions use a different mathematical formula than length?",
      answer: "Most units (like meters to feet) are proportional and start at an absolute zero. Celsius and Fahrenheit do not share a zero point, meaning the converter must offset the baseline (+32 or -32) before multiplying the scale."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["Data Calculator", "Percentage Calculator"]
};
